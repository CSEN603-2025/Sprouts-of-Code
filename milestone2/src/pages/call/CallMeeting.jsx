import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import './CallMeeting.css';

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 2000,
  minWidth: 320,
  textAlign: 'center',
};

const CallMeeting = () => {
  const location = useLocation();
  const otherPartyName = location.state?.otherPartyName || 'SCAD';
  const [seconds, setSeconds] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [scadLeft, setScadLeft] = useState(false);
  const [showScadLeftModal, setShowScadLeftModal] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();
  const timerRef = useRef();
  const videoRef = useRef();
  const streamRef = useRef();
  const screenStreamRef = useRef();
  const scadTimeoutRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    // SCAD leaves after 10 seconds
    scadTimeoutRef.current = setTimeout(() => {
      setScadLeft(true);
      setShowScadLeftModal(true);
    }, 10000);
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(scadTimeoutRef.current);
    };
  }, []);

  // Handle camera on/off
  useEffect(() => {
    if (screenSharing) return; // Don't show camera if sharing screen
    if (cameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          streamRef.current = stream;
        })
        .catch(() => {
          // fallback: camera not available or denied
        });
    } else {
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    // Clean up on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraOn, screenSharing]);

  // Handle screen sharing
  useEffect(() => {
    if (!screenSharing) {
      // If turning off screen sharing, revert to camera if on
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      if (cameraOn) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
            streamRef.current = stream;
          })
          .catch(() => {});
      }
      return;
    }
    // Start screen sharing
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(screenStream => {
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
          videoRef.current.play();
        }
        screenStreamRef.current = screenStream;
        // When user stops sharing from browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
        };
      })
      .catch(() => {
        setScreenSharing(false);
      });
    // Clean up on unmount
    return () => {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
    };
  }, [screenSharing, cameraOn]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleLeave = () => {
    clearInterval(timerRef.current);
    // Stop camera and screen streams on leave
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    navigate('/student'); // or wherever you want to redirect
  };

  const handleScreenShareToggle = () => {
    setScreenSharing(s => !s);
  };

  return (
    <div className="zoom-meeting-container">
      <div className="meeting-header">
        <div className="meeting-info">
          <div className="meeting-title">Meeting with {otherPartyName}</div>
          <div className="meeting-timer">{formatTime(seconds)}</div>
        </div>
        <div className="meeting-controls">
          <button className="header-btn" onClick={() => setShowParticipants(!showParticipants)}>
            <PeopleIcon />
            <span>Participants</span>
          </button>
          <button className="header-btn" onClick={() => setShowChat(!showChat)}>
            <ChatIcon />
            <span>Chat</span>
          </button>
          <button className="header-btn">
            <MoreVertIcon />
          </button>
        </div>
      </div>

      <div className="meeting-content">
        <div className="video-grid">
          <div className="video-container main">
            <div className="video-wrapper">
              {scadLeft ? (
                <div className="video-placeholder">
                  <span>{otherPartyName} Left</span>
                </div>
              ) : (
                <div className="video-placeholder">
                  <span>{otherPartyName}</span>
                </div>
              )}
            </div>
            <div className="participant-info">
              <span className="participant-name">{otherPartyName}</span>
              <div className="status-indicators">
                <span className={`status-indicator ${!scadLeft ? 'online' : 'offline'}`}>
                  <span className="status-dot"></span>
                  {!scadLeft ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <div className="video-container">
            <div className="video-wrapper">
              {(cameraOn || screenSharing) ? (
                <video
                  ref={videoRef}
                  className="video-element"
                  autoPlay
                  muted
                  playsInline
                />
              ) : (
                <div className="video-placeholder">
                  <span>Camera Off</span>
                </div>
              )}
            </div>
            <div className="participant-info">
              <span className="participant-name">You (Student)</span>
              <div className="status-indicators">
                {!cameraOn && <span className="status-indicator">Camera Off</span>}
                {!micOn && <span className="status-indicator">Muted</span>}
                <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                  <span className="status-dot"></span>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {showParticipants && (
          <div className="participants-panel">
            <div className="panel-header">
              <h3>Participants (2)</h3>
              <button className="close-panel" onClick={() => setShowParticipants(false)}>×</button>
            </div>
            <div className="participants-list">
              <div className="participant-item">
                <div className="participant-info-panel">
                  <span className="participant-name">You (Student)</span>
                  <span className="participant-role">Host</span>
                </div>
                <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                  <span className="status-dot"></span>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="participant-item">
                <div className="participant-info-panel">
                  <span className="participant-name">{otherPartyName}</span>
                  <span className="participant-role">Participant</span>
                </div>
                <span className={`status-indicator ${!scadLeft ? 'online' : 'offline'}`}>
                  <span className="status-dot"></span>
                  {!scadLeft ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        )}

        {showChat && (
          <div className="chat-panel">
            <div className="panel-header">
              <h3>Meeting Chat</h3>
              <button className="close-panel" onClick={() => setShowChat(false)}>×</button>
            </div>
            <div className="chat-messages">
              <div className="message">
                <span className="message-sender">{otherPartyName}</span>
                <span className="message-time">10:00 AM</span>
                <p className="message-content">Hello! How can I help you today?</p>
              </div>
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Type a message..." />
              <button className="send-btn">Send</button>
            </div>
          </div>
        )}
      </div>

      <div className="meeting-footer">
        <div className="footer-left">
          <button
            className={`control-btn ${cameraOn ? '' : 'off'}`}
            onClick={() => setCameraOn(c => !c)}
            disabled={screenSharing}
          >
            {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
            <span>{cameraOn ? 'Stop Video' : 'Start Video'}</span>
          </button>
          <button
            className={`control-btn ${micOn ? '' : 'off'}`}
            onClick={() => setMicOn(m => !m)}
          >
            {micOn ? <MicIcon /> : <MicOffIcon />}
            <span>{micOn ? 'Mute' : 'Unmute'}</span>
          </button>
          <button
            className={`control-btn ${screenSharing ? 'on' : ''}`}
            onClick={handleScreenShareToggle}
          >
            {screenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            <span>{screenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
          </button>
        </div>
        <div className="footer-right">
          <button className="control-btn leave" onClick={handleLeave}>
            <CallEndIcon />
            <span>Leave</span>
          </button>
        </div>
      </div>

      <Modal open={showScadLeftModal} onClose={() => setShowScadLeftModal(false)}>
        <Box sx={modalStyle}>
          <h2>{otherPartyName} has left the call</h2>
          <p>The other participant has left the meeting.</p>
          <button className="btn btn-primary" onClick={() => setShowScadLeftModal(false)}>
            OK
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default CallMeeting; 