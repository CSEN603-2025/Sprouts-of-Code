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
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // Check if user exists
    const user = MOCK_USERS[formData.email]
    
    if (user && user.password === formData.password) {
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
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
          
          <div className="register-company">
            <p>New to the platform?</p>
            <button 
              type="button" 
              className="register-company-btn"
              onClick={() => navigate('/register-company')}
            >
              Register a new Company
            </button>
          </div>
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