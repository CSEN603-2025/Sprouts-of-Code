import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useStudent } from '../../context/StudentContext'
import { useInternships } from '../../context/InternshipContext'
import { useInternshipReport } from '../../context/InternshipReportContext'
import './FacultyDashboard.css'

const FacultyDashboard = () => {
  const { user } = useAuth()
  const { students } = useStudent()
  const { internships } = useInternships()
  const { reports } = useInternshipReport()

  // Calculate statistics
  const stats = {
    totalStudents: students.length,
    completedInternships: internships.filter(internship => internship.status === 'completed').length,
    pendingReports: Object.values(reports).filter(report => report.status === 'pending').length
  }

  return (
    <div className="faculty-dashboard">
      <div className="page-header">
        <h1>Welcome, {user?.name}</h1>
        <p>Faculty Academic Dashboard</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-number">{stats.totalStudents}</div>
          <Link to="/faculty-academic/students" className="view-all-link">
            View All Students
          </Link>
        </div>

        <div className="stat-card">
          <h3>Completed Internships</h3>
          <div className="stat-number">{stats.completedInternships}</div>
          <Link to="/faculty/reports" className="view-all-link">
            View Reports
          </Link>
        </div>

        <div className="stat-card">
          <h3>Pending Reports</h3>
          <div className="stat-number">{stats.pendingReports}</div>
          <Link to="/faculty/reports" className="view-all-link">
            Review Reports
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FacultyDashboard 