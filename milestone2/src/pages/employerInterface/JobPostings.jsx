import { useState } from 'react'
import { Link } from 'react-router-dom'
import './JobPostings.css'

const JobPostings = () => {
  // Dummy data
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      position: 'Frontend Developer', 
      department: 'Engineering',
      location: 'Cairo, Egypt',
      type: 'Full-time',
      applicants: 12, 
      status: 'active', 
      posted: '2023-05-01',
      description: 'We are looking for a Frontend Developer proficient in React to join our engineering team.'
    },
    { 
      id: 2, 
      position: 'Data Analyst', 
      department: 'Data Science',
      location: 'Remote',
      type: 'Full-time',
      applicants: 8, 
      status: 'active', 
      posted: '2023-05-05',
      description: 'Seeking a Data Analyst to help us make data-driven decisions.'
    },
    { 
      id: 3, 
      position: 'UX Designer', 
      department: 'Design',
      location: 'Cairo, Egypt',
      type: 'Part-time',
      applicants: 5, 
      status: 'closed', 
      posted: '2023-04-15',
      description: 'Looking for a creative UX Designer to improve our product experience.'
    }
  ])
  
  const [showModal, setShowModal] = useState(false)
  const [newJob, setNewJob] = useState({
    position: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: ''
  })
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewJob({
      ...newJob,
      [name]: value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    // For now, just add to the jobs list
    const job = {
      id: jobs.length + 1,
      ...newJob,
      applicants: 0,
      status: 'active',
      posted: new Date().toISOString().split('T')[0]
    }
    
    setJobs([job, ...jobs])
    setShowModal(false)
    setNewJob({
      position: '',
      department: '',
      location: '',
      type: 'Full-time',
      description: ''
    })
  }
  
  return (
    <div className="job-postings">
      <div className="page-header">
        <h1>Job Postings</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Post New Job
        </button>
      </div>
      
      <div className="filter-bar">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="search-input"
          />
        </div>
        
        <div className="filter-options">
          <select className="filter-select">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          
          <select className="filter-select">
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="data">Data Science</option>
          </select>
        </div>
      </div>
      
      <div className="jobs-table-container">
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Department</th>
              <th>Location</th>
              <th>Posted</th>
              <th>Applicants</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td className="position-cell">
                  <div className="position-name">{job.position}</div>
                  <div className="position-type">{job.type}</div>
                </td>
                <td>{job.department}</td>
                <td>{job.location}</td>
                <td>{job.posted}</td>
                <td className="applicants-cell">
                  <Link to={`/employer/applications?jobId=${job.id}`}>
                    {job.applicants} applicants
                  </Link>
                </td>
                <td>
                  <span className={`status-badge ${job.status}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </td>
                <td className="actions-cell">
                  <div className="table-actions">
                    <Link to={`/employer/jobs/${job.id}`} className="action-link">
                      View
                    </Link>
                    <button className="action-link">Edit</button>
                    <button className="action-link delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* New Job Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Post New Job</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-group">
                <label htmlFor="position">Position Title *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={newJob.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={newJob.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newJob.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Employment Type *</label>
                <select
                  id="type"
                  name="type"
                  value={newJob.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Job Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newJob.description}
                  onChange={handleInputChange}
                  rows="5"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobPostings