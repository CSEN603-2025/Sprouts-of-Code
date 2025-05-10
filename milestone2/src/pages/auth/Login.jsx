import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
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

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        const { user } = result
        if (user.role === 'admin') navigate('/admin')
        else if (user.role === 'employer') navigate('/employer')
        else if (user.role === 'student') navigate('/student')
        else navigate('/')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              required
            />
            <div className="password-hint">
              For demo purposes, use "password" as the password
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Accounts:</p>
          <ul>
            <li>Admin: admin@demo.com / admin123</li>
            <li>Company: Use any company email from the list</li>
            <li>Student: Use any student email from the list</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login