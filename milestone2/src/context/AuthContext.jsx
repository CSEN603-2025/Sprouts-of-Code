import { createContext, useContext, useState, useEffect } from 'react'
import { demoAccounts, dummyCompanies, dummyStudents } from '../data/dummyData'
import { isDemoAccount, getDemoAccountRole } from '../data/dummyData'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Check if it's a demo account
      if (isDemoAccount(email, password)) {
        const role = getDemoAccountRole(email);
        const user = { email, role };
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }

      // Check if it's a company
      const company = dummyCompanies.find(c => c.email === email && password === "password");
      if (company) {
        const user = { email, role: 'employer', name: company.name };
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }

      // Check if it's a student
      const student = dummyStudents.find(s => s.email === email && password === "password");
      if (student) {
        const user = { email, role: 'student', name: student.name };
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }

      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  const register = (userData) => {
    // Check if user already exists
    const existingUser = demoAccounts.find(user => user.email === userData.email)
    if (existingUser) {
      return { success: false, error: 'User already exists' }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'student' // Default role for new registrations
    }

    // In a real app, this would be an API call
    demoAccounts.push(newUser)

    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 