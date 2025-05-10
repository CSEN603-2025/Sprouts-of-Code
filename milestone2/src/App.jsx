import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CompanyProvider } from './context/CompanyContext'
import { PendingCompanyProvider } from './context/PendingCompanyContext'
import { StudentProvider } from './context/StudentContext'
import { InternshipProvider } from './context/InternshipContext'
import Layout from './components/layout/Layout'

// Auth Pages
import Login from './pages/auth/Login'

// Admin Pages
import AdminDashboard from './pages/internshipOperations/AdminDashboard'
import CompanyRegistration from './pages/auth/CompanyRegistration'
import PendingCompanies from './pages/internshipOperations/PendingCompanies'
import AdminStudents from './pages/admin/AdminStudents'
import AdminEmployers from './pages/admin/AdminEmployers'
import AdminInternships from './pages/admin/AdminInternships'
import InternshipManagement from './pages/internshipOperations/InternshipManagement'

// Employer Pages
import EmployerDashboard from './pages/employerInterface/EmployerDashboard'
import InternshipOperations from './pages/employerInterface/InternshipOperations'
import EmployerProfile from './pages/employerInterface/EmployerProfile'

// Student Pages
import StudentDashboard from './pages/studentOnboarding/StudentDashboard'
import StudentOnboarding from './pages/studentOnboarding/StudentOnboarding'
import InternshipExperience from './pages/internshipexperience/InternshipExperience'

// Analytics Pages
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard'
import Reports from './pages/analytics/Reports'

import './App.css'

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }
  
  return <Layout>{children}</Layout>
}

// Default redirect component
const DefaultRedirect = () => {
  const { user } = useAuth();
  return (
    <Navigate to={
      user?.role === 'admin' ? '/admin' :
      user?.role === 'employer' ? '/employer' :
      user?.role === 'student' ? '/student' :
      '/login'
    } />
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CompanyProvider>
          <PendingCompanyProvider>
            <StudentProvider>
              <InternshipProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/company-registration" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <CompanyRegistration />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/pending-companies" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <PendingCompanies />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/students" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminStudents />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/employers" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminEmployers />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/internships" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminInternships />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/internship-management" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <InternshipManagement />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Employer Routes */}
                  <Route 
                    path="/employer" 
                    element={
                      <ProtectedRoute allowedRoles={['employer']}>
                        <EmployerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/employer/operations" 
                    element={
                      <ProtectedRoute allowedRoles={['employer']}>
                        <InternshipOperations />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/employer/profile" 
                    element={
                      <ProtectedRoute allowedRoles={['employer']}>
                        <EmployerProfile />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Student Routes */}
                  <Route 
                    path="/student" 
                    element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/student/onboarding" 
                    element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentOnboarding />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/student/experience" 
                    element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <InternshipExperience />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Analytics Routes */}
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AnalyticsDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics/reports" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <Reports />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Default Route */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <DefaultRedirect />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </InternshipProvider>
            </StudentProvider>
          </PendingCompanyProvider>
        </CompanyProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
