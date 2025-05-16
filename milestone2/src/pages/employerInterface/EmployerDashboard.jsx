import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCompany } from '../../context/CompanyContext'
import { useInternships } from '../../context/InternshipContext'
import './EmployerDashboard.css'

const EmployerDashboard = () => {
  const { user } = useAuth()
  const { companies } = useCompany()
  const { internships } = useInternships()
  
  // Get company data
  const company = companies.find(c => c.email === user.email)
  
  // Get company's internships
  const companyInternships = internships.filter(internship => 
    internship.companyId === company.id
  )
  // Calculate statistics
  const stats = {
    totalInternships: companyInternships.length,
    applications: companyInternships.reduce((total, internship) => {
      return total + internship.applicants.filter(applicant => applicant.status === "applied").length;
    }, 0),
    interns: companyInternships.reduce((total, internship) => {
      return total + internship.applicants.filter(applicant => applicant.status === "undergoing").length;
    }, 0)
  }
  
  // Get a preview of up to 3 applications (flattened from all internships)
  const previewApplications = companyInternships
    .flatMap(internship =>
      internship.applicants
        .filter(applicant => applicant.status === 'applied')
        .map(applicant => ({
          ...applicant,
          internshipPosition: internship.position,
          internshipId: internship.id
        }))
    )
    .slice(0, 3);

  return (
    <div className="employer-dashboard">
      <div className="page-header">
        <h1>Welcome, {company?.name}</h1>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Internships</h3>
          <div className="stat-number">{stats.totalInternships}</div>
          <Link to="/employer/internships" className="view-all-link">
            View All
          </Link>
        </div>
        <div className="stat-card">
          <h3>Applications</h3>
          <div className="stat-number">{stats.applications}</div>
          <Link to="/employer/applications" className="view-all-link">
            View All
          </Link>
        </div>
        <div className="stat-card">
          <h3>Interns</h3>
          <div className="stat-number">{stats.interns}</div>
          <Link to="/employer/interns" className="view-all-link">
            View All
          </Link>
        </div>
      </div>

      {/* Only Recent Applications Card Below Stats */}
      <div className="dashboard-mini-cards" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: 32 }}>
        <div className="mini-card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px rgba(74,144,226,0.10)', padding: 0, minWidth: 320, overflow: 'hidden' }}>
          <div style={{ background: '#1976d2', color: '#fff', padding: '18px 24px', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>Recent Applications</h3>
          </div>
          <div style={{ padding: 24 }}>
            {previewApplications.length === 0 ? (
              <p style={{ color: '#888', margin: 0 }}>No applications yet.</p>
            ) : (
              <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                {previewApplications.map((app, idx) => (
                  <li key={idx} style={{ marginBottom: 16, padding: '10px 0', borderBottom: idx !== previewApplications.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                    <strong style={{ color: '#1976d2' }}>{app.studentName || app.studentId}</strong> <span style={{ color: '#666', fontSize: 13 }}>({app.internshipPosition})</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/employer/applications" className="view-all-link" style={{ display: 'block', marginTop: 12, color: '#1976d2', fontWeight: 600 }}>View More</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard