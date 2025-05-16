import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px',
                  fontSize: '1.2rem'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Open eye SVG
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="#222" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="12" r="4" stroke="#222" strokeWidth="2" fill="none"/>
                  </svg>
                ) : (
                  // Eye with slash SVG
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z" stroke="#222" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="12" r="4" stroke="#222" strokeWidth="2" fill="none"/>
                    <line x1="4" y1="20" x2="20" y2="4" stroke="#222" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="password-hint">
              For demo purposes, use "password" as the password
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-button german-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="register-company">
          <p>Are you a company looking to post internships?</p>
          <button 
            className="register-company-btn german-btn"
            onClick={() => navigate('/company-registration')}
          >
            Register Your Company
          </button>
        </div>

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