import { useState, useEffect } from 'react'
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

// Logo placeholder
import logo from '../../assets/Sprouts of Code.png'

const Navbar = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }
  
  useEffect(() => {
    if (user ) {
      // Fetch notifications from backend here
      // For now, use mock data:
      if (user.role === 'employer'){
        setNotifications([
          { id: 1, message: "You have recieved a new email.", read: false },
          { id: 2, message: "Your application was accepted!", read: false },
          { id: 3, message: "New applicant for your internship.", read: false },
          
        ])  
      }else if (user.role === 'student'){
        setNotifications([
          { id: 1, message: "Your application was accepted!", read: false },
          { id: 2, message: "Your application was rejected.", read: false },
          { id: 3, message: "Your online meeting with a SCAD officer has been confirmed.", read: false },
        ])
      }
        else{
          setNotifications([
            { id: 1, message: "A new company has submitted an application.", read: false },
            { id: 2, message: "A Company wants to post an internship", read: false },
            { id: 3, message: "A student has submitted their internship evaluation report.", read: false },
          ])    
        } 
    }
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget)
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
                <Link to="/student/internships" className="nav-link">Internship</Link>
              </>
            )}
            
            {user.role === 'employer' && (
              <>
                <Link to="/employer" className="nav-link">Dashboard</Link>
                <Link to="/employer/internships" className="nav-link">Job Postings</Link>
              </>
            )}
            
            {user.role === 'admin' && (
              <>
                <Link to="/admin" className="nav-link">Dashboard</Link>
                <Link to="/admin/internship-management" className="nav-link">Internships</Link>
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
          {user  && (
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
                      <Link to="/employer/applications" className="dropdown-item">Applications</Link>
                    </>
                  )}
                  
                  {user.role === 'admin' && (
                    <>

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