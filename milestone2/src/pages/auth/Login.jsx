import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

// Mock user data
const MOCK_USERS = {
  'student@example.com': {
    id: '1',
    email: 'student@example.com',
    password: 'password',
    name: 'John Student',
    role: 'student',
    profilePic: 'https://via.placeholder.com/150?text=S'
  },
  'employer@example.com': {
    id: '2',
    email: 'employer@example.com',
    password: 'password',
    name: 'Jane Employer',
    role: 'employer',
    profilePic: 'https://via.placeholder.com/150?text=E'
  },
  'admin@example.com': {
    id: '3',
    email: 'admin@example.com',
    password: 'password',
    name: 'Admin User',
    role: 'admin',
    profilePic: 'https://via.placeholder.com/150?text=A'
  }
}

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // Check if user exists
    const user = MOCK_USERS[email]
    
    if (user && user.password === password) {
      // Login successful
      const { password, ...userData } = user // Remove password from user data
      onLogin(userData)
      
      // Redirect based on role
      switch (user.role) {
        case 'student':
          navigate('/student')
          break
        case 'employer':
          navigate('/employer')
          break
        case 'admin':
          navigate('/admin')
          break
        default:
          navigate('/')
      }
    } else {
      setError('Invalid email or password')
    }
  }
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sprouts of Code</h1>
          <p>Internship Management System</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary login-button">
            Login
          </button>
        </form>
        
        <div className="demo-accounts">
          <h3>Demo Accounts</h3>
          <div className="account-list">
            <div className="account-item">
              <strong>Student:</strong>
              <p>student@example.com / password</p>
            </div>
            <div className="account-item">
              <strong>Employer:</strong>
              <p>employer@example.com / password</p>
            </div>
            <div className="account-item">
              <strong>Admin:</strong>
              <p>admin@example.com / password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login