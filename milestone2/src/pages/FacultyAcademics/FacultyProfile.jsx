import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useStudent } from '../../context/StudentContext'
import { useInternships } from '../../context/InternshipContext'
import { useInternshipReport } from '../../context/InternshipReportContext'
import './FacultyProfile.css'

const FacultyProfile = () => {
  const { user } = useAuth()
  const { students } = useStudent()
  const { internships } = useInternships()
  const { reports } = useInternshipReport()

  // Get faculty's students
  const facultyStudents = students.filter(student => 
    student.facultyAdvisor === user?.name
  )

  // Get students' internships
  const studentInternships = internships.filter(internship =>
    facultyStudents.some(student => student.name === internship.student)
  )

  // Get students' reports
  const studentReports = Object.values(reports).filter(report =>
    facultyStudents.some(student => student.name === report.studentName)
  )

  // Calculate statistics
  const stats = {
    totalStudents: facultyStudents.length,
    activeInternships: studentInternships.filter(internship => internship.status === 'active').length,
    completedInternships: studentInternships.filter(internship => internship.status === 'completed').length,
    pendingReports: studentReports.filter(report => report.status === 'pending').length
  }

  return (
    <div className="faculty-profile">
      <div className="profile-header">
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p>Faculty Academic Advisor</p>
          <p className="email">{user?.email}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Advisees</h3>
          <div className="stat-number">{stats.totalStudents}</div>
        </div>

        <div className="stat-card">
          <h3>Active Internships</h3>
          <div className="stat-number">{stats.activeInternships}</div>
        </div>

        <div className="stat-card">
          <h3>Completed Internships</h3>
          <div className="stat-number">{stats.completedInternships}</div>
        </div>

        <div className="stat-card">
          <h3>Pending Reports</h3>
          <div className="stat-number">{stats.pendingReports}</div>
        </div>
      </div>

      <div className="profile-sections">
        <div className="section">
          <h2>Advisees</h2>
          <div className="students-list">
            {facultyStudents.length > 0 ? (
              facultyStudents.map(student => (
                <div key={student.id} className="student-card">
                  <h3>{student.name}</h3>
                  <p>{student.email}</p>
                  <p>Department: {student.department}</p>
                  <p>Year: {student.year}</p>
                </div>
              ))
            ) : (
              <p>No students assigned</p>
            )}
          </div>
        </div>

        <div className="section">
          <h2>Recent Reports</h2>
          <div className="reports-list">
            {studentReports.length > 0 ? (
              studentReports
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
                .map(report => (
                  <div key={report.id} className="report-card">
                    <h3>{report.studentName}</h3>
                    <p>Status: <span className={`status ${report.status}`}>{report.status}</span></p>
                    <p>Last Updated: {new Date(report.updatedAt).toLocaleDateString()}</p>
                  </div>
                ))
            ) : (
              <p>No reports available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyProfile 