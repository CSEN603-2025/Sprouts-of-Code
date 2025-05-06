import { useState } from 'react'
import { Link } from 'react-router-dom'
import './EmployerDashboard.css'

const EmployerDashboard = () => {
  // Dummy data
  const [jobPostings, setJobPostings] = useState([
    { id: 1, position: 'Frontend Developer', applicants: 12, status: 'active', posted: '2023-05-01' },
    { id: 2, position: 'Data Analyst', applicants: 8, status: 'active', posted: '2023-05-05' },
    { id: 3, position: 'UX Designer', applicants: 5, status: 'closed', posted: '2023-04-15' }
  ])
  
  const [applicants, setApplicants] = useState([
    { id: 1, name: 'Sarah Johnson', position: 'Frontend Developer', status: 'screening', date: '2023-05-10' },
    { id: 2, name: 'Michael Chen', position: 'Frontend Developer', status: 'interview', date: '2023-05-08' },
    { id: 3, name: 'David Wilson', position: 'Data Analyst', status: 'pending', date: '2023-05-15' }
  ])
  
  return (
    <div className="employer-dashboard">
      <div className="dashboard-header">
        <h1>Employer Dashboard</h1>
        <p>Welcome back, Jane Employer!</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Job Postings</h3>
          <div className="stat-number">2</div>
        </div>
        <div className="stat-card">
          <h3>Total Applicants</h3>
          <div className="stat-number">25</div>
        </div>
        <div className="stat-card">
          <h3>Interviews Scheduled</h3>
          <div className="stat-number">3</div>
        </div>
        <div className="stat-card">
          <h3>Active Interns</h3>
          <div className="stat-number">5</div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Job Postings</h2>
            <Link to="/employer/jobs" className="btn btn-primary">Add New Job</Link>
          </div>
          
          <div className="jobs-list">
            {jobPostings.map(job => (
              <div key={job.id} className="job-item">
                <div className="job-info">
                  <h3>{job.position}</h3>
                  <p className="job-meta">Posted: {job.posted} | Applicants: {job.applicants}</p>
                </div>
                <div className="job-actions">
                  <span className={`status-badge ${job.status}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  <Link to={`/employer/jobs/${job.id}`} className="btn btn-outline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Applicants</h2>
            <Link to="/employer/applications" className="btn btn-outline">View All</Link>
          </div>
          
          <div className="applicants-list">
            {applicants.map(applicant => (
              <div key={applicant.id} className="applicant-item">
                <div className="applicant-info">
                  <h3>{applicant.name}</h3>
                  <p className="position">{applicant.position}</p>
                  <p className="date">Applied: {applicant.date}</p>
                </div>
                <div className="applicant-actions">
                  <span className={`status-badge ${applicant.status}`}>
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </span>
                  <Link to={`/employer/applications/${applicant.id}`} className="btn btn-outline">
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard