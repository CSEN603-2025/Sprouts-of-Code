import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useAppointments } from '../../context/AppointmentContext'
import { useAuth } from '../../context/AuthContext'
import { useStudent } from '../../context/StudentContext'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import CallIcon from '@mui/icons-material/Call'
import LogoutIcon from '@mui/icons-material/Logout'

// Logo placeholder
import logo from '../../assets/Sprouts of Code.png'

// Modal style for call notification
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
}

// Extra style for call icon and message
const callIconStyle = {
  fontSize: 48,
  color: '#1976d2',
  marginBottom: 12,
}
const callMessageStyle = {
  fontSize: 20,
  fontWeight: 500,
  margin: '12px 0',
}
const callButtonGroupStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: 16,
  marginTop: 20,
}

const Navbar = ({ user, onLogout }) => {
  const { appointments } = useAppointments();
  const { students } = useStudent();
  const { user: authUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false)
  // const [notifications, setNotifications] = useState([])
  // const [showNotifications, setShowNotifications] = useState(false)
  // const [anchorEl, setAnchorEl] = useState(null)
  const prevAppointmentsRef = useRef([]);
  // State for simulating a call notification
  const [callNotification, setCallNotification] = useState(null);
  const navigate = useNavigate();
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }
  
  // useEffect(() => {
  //   if (user && user.role === 'employer') {
  //     setNotifications([
  //       { id: 1, message: "Your application was accepted!", read: false },
  //       { id: 2, message: "New applicant for your internship.", read: false },
  //       { id: 3, message: "New applicant for your internship.", read: false },
  //     ])
  //   }
  // }, [user])

  // Student appointment notifications
  useEffect(() => {
    if (!user || user.role !== 'student') return;
    console.log('[Navbar] user:', user);
    console.log('[Navbar] students:', students);
    console.log('[Navbar] appointments:', appointments);
    console.log('[Navbar] user.id:', user.id, typeof user.id);
    appointments.forEach((apt, idx) => {
      console.log(`[Navbar] appointment[${idx}]: id=${apt.id}, senderId=${apt.senderId} (${typeof apt.senderId}), receiverId=${apt.receiverId} (${typeof apt.receiverId})`);
    });
    // Notify for any accepted or rejected appointment where user is sender or receiver
    // const myAppointments = appointments.filter(
    //   apt => (apt.senderId?.toString() === user.id?.toString() || apt.receiverId?.toString() === user.id?.toString()) &&
    //     (apt.status === 'accepted' || apt.status === 'rejected')
    // );
    // console.log('[Navbar] myAppointments:', myAppointments);
    // myAppointments.forEach(apt => {
    //   // Find the other party
    //   let otherPartyName = 'SCAD';
    //   if (apt.senderId?.toString() === user.id?.toString()) {
    //     // User is sender, so receiver is other party
    //     if (apt.receiverId !== 'SCAD') {
    //       const other = students.find(s => s.id.toString() === apt.receiverId.toString());
    //       if (other) otherPartyName = other.name;
    //       console.log(`[Navbar] Found receiver as other party:`, other);
    //     }
    //   } else {
    //     // User is receiver, so sender is other party
    //     if (apt.senderId !== 'SCAD') {
    //       const other = students.find(s => s.id.toString() === apt.senderId.toString());
    //       if (other) otherPartyName = other.name;
    //       console.log(`[Navbar] Found sender as other party:`, other);
    //     }
    //   }
    //   const date = new Date(apt.date).toLocaleString();
    //   const message = `Your appointment with ${otherPartyName} on ${date} was ${apt.status}: ${apt.description}`;
    //   // Avoid duplicate notifications for the same appointment and status
    //   setNotifications(prev => {
    //     const alreadyExists = prev.some(n => n.message === message);
    //     if (alreadyExists) return prev;
    //     console.log(`[Navbar] Adding notification:`, message);
    //     return [
    //       { id: Date.now() + Math.random(), message, read: false },
    //       ...prev
    //     ];
    //   });
    // });
    // prevAppointmentsRef.current = myAppointments.map(a => ({ ...a }));
  }, [appointments, user, students]);

  // Listen for Ctrl+B to simulate a call from SCAD
  useEffect(() => {
    if (!user || user.role !== 'student') return;
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'b' || e.key === 'B')) {
        setCallNotification({
          from: 'SCAD',
          status: 'incoming',
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  const handleAcceptCall = () => {
    setCallNotification({ from: 'SCAD', status: 'accepted' });
    setTimeout(() => {
      setCallNotification(null);
      navigate('/call');
    }, 1000);
  };
  const handleRejectCall = () => {
    setCallNotification({ from: 'SCAD', status: 'rejected' });
    setTimeout(() => setCallNotification(null), 2000);
  };

  // const unreadCount = notifications.filter(n => !n.read).length

  // const handleBellClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  //   // Mark all notifications as read
  //   setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  // }

  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Sprouts of Code Logo" />
            <span>Sprouts of Code</span>
          </Link>
        </div>
        
    
        <div className="navbar-right">
          {user && (
            <button 
              onClick={onLogout} 
              className="btn logout-btn"
            >
              <LogoutIcon style={{ fontSize: 20 }} />
              Logout
            </button>
          )}
          {/* {(user && (user.role === 'employer' || user.role === 'student')) && (
            <>
              <IconButton
                aria-label="show notifications"
                color="primary"
                onClick={handleBellClick}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  boxShadow: 2,
                  marginRight: 2,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    width: '350px',
                    padding: 0,
                  },
                }}
              >
                <List sx={{ maxHeight: 300, overflow: 'auto', width: '100%' }}>
                  {notifications.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No notifications" />
                    </ListItem>
                  ) : (
                    notifications.map((n) => (
                      <ListItem
                        key={n.id}
                        sx={{
                          backgroundColor: n.read ? '#fff' : '#e3f2fd',
                          borderBottom: '1px solid #eee',
                        }}
                      >
                        <ListItemText primary={n.message} />
                      </ListItem>
                    ))
                  )}
                </List>
              </Menu>
            </>
          )} */}
          {user ? (
            <div className="profile-dropdown">
              <button className="profile-button" onClick={toggleDropdown}>
                {user.role === 'employer' && user.logo ? (
                  <img
                    src={typeof user.logo === 'string' ? user.logo : URL.createObjectURL(user.logo)}
                    alt="Company Logo"
                    className="profile-image"
                  />
                ) : (
                  <img
                    src={user.profilePic || 'https://via.placeholder.com/40'}
                    alt="Profile"
                    className="profile-image"
                  />
                )}
                <span className="profile-name">{user.name}</span>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {/* Dynamic menu items based on user role */}
                  {user.role === 'student' && (
                    <>
                      <Link to="/student/profile" className="dropdown-item">My Profile</Link>
                      <Link to="/student/applications" className="dropdown-item">My Applications</Link>
                    </>
                  )}
                  
                  {user.role === 'employer' && (
                    <>
                      <Link to="/employer/profile" className="dropdown-item">Company Profile</Link>
                      {/* <Link to="/employer/jobs" className="dropdown-item">Job Postings</Link> */}
                      <Link to="/employer/applications" className="dropdown-item">Applications</Link>
                    </>
                  )}
                  
                  {user.role === 'admin' && (
                    <>
                      {/* <Link to="/admin/settings" className="dropdown-item">System Settings</Link>
                      <Link to="/admin/users" className="dropdown-item">User Management</Link>
                      <Link to="/admin/reports" className="dropdown-item">Reports</Link> */}
                    </>
                  )}
                  {user.role === 'FacultyAcademic' && (
                    <>
                      <Link to="/faculty/profile" className="dropdown-item">My Profile</Link>
                      <Link to="/faculty/students" className="dropdown-item">Student List</Link>
                      <Link to="/faculty/appointments" className="dropdown-item">Appointments</Link>
                      <Link to="/faculty/settings" className="dropdown-item">Settings</Link>
                    </>
                  )}
                  
                  {/* Common menu items for all roles */}
                  {/* <Link to="/settings" className="dropdown-item">Settings</Link>
                  <button onClick={onLogout} className="dropdown-item logout">
                    Logout
                  </button> */}
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>
          )}
        </div>
      </div>
      {/* Call Notification Modal */}
      <Modal open={!!callNotification && callNotification.status === 'incoming'} onClose={() => setCallNotification(null)}>
        <Box sx={modalStyle}>
          <CallIcon sx={callIconStyle} />
          <h2 style={{ marginBottom: 8 }}>Incoming Call</h2>
          <div style={callMessageStyle}>
            <span style={{ color: '#1976d2' }}>{callNotification?.from}</span> is calling you.<br />
            <span style={{ fontSize: 16, color: '#555' }}>Would you like to accept the call?</span>
          </div>
          <div style={callButtonGroupStyle}>
            <button className="btn btn-primary" onClick={handleAcceptCall} aria-label="Accept call">Accept</button>
            <button className="btn btn-secondary" onClick={handleRejectCall} aria-label="Reject call">Reject</button>
          </div>
        </Box>
      </Modal>
      {/* Call Result Modal */}
      <Modal open={!!callNotification && callNotification.status !== 'incoming'} onClose={() => setCallNotification(null)}>
        <Box sx={modalStyle}>
          {callNotification?.status === 'accepted' && <h2>Call Accepted</h2>}
          {callNotification?.status === 'rejected' && <h2>Call Rejected</h2>}
        </Box>
      </Modal>
    </nav>
  )
}

export default Navbar