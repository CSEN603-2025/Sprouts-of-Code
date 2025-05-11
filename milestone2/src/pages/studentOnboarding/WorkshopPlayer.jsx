import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProWorkshops } from '../../data/dummyData';
import { useAuth } from '../../context/AuthContext';
import testVideo from '../../assets/test video.mp4';
import './WorkshopPlayer.css';

const WorkshopPlayer = () => {
  const { workshopId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const chatEndRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Get workshop details
    const workshops = getProWorkshops();
    const currentWorkshop = workshops.find(w => w.id === parseInt(workshopId));
    setWorkshop(currentWorkshop);

    // Load saved notes
    const savedNotes = localStorage.getItem(`workshop_notes_${workshopId}_${user?.id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }

    // Simulate receiving chat messages only for live workshops
    if (currentWorkshop?.type === 'live') {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance of new message
          const newMsg = {
            id: Date.now(),
            user: 'Attendee ' + Math.floor(Math.random() * 100),
            message: 'This is a sample message',
            time: new Date().toLocaleTimeString()
          };
          setChatMessages(prev => [...prev, newMsg]);
          setUnreadMessages(prev => prev + 1);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [workshopId, user]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      user: user.name,
      message: newMessage,
      time: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`workshop_notes_${workshopId}_${user?.id}`, newNotes);
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be sent to the backend
    console.log('Rating:', rating, 'Feedback:', feedback);
    setShowFeedbackModal(false);
    setRating(0);
    setFeedback('');
  };

  if (!workshop) {
    return <div>Loading...</div>;
  }

  return (
    <div className="workshop-player">
      <div className="player-header">
        <button 
          className="back-button"
          onClick={() => navigate('/student/workshops')}
        >
          <span className="back-arrow">←</span>
          <span className="back-text">Back to Workshops</span>
        </button>
        <h1>{workshop.title}</h1>
      </div>

      <div className="workshop-content">
        <div className="main-content">
          <div className="video-container">
            <video
              ref={videoRef}
              controls={workshop.type === 'pre-recorded'}
              autoPlay={workshop.type === 'live'}
              className="workshop-video"
              src={testVideo}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="workshop-info">
            <div className="speaker-info">
              <h3>Speaker</h3>
              <p className="speaker-name">{workshop.speaker}</p>
              <p className="speaker-title">{workshop.speakerTitle}</p>
            </div>

            <div className="workshop-details">
              <h3>Workshop Details</h3>
              <p className="description">{workshop.description}</p>
              <div className="topics">
                {workshop.topics.map((topic, index) => (
                  <span key={index} className="topic-tag">{topic}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="side-panels">
          {workshop.type === 'live' && (
            <div className="chat-panel">
              <div className="panel-header">
                <h3>Live Chat {unreadMessages > 0 && <span className="unread-badge">{unreadMessages}</span>}</h3>
              </div>
              <div className="chat-messages">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="chat-message">
                    <div className="message-header">
                      <span className="user">{msg.user}</span>
                      <span className="time">{msg.time}</span>
                    </div>
                    <p className="message-content">{msg.message}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button type="submit">Send</button>
              </form>
            </div>
          )}

          <div className="notes-panel">
            <div className="panel-header">
              <h3>My Notes</h3>
            </div>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Take notes here..."
              className="notes-textarea"
            />
          </div>

          <div className="rating-panel">
            <div className="panel-header">
              <h3>Rate this Workshop</h3>
            </div>
            <div className="rating-content">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${star <= rating ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} out of 5`}
                  >
                    ★
                  </button>
                ))}
                <span className="rating-text">
                  {rating ? `${rating} out of 5` : 'Click to rate'}
                </span>
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your feedback about this workshop..."
                className="feedback-textarea"
              />
              <button 
                className="submit-feedback"
                onClick={handleRatingSubmit}
                disabled={!rating}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopPlayer; 