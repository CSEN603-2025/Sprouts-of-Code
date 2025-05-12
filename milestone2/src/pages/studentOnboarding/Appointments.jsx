import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import { useAppointments } from '../../context/AppointmentContext';
import './Appointments.css';

const Appointments = () => {
  const { user } = useAuth();
  const { students } = useStudent();
  const { appointments, updateAppointmentStatus } = useAppointments();
  const [sentAppointments, setSentAppointments] = useState([]);
  const [receivedAppointments, setReceivedAppointments] = useState([]);
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
    // Load appointments from context
    const sent = appointments.filter(apt => apt.senderId.toString() === user?.id);
    const received = appointments.filter(apt => apt.receiverId.toString() === user?.id);
    setSentAppointments(sent);
    setReceivedAppointments(received);
  }, [user, appointments]);

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
      senderId: user.id,
      receiverId: 'SCAD', // Default receiver is SCAD
      description: formData.description,
      date: `${formData.date}T${formData.time}:00`,
      status: 'pending',
      type: formData.type,
      duration: formData.duration
    };

    setSentAppointments(prev => [...prev, newAppointment]);
    
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
  };

  const cancelAppointment = (appointmentId) => {
    setSentAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  };

  const handleAccept = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'accepted');
  };

  const handleCancelReceived = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'rejected');
  };

  const handleJoinCall = (appointment) => {
    alert(`Joining call for appointment with ID: ${appointment.id}`);
    // In a real app, this would open a video call link
  };

  const renderAppointmentCard = (appointment) => {
    const isSender = appointment.senderId.toString() === user?.id;
    const isReceiver = appointment.receiverId.toString() === user?.id;

    // Find sender and receiver names
    const senderName = appointment.senderId === 'SCAD'
      ? 'SCAD'
      : students.find(s => s.id.toString() === appointment.senderId.toString())?.name || 'Unknown';
    const receiverName = appointment.receiverId === 'SCAD'
      ? 'SCAD'
      : students.find(s => s.id.toString() === appointment.receiverId.toString())?.name || 'Unknown';

    const startDate = new Date(appointment.date);
    const endDate = new Date(startDate.getTime() + Number(appointment.duration) * 60000);
    const period = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return (
      <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
        <div className="card-header">
          <h3>{appointment.type === 'career_guidance' ? 'Career Guidance' : 'Report Clarification'}</h3>
          <span className={`status-badge ${appointment.status}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
        <div className="card-content">
          <div className="appointment-details">
            {isSender && (
              <div className="detail-item">
                <i className="fas fa-user"></i>
                <span><strong>To:</strong> {receiverName}</span>
              </div>
            )}
            {isReceiver && (
              <div className="detail-item">
                <i className="fas fa-user"></i>
                <span><strong>From:</strong> {senderName}</span>
              </div>
            )}
            <div className="detail-item">
              <i className="fas fa-calendar"></i>
              <span>{startDate.toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <i className="fas fa-clock"></i>
              <span>{period}</span>
            </div>
            <div className="detail-item">
              <i className="fas fa-hourglass-half"></i>
              <span>{appointment.duration ? `${appointment.duration} minutes` : 'N/A'}</span>
            </div>
          </div>
          <div className="description">
            <h4>Description</h4>
            <p>{appointment.description}</p>
          </div>
        </div>
        <div className="card-footer">
          {/* Pending: Accept/Cancel for receiver */}
          {appointment.status === 'pending' && isReceiver && (
            <>
              <button
                className="btn btn-primary"
                aria-label="Accept appointment"
                tabIndex={0}
                onClick={() => handleAccept(appointment.id)}
                onKeyDown={e => { if (e.key === 'Enter') handleAccept(appointment.id); }}
              >
                Accept
              </button>
              <button
                className="btn btn-secondary"
                aria-label="Cancel appointment"
                tabIndex={0}
                onClick={() => handleCancelReceived(appointment.id)}
                onKeyDown={e => { if (e.key === 'Enter') handleCancelReceived(appointment.id); }}
              >
                Cancel
              </button>
            </>
          )}
          {/* Pending: Cancel for sender */}
          {appointment.status === 'pending' && isSender && (
            <button
              className="btn btn-secondary"
              aria-label="Cancel request"
              tabIndex={0}
              onClick={() => cancelAppointment(appointment.id)}
              onKeyDown={e => { if (e.key === 'Enter') cancelAppointment(appointment.id); }}
            >
              Cancel Request
            </button>
          )}
          {/* Accepted: Join Call for both sender and receiver */}
          {appointment.status === 'accepted' && (isSender || isReceiver) && (
            <button
              className="btn btn-primary"
              aria-label="Join call"
              tabIndex={0}
              onClick={() => handleJoinCall(appointment)}
              onKeyDown={e => { if (e.key === 'Enter') handleJoinCall(appointment); }}
            >
              Join Call
            </button>
          )}
        </div>
      </div>
    );
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

      <div className="appointments-sections">
        <div className="appointments-section">
          <h2>Sent Appointments</h2>
          {sentAppointments.length > 0 ? (
            <div className="appointments-grid">
              {sentAppointments.map(renderAppointmentCard)}
            </div>
          ) : (
            <div className="no-appointments">
              <p>You haven't sent any appointment requests yet.</p>
            </div>
          )}
        </div>

        <div className="appointments-section">
          <h2>Received Appointments</h2>
          {receivedAppointments.length > 0 ? (
            <div className="appointments-grid">
              {receivedAppointments.map(renderAppointmentCard)}
            </div>
          ) : (
            <div className="no-appointments">
              <p>You haven't received any appointment requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments; 