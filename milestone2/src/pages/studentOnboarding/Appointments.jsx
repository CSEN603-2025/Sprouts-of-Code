import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';
import { useStudent } from '../../context/StudentContext';
import FilterBar from '../../components/shared/FilterBar';
import './Appointments.css';

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { students } = useStudent();
  const { getAppointmentsByUserId, appointments: allAppointments, updateAppointmentStatus } = useAppointments();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [onlineStatus, setOnlineStatus] = useState({});

  // Get the logged-in student's ID
  const student = students.find(s => s.email === user.email);
  const studentId = student?.id;

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Function to generate random online status
  const generateRandomStatus = (userId) => {
    return Math.random() > 0.5;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!studentId) {
          console.error('No student ID found for user:', user.email);
          setAppointments([]);
          return;
        }

        const data = getAppointmentsByUserId(studentId);
        setAppointments(data);

        // Generate random online status for each appointment's other party
        const statuses = {};
        data.forEach(appointment => {
          const otherPartyId = appointment.senderId === studentId ? appointment.receiverId : appointment.senderId;
          statuses[otherPartyId] = generateRandomStatus(otherPartyId);
        });
        setOnlineStatus(statuses);

        // Update statuses randomly every 5 seconds
        const interval = setInterval(() => {
          const newStatuses = {};
          data.forEach(appointment => {
            const otherPartyId = appointment.senderId === studentId ? appointment.receiverId : appointment.senderId;
            newStatuses[otherPartyId] = generateRandomStatus(otherPartyId);
          });
          setOnlineStatus(newStatuses);
        }, 5000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [getAppointmentsByUserId, studentId, allAppointments, user, student]);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || appointment.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleJoinCall = (appointmentId) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    const otherPartyId = appointment.senderId === studentId ? appointment.receiverId : appointment.senderId;
    navigate('/call', { state: { otherPartyName: otherPartyId } });
  };

  const handleCancelAppointment = (appointmentId) => {
    console.log('Cancelling appointment:', appointmentId);
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'accepted');
      // Refresh appointments after status update
      const data = getAppointmentsByUserId(studentId);
      setAppointments(data);
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'rejected');
      // Refresh appointments after status update
      const data = getAppointmentsByUserId(studentId);
      setAppointments(data);
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h1>My Appointments</h1>
        <FilterBar
          searchPlaceholder="Search appointments..."
          searchValue={search}
          onSearchChange={setSearch}
          filterOptions={filterOptions}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="appointments-grid">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => {
            const otherPartyId = appointment.senderId === studentId ? appointment.receiverId : appointment.senderId;
            const isOnline = onlineStatus[otherPartyId];

            return (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-title">
                    <h3>
                      {appointment.senderId === studentId 
                        ? `Sent to: ${appointment.receiverId}`
                        : `From: ${appointment.senderId}`}
                    </h3>
                    <div className={`status ${isOnline ? 'online' : 'offline'}`}>
                      <span className="status-dot"></span>
                      {isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="appointment-content">
                  <div className="appointment-info">
                    <p className="topic">{appointment.description}</p>
                    <p className="date">
                      {new Date(appointment.date).toLocaleDateString()} at{' '}
                      {new Date(appointment.date).toLocaleTimeString()}
                    </p>
                    <p className="duration">{appointment.duration} minutes</p>
                  </div>
                  <div className="appointment-actions">
                    {appointment.status === 'accepted' && (
                      <>
                        <button
                          className="btn btn-primary join-call-btn"
                          onClick={() => handleJoinCall(appointment.id)}
                        >
                          Join Call
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appointment.status === 'pending' && appointment.receiverId === studentId && (
                      <>
                        <button
                          className="btn btn-primary accept-btn"
                          onClick={() => handleAcceptAppointment(appointment.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-secondary reject-btn"
                          onClick={() => handleRejectAppointment(appointment.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {appointment.status === 'completed' && (
                      <button className="btn btn-secondary">View Recording</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-appointments">
            <p>No appointments found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments; 