import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
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
  const [seconds, setSeconds] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [scadLeft, setScadLeft] = useState(false);
  const [showScadLeftModal, setShowScadLeftModal] = useState(false);
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
    <div className="call-meeting-container">
      <div className="call-header">
        <h2>Video Call with <span style={{ color: '#1976d2' }}>SCAD</span></h2>
        <div className="call-timer">{formatTime(seconds)}</div>
      </div>
      <div className="call-participants">
        <div className="participant self">
          <div className="video-preview" style={{ background: cameraOn || screenSharing ? '#222' : '#888' }}>
            {(cameraOn || screenSharing) ? (
              <video
                ref={videoRef}
                className="video-element"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                autoPlay
                muted
                playsInline
              />
            ) : (
              <span className="video-off">Camera Off</span>
            )}
          </div>
          <div className="participant-label">You (Student)</div>
        </div>
        <div className="participant scad">
          <div className="video-preview" style={{ background: scadLeft ? '#888' : '#222' }}>
            {scadLeft ? (
              <span className="video-off">SCAD Left</span>
            ) : (
              <span className="video-on">SCAD</span>
            )}
          </div>
          <div className="participant-label">SCAD</div>
        </div>
      </div>
      <div className="call-controls">
        <button
          className={`call-btn ${cameraOn ? '' : 'off'}`}
          aria-label={cameraOn ? 'Turn camera off' : 'Turn camera on'}
          onClick={() => setCameraOn(c => !c)}
          disabled={screenSharing}
        >
          {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
        </button>
        <button
          className={`call-btn ${micOn ? '' : 'off'}`}
          aria-label={micOn ? 'Mute mic' : 'Unmute mic'}
          onClick={() => setMicOn(m => !m)}
        >
          {micOn ? <MicIcon /> : <MicOffIcon />}
        </button>
        <button
          className={`call-btn ${screenSharing ? 'on' : ''}`}
          aria-label={screenSharing ? 'Stop screen sharing' : 'Share screen'}
          onClick={handleScreenShareToggle}
        >
          {screenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
        </button>
        <button
          className="call-btn leave"
          aria-label="Leave call"
          onClick={handleLeave}
        >
          <CallEndIcon />
        </button>
      </div>
      {/* SCAD left notification modal */}
      <Modal open={showScadLeftModal} onClose={() => setShowScadLeftModal(false)}>
        <Box sx={modalStyle}>
          <h2>SCAD has left the call</h2>
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