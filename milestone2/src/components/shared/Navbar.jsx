import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

// Logo placeholder
import logo from '../../assets/Sprouts of Code.png'

const Navbar = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
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
          </div>
        ) : null}
        
        <div className="navbar-right">
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
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
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