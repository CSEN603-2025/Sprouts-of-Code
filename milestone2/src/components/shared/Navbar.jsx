import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { FaBell } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Menu from '@mui/material/Menu'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useAppointments } from '../../context/AppointmentContext'
import { useAuth } from '../../context/AuthContext'
import { useStudent } from '../../context/StudentContext'

// Logo placeholder
import logo from '../../assets/Sprouts of Code.png'

const Navbar = ({ user, onLogout }) => {
  const { appointments } = useAppointments();
  const { students } = useStudent();
  const { user: authUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const prevAppointmentsRef = useRef([]);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }
  
  useEffect(() => {
    if (user && user.role === 'employer') {
      setNotifications([
        { id: 1, message: "Your application was accepted!", read: false },
        { id: 2, message: "New applicant for your internship.", read: false },
        { id: 3, message: "New applicant for your internship.", read: false },
      ])
    }
  }, [user])

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
    const myAppointments = appointments.filter(
      apt => (apt.senderId?.toString() === user.id?.toString() || apt.receiverId?.toString() === user.id?.toString()) &&
        (apt.status === 'accepted' || apt.status === 'rejected')
    );
    console.log('[Navbar] myAppointments:', myAppointments);
    myAppointments.forEach(apt => {
      // Find the other party
      let otherPartyName = 'SCAD';
      if (apt.senderId?.toString() === user.id?.toString()) {
        // User is sender, so receiver is other party
        if (apt.receiverId !== 'SCAD') {
          const other = students.find(s => s.id.toString() === apt.receiverId.toString());
          if (other) otherPartyName = other.name;
          console.log(`[Navbar] Found receiver as other party:`, other);
        }
      } else {
        // User is receiver, so sender is other party
        if (apt.senderId !== 'SCAD') {
          const other = students.find(s => s.id.toString() === apt.senderId.toString());
          if (other) otherPartyName = other.name;
          console.log(`[Navbar] Found sender as other party:`, other);
        }
      }
      const date = new Date(apt.date).toLocaleString();
      const message = `Your appointment with ${otherPartyName} on ${date} was ${apt.status}: ${apt.description}`;
      // Avoid duplicate notifications for the same appointment and status
      setNotifications(prev => {
        const alreadyExists = prev.some(n => n.message === message);
        if (alreadyExists) return prev;
        console.log(`[Navbar] Adding notification:`, message);
        return [
          { id: Date.now() + Math.random(), message, read: false },
          ...prev
        ];
      });
    });
    prevAppointmentsRef.current = myAppointments.map(a => ({ ...a }));
  }, [appointments, user, students]);

  const unreadCount = notifications.filter(n => !n.read).length

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Mark all notifications as read
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Sprouts of Code Logo" />
            <span>Sprouts of Code</span>
          </Link>
        </div>
        
        {user ? (
          <div className="navbar-menu">
            {/* Dynamic links based on user role */}
            {user.role === 'student' && (
              <>
                <Link to="/student" className="nav-link">Dashboard</Link>
                <Link to="/student/profile" className="nav-link">Profile</Link>
                <Link to="/internship" className="nav-link">Internship</Link>
              </>
            )}
            
            {user.role === 'employer' && (
              <>
                <Link to="/employer" className="nav-link">Dashboard</Link>
                <Link to="/employer/jobs" className="nav-link">Job Postings</Link>
              </>
            )}
            
            {user.role === 'admin' && (
              <>
                <Link to="/admin" className="nav-link">Dashboard</Link>
                <Link to="/admin/internships" className="nav-link">Internships</Link>
                <Link to="/analytics" className="nav-link">Analytics</Link>
              </>
            )}
            {user.role === 'FacultyAcademic' && (
              <>
                <Link to="/faculty" className="nav-link">Dashboard</Link>
                <Link to="/faculty/students" className="nav-link">Students</Link>
                <Link to="/faculty/reports" className="nav-link">Reports</Link>
                <Link to="/faculty/appointments" className="nav-link">Appointments</Link>
              </>
            )}
          </div>
        ) : null}
        
        <div className="navbar-right">
          {user && (
            <button 
              onClick={onLogout} 
              className="btn btn-outline logout-btn"
            >
              Logout
            </button>
          )}
          {(user && (user.role === 'employer' || user.role === 'student')) && (
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
          )}
          {user ? (
            <div className="profile-dropdown">
              <button className="profile-button" onClick={toggleDropdown}>
                <img 
                  src={user.profilePic || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  className="profile-image" 
                />
                <span className="profile-name">{user.name}</span>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {/* Dynamic menu items based on user role */}
                  {user.role === 'student' && (
                    <>
                      <Link to="/student/profile" className="dropdown-item">My Profile</Link>
                      <Link to="/student/applications" className="dropdown-item">My Applications</Link>
                      <Link to="/student/certificates" className="dropdown-item">My Certificates</Link>
                    </>
                  )}
                  
                  {user.role === 'employer' && (
                    <>
                      <Link to="/employer/profile" className="dropdown-item">Company Profile</Link>
                      <Link to="/employer/jobs" className="dropdown-item">Job Postings</Link>
                      <Link to="/employer/applications" className="dropdown-item">Applications</Link>
                    </>
                  )}
                  
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin/settings" className="dropdown-item">System Settings</Link>
                      <Link to="/admin/users" className="dropdown-item">User Management</Link>
                      <Link to="/admin/reports" className="dropdown-item">Reports</Link>
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
                  <Link to="/settings" className="dropdown-item">Settings</Link>
                  <button onClick={onLogout} className="dropdown-item logout">
                    Logout
                  </button>
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
    </nav>
  )
}


export default Navbar