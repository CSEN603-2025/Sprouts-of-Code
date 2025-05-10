import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipContext'
import { useStudent } from '../../context/StudentContext'
import './InternshipExperience.css'

const InternshipExperience = () => {
  const { user } = useAuth()
  const { internships } = useInternships()
  const { students } = useStudent()
  
  // Get student data
  const student = students.find(s => s.email === user.email)
  
  // Get student's internships
  const studentInternships = internships.filter(internship => 
    internship.student === student?.name
  )
  
  // State for filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter internships
  const filteredInternships = studentInternships.filter(internship => {
    const matchesStatus = statusFilter === 'all' || internship.status === statusFilter
    const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         internship.employer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })
  
  return (
    <div className="internship-experience">
      <div className="page-header">
        <h1>My Internship Experience</h1>
        <p>Track and manage your internship journey</p>
      </div>
      
      <div className="experience-stats">
        <div className="stat-card">
          <h3>Total Internships</h3>
          <div className="stat-number">{studentInternships.length}</div>
        </div>
        <div className="stat-card">
          <h3>Active Internships</h3>
          <div className="stat-number">
            {studentInternships.filter(i => i.status === 'active').length}
          </div>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-number">
            {studentInternships.filter(i => i.status === 'completed').length}
          </div>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <div className="stat-number">
            {studentInternships.filter(i => i.status === 'pending').length}
          </div>
        </div>
      </div>
      
      <div className="experience-content">
        <div className="management-tools">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filters">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="internships-list">
          {filteredInternships.length > 0 ? (
            filteredInternships.map(internship => (
              <div key={internship.id} className="internship-card">
                <div className="internship-header">
                  <div className="internship-title">
                    <h2>{internship.title}</h2>
                    <span className={`status-badge ${internship.status}`}>
                      {internship.status}
                    </span>
                  </div>
                  <p className="employer-name">{internship.employer}</p>
                </div>
                
                <div className="internship-details">
                  <div className="detail-item">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">{internship.department}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">
                      {new Date(internship.startDate).toLocaleDateString()} - 
                      {new Date(internship.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{internship.location}</span>
                  </div>
                </div>
                
                <div className="internship-actions">
                  <button className="btn btn-secondary">View Details</button>
                  {internship.status === 'active' && (
                    <button className="btn btn-primary">Update Progress</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-internships">
              <p>No internships found matching your criteria.</p>
              <button className="btn btn-primary">Browse Opportunities</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InternshipExperience 