import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CompanyProvider } from './context/CompanyContext'
import { PendingCompanyProvider } from './context/PendingCompanyContext'
import { StudentProvider } from './context/StudentContext'
import { InternshipProvider } from './context/InternshipContext'
import { EvaluationProvider } from './context/EvaluationContext'
import { ReportPeriodProvider } from './context/ReportPeriodContext'
import Layout from './components/layout/Layout'

// Auth Pages
import Login from './pages/auth/Login'
import SubmissionSuccess from './pages/auth/SubmissionSuccess'

// Admin Pages
import AdminDashboard from './pages/internshipOperations/AdminDashboard'
import CompanyRegistration from './pages/auth/CompanyRegistration'
import PendingCompanies from './pages/internshipOperations/PendingCompanies'
import AdminStudents from './pages/admin/AdminStudents'
import AdminEmployers from './pages/admin/AdminEmployers'
import AdminInternships from './pages/admin/AdminInternships'
import InternshipManagement from './pages/internshipOperations/InternshipManagement'
import AdminEvaluations from './pages/internshipOperations/AdminEvaluations'

// Employer Pages
import EmployerDashboard from './pages/employerInterface/EmployerDashboard'
import InternshipOperations from './pages/employerInterface/InternshipOperations'
import EmployerProfile from './pages/employerInterface/EmployerProfile'
import EmployerApplications from './pages/employerInterface/EmployerApplications'
import EmployerInterns from './pages/employerInterface/EmployerInterns'

// Student Pages
import StudentDashboard from './pages/studentOnboarding/StudentDashboard'
import StudentOnboarding from './pages/studentOnboarding/StudentOnboarding'
import InternshipExperience from './pages/internshipexperience/InternshipExperience'
import AllInternships from './pages/studentOnboarding/AllInternships'
import MyApplications from './pages/studentOnboarding/MyApplications'
import ProfileSetup from './pages/studentOnboarding/ProfileSetup'
import ProfileViewers from './pages/studentOnboarding/ProfileViewers'
import OnlineAssessments from './pages/studentOnboarding/OnlineAssessments'
import Workshops from './pages/studentOnboarding/Workshops'
import WorkshopPlayer from './pages/studentOnboarding/WorkshopPlayer'
import Appointments from './pages/studentOnboarding/Appointments'

// Analytics Pages
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard'
import Reports from './pages/analytics/Reports'

import FacultyDashboard from './pages/FacultyAcademics/FacultyDashboard'

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
            user?.role === 'FacultyAcademic' ? '/faculty' :
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
                <EvaluationProvider>
                  <ReportPeriodProvider>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/submission-success" element={<SubmissionSuccess />} />

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
                        path="/company-registration"
                        element={<CompanyRegistration />}
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
                      <Route
                        path="/admin/evaluations"
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminEvaluations />
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
                        path="/employer/internships"
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
                      <Route
                        path="/employer/applications"
                        element={
                          <ProtectedRoute allowedRoles={['employer']}>
                            <EmployerApplications />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/employer/interns"
                        element={
                          <ProtectedRoute allowedRoles={['employer']}>
                            <EmployerInterns />
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
                        path="/student/workshops"
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <Workshops />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/workshops/:workshopId"
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <WorkshopPlayer />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/profile"
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <ProfileSetup />
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
                      <Route path="/student/internships" element={<AllInternships />} />
                      <Route
                        path="/student/applications"
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <MyApplications />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/profile-viewers"
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <ProfileViewers />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/student/assessments"
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <OnlineAssessments />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/student/appointments"
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <Appointments />
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

                      {/* Faculty Routes */}
                      <Route
                        path="/faculty"
                        element={
                          <ProtectedRoute allowedRoles={['FacultyAcademic']}>
                            <FacultyDashboard />
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
                  </ReportPeriodProvider>
                </EvaluationProvider>
              </InternshipProvider>
            </StudentProvider>
          </PendingCompanyProvider>
        </CompanyProvider>
      </AuthProvider>
    </Router>
  )
}

export default App