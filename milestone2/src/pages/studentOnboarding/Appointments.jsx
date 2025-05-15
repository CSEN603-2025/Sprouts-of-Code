import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import FilterBar from '../../components/shared/FilterBar';
import './Appointments.css';

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStudentAppointments } = useStudent();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getStudentAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [getStudentAppointments]);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.mentorName.toLowerCase().includes(search.toLowerCase()) ||
                         appointment.topic.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || appointment.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleJoinCall = (appointmentId) => {
    // Implement join call functionality
    console.log('Joining call for appointment:', appointmentId);
  };

  const handleCancelAppointment = (appointmentId) => {
    // Implement cancel appointment functionality
    console.log('Cancelling appointment:', appointmentId);
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
          filteredAppointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.mentorName}</h3>
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="appointment-content">
                <div className="appointment-info">
                  <p className="topic">{appointment.topic}</p>
                  <p className="date">
                    {new Date(appointment.date).toLocaleDateString()} at{' '}
                    {new Date(appointment.date).toLocaleTimeString()}
                  </p>
                  <p className="duration">{appointment.duration} minutes</p>
                </div>
                <div className="appointment-actions">
                  {appointment.status === 'scheduled' && (
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
                  {appointment.status === 'completed' && (
                    <button className="btn btn-secondary">View Recording</button>
                  )}
                </div>
              </div>
            </div>
          ))
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