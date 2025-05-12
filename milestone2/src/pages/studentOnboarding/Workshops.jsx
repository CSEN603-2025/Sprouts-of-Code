import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProWorkshops } from '../../data/dummyData';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import { Dialog, DialogContent } from '@mui/material';
import Certificate from './Certificate';
import './Workshops.css';

const Workshops = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateStudent } = useStudent();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, live, pre-recorded
  const [workshops, setWorkshops] = useState([]);
  const [registeredWorkshops, setRegisteredWorkshops] = useState(new Set());
  const [completedWorkshops, setCompletedWorkshops] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    // Get workshops and check registration status
    const allWorkshops = getProWorkshops();
    // In a real app, this would come from an API
    const userRegistrations = JSON.parse(localStorage.getItem(`workshop_registrations_${user?.id}`) || '[]');
    const completed = JSON.parse(localStorage.getItem(`completed_workshops_${user?.id}`) || '[]');
    setRegisteredWorkshops(new Set(userRegistrations));
    setCompletedWorkshops(completed);
    setWorkshops(allWorkshops);
  }, [user]);

  // Filter workshops based on search and type
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(search.toLowerCase()) ||
                         workshop.speaker.toLowerCase().includes(search.toLowerCase()) ||
                         workshop.topics.some(topic => topic.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || workshop.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleStartWorkshop = (workshopId) => {
    navigate(`/student/workshops/${workshopId}`);
  };

  const handleViewCertificate = (workshop) => {
    setSelectedCertificate(workshop);
  };

  const handleCloseCertificate = () => {
    setSelectedCertificate(null);
  };

  const handleDownloadCertificate = () => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading certificate...');
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: new Date().toLocaleString(),
      read: false
    };

    // Get current notifications from localStorage
    const currentNotifications = JSON.parse(localStorage.getItem(`notifications_${user?.id}`) || '[]');
    const updatedNotifications = [newNotification, ...currentNotifications];
    
    // Save to localStorage
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };

  const handleRegistration = (workshopId, isRegistered) => {
    const newRegistrations = isRegistered
      ? [...registeredWorkshops].filter(id => id !== workshopId)
      : [...registeredWorkshops, workshopId];
    
    setRegisteredWorkshops(new Set(newRegistrations));
    localStorage.setItem(`workshop_registrations_${user?.id}`, JSON.stringify(newRegistrations));

    const workshop = workshops.find(w => w.id === workshopId);
    if (workshop) {
      if (isRegistered) {
        // Unregistration notification
        addNotification(`You have unregistered from "${workshop.title}".`);
      } else {
        // Registration notification
        addNotification(`You have successfully registered for "${workshop.title}"! You will receive a reminder before the workshop.`);
      }
    }
  };

  return (
    <div className="workshops-page">
      
      <Dialog
        open={!!selectedCertificate}
        onClose={handleCloseCertificate}
        maxWidth="md"
        fullWidth
        className="certificate-modal"
      >
        <DialogContent className="certificate-modal-content">
          {selectedCertificate && (
            <Certificate
              workshop={selectedCertificate}
              student={user}
              onDownload={handleDownloadCertificate}
            />
          )}
        </DialogContent>
      </Dialog>
      {completedWorkshops.length > 0 && (
        <div className="certificates-section">
          <h2>My Certificates</h2>
          <div className="certificates-grid">
            {completedWorkshops.map(workshopId => {
              const workshop = workshops.find(w => w.id === parseInt(workshopId));
              if (!workshop) return null;
              
              return (
                <div key={workshopId} className="certificate-card">
                  <h3 className="certificate-card-title">{workshop.title}</h3>
                  <p className="certificate-card-date">
                    Completed on: {new Date().toLocaleDateString()}
                  </p>
                  <button
                    className="view-certificate-button"
                    onClick={() => handleViewCertificate(workshop)}
                  >
                    View Certificate
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="page-header">
        <h1>Career Workshops</h1>
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search workshops..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`filter-btn ${filter === 'live' ? 'active' : ''}`}
              onClick={() => setFilter('live')}
            >
              Live
            </button>
            <button 
              className={`filter-btn ${filter === 'pre-recorded' ? 'active' : ''}`}
              onClick={() => setFilter('pre-recorded')}
            >
              Pre-recorded
            </button>
          </div>
        </div>
      </div>

      <div className="workshops-grid">
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map(workshop => (
            <div key={workshop.id} className={`workshop-card ${workshop.type}`}>
              <div className="workshop-header">
                <h3>{workshop.title}</h3>
                <span className={`status-badge ${workshop.type}`}>
                  {workshop.type.charAt(0).toUpperCase() + workshop.type.slice(1)}
                </span>
              </div>
              <div className="workshop-card-content">
                <div className="speaker-info">
                  <h4>{workshop.speaker}</h4>
                  <p>{workshop.speakerTitle}</p>
                </div>
                {workshop.type === 'upcoming' && (
                  <div className="workshop-date">
                    <i className="fas fa-calendar"></i>
                    <span>{workshop.date} at {workshop.time}</span>
                  </div>
                )}
                <p className="description">{workshop.description}</p>
                <div className="topics">
                  {workshop.topics.map((topic, index) => (
                    <span key={index} className="topic-tag">{topic}</span>
                  ))}
                </div>
              </div>
              <div className="workshop-footer">
                {workshop.type === 'upcoming' && (
                  <button 
                    className={`btn ${registeredWorkshops.has(workshop.id) ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleRegistration(workshop.id, registeredWorkshops.has(workshop.id))}
                  >
                    {registeredWorkshops.has(workshop.id) ? 'Unregister' : 'Register Now'}
                  </button>
                )}
                {workshop.type === 'live' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStartWorkshop(workshop.id)}
                  >
                    Join Now
                  </button>
                )}
                {workshop.type === 'pre-recorded' && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStartWorkshop(workshop.id)}
                  >
                    Watch Now
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-workshops">
            <p>No workshops found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workshops; 