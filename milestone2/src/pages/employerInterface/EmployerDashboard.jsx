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
    internship.employer === company?.name
  )
  
  // Calculate statistics
  const stats = {
    totalInternships: companyInternships.length,
    applications: companyInternships.filter(i => i.status === 'applications').length
  }
  
  return (
    <div className="employer-dashboard">
      <div className="page-header">
        <h1>Welcome, {company?.name}</h1>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Internships</h3>
          <div className="stat-number">{stats.totalInternships}</div>
          <Link to="/employer/operations" className="view-all-link">
            View All
          </Link>
        </div>
        <div className="stat-card">
          <h3>Applications</h3>
          <div className="stat-number">{stats.applications}</div>
          <Link to="/employer/operations?filter=applications" className="view-all-link">
            View All
          </Link>
        </div>
      </div>
      
      <div className="quick-actions card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        
        <div className="actions-grid">
          <button className="action-button">
            <span className="action-icon">📝</span>
            Create New Internship
          </button>
          <button className="action-button">
            <span className="action-icon">👥</span>
            View Applications
          </button>
          <button className="action-button">
            <span className="action-icon">📊</span>
            View Analytics
          </button>
          <button className="action-button">
            <span className="action-icon">⚙️</span>
            Update Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard