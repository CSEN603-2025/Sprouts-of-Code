import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import './Appointments.css';

const Appointments = () => {
  const { user } = useAuth();
  const { students } = useStudent();
  const [appointments, setAppointments] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'career_guidance',
    date: '',
    time: '',
    duration: '30',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = JSON.parse(localStorage.getItem(`appointments_${user?.id}`) || '[]');
    setAppointments(savedAppointments);
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const selectedDate = new Date(formData.date);
    const [hours, minutes] = formData.time.split(':').map(Number);
    
    // Validate date
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (selectedDate < now.setHours(0, 0, 0, 0)) {
      newErrors.date = 'Cannot select a past date';
    }

    // Validate time
    if (!formData.time) {
      newErrors.time = 'Time is required';
    } else {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(hours, minutes);
      
      if (selectedDateTime < now) {
        newErrors.time = 'Cannot select a past time';
      }
      
      // Check if time is within business hours (9 AM to 5 PM)
      if (hours < 9 || hours >= 17) {
        newErrors.time = 'Appointments are only available between 9 AM and 5 PM';
      }
    }

    // Validate duration
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newAppointment = {
      id: Date.now(),
      studentId: user.id,
      studentName: user.name,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem(`appointments_${user?.id}`, JSON.stringify(updatedAppointments));
    
    // Reset form
    setFormData({
      type: 'career_guidance',
      date: '',
      time: '',
      duration: '30',
      description: ''
    });
    setShowRequestForm(false);
    setErrors({});

    // Add notification
    const newNotification = {
      id: Date.now(),
      message: `Your appointment request for ${formData.type === 'career_guidance' ? 'Career Guidance' : 'Report Clarification'} has been submitted.`,
      time: new Date().toLocaleString(),
      read: false
    };
    const currentNotifications = JSON.parse(localStorage.getItem(`notifications_${user?.id}`) || '[]');
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify([newNotification, ...currentNotifications]));
  };

  const cancelAppointment = (appointmentId) => {
    const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
    setAppointments(updatedAppointments);
    localStorage.setItem(`appointments_${user?.id}`, JSON.stringify(updatedAppointments));
  };

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>Video Call Appointments</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowRequestForm(true)}
        >
          Request Appointment
        </button>
      </div>

      {showRequestForm && (
        <div className="request-form-container">
          <div className="request-form">
            <h2>Request a Video Call</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Appointment Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="career_guidance">Career Guidance</option>
                  <option value="report_clarification">Report Clarification</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  step="1800" // 30-minute intervals
                  min="09:00"
                  max="17:00"
                  className={errors.time ? 'error' : ''}
                />
                {errors.time && <span className="error-message">{errors.time}</span>}
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className={errors.duration ? 'error' : ''}
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
                {errors.duration && <span className="error-message">{errors.duration}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please provide details about what you'd like to discuss..."
                  required
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowRequestForm(false);
                  setErrors({});
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="appointments-list">
        <h2>Your Appointments</h2>
        {appointments.length > 0 ? (
          <div className="appointments-grid">
            {appointments.map(appointment => (
              <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                <div className="card-header">
                  <h3>{appointment.type === 'career_guidance' ? 'Career Guidance' : 'Report Clarification'}</h3>
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                <div className="card-content">
                  <div className="appointment-details">
                    <div className="detail-item">
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>{appointment.time}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-hourglass-half"></i>
                      <span>{appointment.duration} minutes</span>
                    </div>
                  </div>
                  <div className="description">
                    <h4>Description</h4>
                    <p>{appointment.description}</p>
                  </div>
                </div>
                <div className="card-footer">
                  {appointment.status === 'pending' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => cancelAppointment(appointment.id)}
                    >
                      Cancel Request
                    </button>
                  )}
                  {appointment.status === 'approved' && (
                    <button className="btn btn-primary">
                      Join Call
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments">
            <p>You haven't requested any appointments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments; 