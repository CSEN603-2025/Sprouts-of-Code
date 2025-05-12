import { useState, useEffect } from 'react';
import { dummyAppointments, dummyStudents } from '../../data/dummyData';
import './AdminAppointments.css';

const ADMIN_ID = 'SCAD';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [sentAppointments, setSentAppointments] = useState([]);
  const [receivedAppointments, setReceivedAppointments] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'career_guidance',
    date: '',
    time: '',
    duration: '30',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setAppointments(dummyAppointments);
  }, []);

  useEffect(() => {
    setSentAppointments(appointments.filter(apt => apt.senderId === ADMIN_ID));
    setReceivedAppointments(appointments.filter(apt => apt.receiverId === ADMIN_ID));
  }, [appointments]);

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const selectedDate = new Date(formData.date);
    const [hours, minutes] = formData.time.split(':').map(Number);

    if (!formData.studentId) {
      newErrors.studentId = 'Student is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (selectedDate < now.setHours(0, 0, 0, 0)) {
      newErrors.date = 'Cannot select a past date';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    } else {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(hours, minutes);
      if (selectedDateTime < now) {
        newErrors.time = 'Cannot select a past time';
      }
      if (hours < 9 || hours >= 17) {
        newErrors.time = 'Appointments are only available between 9 AM and 5 PM';
      }
    }
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const newAppointment = {
      id: Date.now(),
      senderId: ADMIN_ID,
      receiverId: formData.studentId,
      description: formData.description,
      date: `${formData.date}T${formData.time}:00`,
      status: 'pending',
      type: formData.type,
      duration: formData.duration
    };
    setAppointments(prev => [...prev, newAppointment]);
    setShowRequestForm(false);
    setFormData({
      studentId: '',
      type: 'career_guidance',
      date: '',
      time: '',
      duration: '30',
      description: ''
    });
    setErrors({});
  };

  const handleAccept = (appointmentId) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'accepted' } : apt
    ));
  };

  const handleReject = (appointmentId) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'rejected' } : apt
    ));
  };

  const handleJoinCall = (appointment) => {
    alert(`Joining call for appointment with ID: ${appointment.id}`);
    // In a real app, this would open a video call link
  };

  const renderAppointmentCard = (appointment, isReceived = false) => {
    const student = dummyStudents.find(s => s.id.toString() === (isReceived ? appointment.senderId.toString() : appointment.receiverId.toString()));
    const startDate = new Date(appointment.date);
    const endDate = new Date(startDate.getTime() + Number(appointment.duration) * 60000);
    const period = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const isSender = appointment.senderId === ADMIN_ID;
    const isReceiver = appointment.receiverId === ADMIN_ID;
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
            <div className="detail-item">
              <i className="fas fa-user"></i>
              <span>{student ? student.name : 'N/A'}</span>
            </div>
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
          {isReceived && appointment.status === 'pending' && (
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
                aria-label="Reject appointment"
                tabIndex={0}
                onClick={() => handleReject(appointment.id)}
                onKeyDown={e => { if (e.key === 'Enter') handleReject(appointment.id); }}
              >
                Reject
              </button>
            </>
          )}
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
        <h1>Admin Video Call Appointments</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowRequestForm(true)}
        >
          Send Appointment Request
        </button>
      </div>

      {showRequestForm && (
        <div className="request-form-container">
          <div className="request-form">
            <h2>Send Appointment Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student</label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                  className={errors.studentId ? 'error' : ''}
                  aria-label="Select student"
                  tabIndex={0}
                >
                  <option value="">Select a student</option>
                  {dummyStudents.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
                {errors.studentId && <span className="error-message">{errors.studentId}</span>}
              </div>
              <div className="form-group">
                <label>Appointment Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  aria-label="Select appointment type"
                  tabIndex={0}
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
                  aria-label="Select date"
                  tabIndex={0}
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
                  step="1800"
                  min="09:00"
                  max="17:00"
                  className={errors.time ? 'error' : ''}
                  aria-label="Select time"
                  tabIndex={0}
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
                  aria-label="Select duration"
                  tabIndex={0}
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
                  aria-label="Enter description"
                  tabIndex={0}
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
              {sentAppointments.map(apt => renderAppointmentCard(apt, false))}
            </div>
          ) : (
            <div className="no-appointments">
              <p>No sent appointment requests yet.</p>
            </div>
          )}
        </div>
        <div className="appointments-section">
          <h2>Received Appointments</h2>
          {receivedAppointments.length > 0 ? (
            <div className="appointments-grid">
              {receivedAppointments.map(apt => renderAppointmentCard(apt, true))}
            </div>
          ) : (
            <div className="no-appointments">
              <p>No received appointment requests yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
