import { useState, useContext, createContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Shared components
import Navbar from './components/shared/Navbar'
import Sidebar from './components/shared/Sidebar'

// Auth pages
import Login from './pages/auth/Login'
import CompanyRegistration from './pages/auth/CompanyRegistration'
import SubmissionSuccess from './pages/auth/SubmissionSuccess'

// Developer 1 - Access & Student Onboarding
import StudentDashboard from './pages/studentOnboarding/StudentDashboard'
import ProfileSetup from './pages/studentOnboarding/ProfileSetup'
import MyApplications from './pages/studentOnboarding/MyApplications'
import ProfileViewers from './pages/studentOnboarding/ProfileViewers'
import OnlineAssessments from './pages/studentOnboarding/OnlineAssessments'
import TakeAssessment from './pages/studentOnboarding/TakeAssessment'
import AssessmentResults from './pages/studentOnboarding/AssessmentResults'

// Developer 2 - Employer Interface
import EmployerDashboard from './pages/employerInterface/EmployerDashboard'
import JobPostings from './pages/employerInterface/JobPostings'

// Developer 3 - Student Internship Experience
import InternshipDashboard from './pages/internshipExperience/InternshipDashboard'
import WorkLogs from './pages/internshipExperience/WorkLogs'

// Developer 4 - SCAD Internship Operations
import AdminDashboard from './pages/internshipOperations/AdminDashboard'
import InternshipManagement from './pages/internshipOperations/InternshipManagement'
import PendingCompanies from './pages/internshipOperations/PendingCompanies'

// Developer 5 - Analytics & Reporting
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard'
import Reports from './pages/analytics/Reports'

// Context
import { CompanyProvider } from './context/CompanyContext'
import { InternshipProvider } from './context/InternshipContext'

// Create a user context
const UserContext = createContext(null)

function App() {
  const [user, setUser] = useState(null)

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData)
  }

  // Handle logout
  const handleLogout = () => {
    setUser(null)
  }

  // Layout component that includes Navbar and Sidebar
  const Layout = ({ children }) => (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="content-container">
        <Sidebar user={user} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />
    }
    return <Layout>{children}</Layout>
  }

  return (
    <CompanyProvider>
      <InternshipProvider>
        <UserContext.Provider value={{ user, setUser }}>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register-company" element={<CompanyRegistration />} />
              <Route path="/submission-success" element={<SubmissionSuccess />} />

              {/* Developer 1 - Access & Student Onboarding */}
              <Route path="/student" element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/profile" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
              <Route path="/student/applications" element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              } />
              <Route path="/student/profile-viewers" element={
                <ProtectedRoute>
                  <ProfileViewers />
                </ProtectedRoute>
              } />
              <Route path="/student/assessments" element={
                <ProtectedRoute>
                  <OnlineAssessments />
                </ProtectedRoute>
              } />
              <Route path="/student/assessments/:id" element={
                <ProtectedRoute>
                  <TakeAssessment />
                </ProtectedRoute>
              } />
              <Route path="/student/assessment-results/:id" element={
                <ProtectedRoute>
                  <AssessmentResults />
                </ProtectedRoute>
              } />

              {/* Developer 2 - Employer Interface */}
              <Route path="/employer" element={
                <ProtectedRoute>
                  <EmployerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/employer/jobs" element={
                <ProtectedRoute>
                  <JobPostings />
                </ProtectedRoute>
              } />

              {/* Developer 3 - Student Internship Experience */}
              <Route path="/student/internships" element={
                <ProtectedRoute>
                  <InternshipDashboard />
                </ProtectedRoute>
              } />
              <Route path="/internship/logs" element={
                <ProtectedRoute>
                  <WorkLogs />
                </ProtectedRoute>
              } />

              {/* Developer 4 - SCAD Internship Operations */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/internships" element={
                <ProtectedRoute>
                  <InternshipManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/pending-companies" element={
                <ProtectedRoute>
                  <PendingCompanies />
                </ProtectedRoute>
              } />

              {/* Developer 5 - Analytics & Reporting */}
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/analytics/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />

              {/* Default route */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </InternshipProvider>
    </CompanyProvider>
  )
}

export default App
export { UserContext }
