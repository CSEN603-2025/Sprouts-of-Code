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
  const { getAppointmentsByUserId, appointments: allAppointments } = useAppointments();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Get the logged-in student's ID
  const student = students.find(s => s.email === user.email);
  const studentId = student?.id;

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' }
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log('Current user:', user);
        console.log('Current student:', student);
        console.log('Student ID:', studentId);
        console.log('All appointments:', allAppointments);
        
        if (!studentId) {
          console.error('No student ID found for user:', user.email);
          setAppointments([]);
          return;
        }

        const data = getAppointmentsByUserId(studentId);
        console.log('Filtered appointments for student:', data);
        setAppointments(data);
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
    // Navigate to the call page
    navigate('/call');
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
                <h3>{appointment.senderId === studentId ? 'Sent to: ' + appointment.receiverId : 'From: ' + appointment.senderId}</h3>
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