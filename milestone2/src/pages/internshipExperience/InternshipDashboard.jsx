import { useState } from 'react'
import './InternshipDashboard.css'

const InternshipDashboard = () => {
  // Dummy data for internships
  const [internships] = useState([
    {
      id: 1,
      company: 'TechCorp',
      position: 'Frontend Developer',
      status: 'current',
      startDate: '2023-06-01',
      endDate: '2023-09-01',
      description: 'Developing user interfaces using React and Redux',
      responsibilities: 'React, JavaScript, HTML/CSS',
      location: 'Cairo, Egypt',
      type: 'Full-time',
      salary: 'Paid',
      supervisor: 'John Doe',
      achievements: 'Implemented new features and improved performance'
    },
    {
      id: 2,
      company: 'DataSystems',
      position: 'Data Analyst',
      status: 'completed',
      startDate: '2023-01-01',
      endDate: '2023-04-01',
      description: 'Analyzing data and creating reports',
      responsibilities: 'Python, SQL, Data Analysis',
      location: 'Remote',
      type: 'Part-time',
      salary: 'Paid',
      supervisor: 'Jane Smith',
      achievements: 'Created automated reporting system'
    },
    {
      id: 3,
      company: 'TechCorp',
      position: 'Frontend Developer',
      status: 'completed',
      startDate: '2023-06-01',
      endDate: '2023-09-01',
      description: 'Developing user interfaces using React and Redux',
      responsibilities: 'React, JavaScript, HTML/CSS',
      location: 'Cairo, Egypt',
      type: 'Full-time',
      salary: 'Paid',
      supervisor: 'John Doe',
      achievements: 'Implemented new features and improved performance'
    },
    // Add more dummy data as needed
  ])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Filter internships based on search, status, and date
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.company.toLowerCase().includes(search.toLowerCase()) ||
                         internship.position.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || internship.status === statusFilter
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'current' && internship.status === 'current') ||
                       (dateFilter === 'completed' && internship.status === 'completed')
    return matchesSearch && matchesStatus && matchesDate
  })

  // Group internships by status
  const groupedInternships = {
    current: filteredInternships.filter(internship => internship.status === 'current'),
    completed: filteredInternships.filter(internship => internship.status === 'completed')
  }

  return (
    <div className="internship-dashboard">
      <div className="page-header">
        <h1>My Internships</h1>
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by company or position..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filters-row">
            <div className="status-filters">
              <button 
                className={`status-filter ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button 
                className={`status-filter ${statusFilter === 'current' ? 'active' : ''}`}
                onClick={() => setStatusFilter('current')}
              >
                Current
              </button>
              <button 
                className={`status-filter ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </button>
            </div>
            <div className="date-filters">
              <select 
                className="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="current">Current Internships</option>
                <option value="completed">Completed Internships</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="internships-container">
        {/* Current Internships */}
        {groupedInternships.current.length > 0 && (
          <div className="internship-group">
            <h2 className="group-title current">
              Current Internships ({groupedInternships.current.length})
            </h2>
            <div className="internships-grid">
              {groupedInternships.current.map(internship => (
                <div key={internship.id} className="internship-card current">
                  <div className="card-header">
                    <div className="header-main">
                      <h3>{internship.position}</h3>
                      <div className="status-badge current">Current</div>
                    </div>
                    <div className="header-details">
                      <div className="company-info">
                        <i className="fas fa-building"></i>
                        <p className="company">{internship.company}</p>
                      </div>
                      <div className="date-info">
                        <i className="fas fa-calendar"></i>
                        <p className="date">Started: {internship.startDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-section">
                      <h4>Internship Details</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Location</span>
                          <span className="value">{internship.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type</span>
                          <span className="value">{internship.type}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Supervisor</span>
                          <span className="value">{internship.supervisor}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">End Date</span>
                          <span className="value">{internship.endDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Responsibilities</h4>
                      <p className="responsibilities">{internship.responsibilities}</p>
                    </div>

                    <div className="info-section">
                      <h4>Description</h4>
                      <p className="description">{internship.description}</p>
                    </div>

                    <div className="info-section">
                      <h4>Achievements</h4>
                      <p className="achievements">{internship.achievements}</p>
                    </div>

                    <div className="card-footer">
                      <span className="salary">{internship.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Internships */}
        {groupedInternships.completed.length > 0 && (
          <div className="internship-group">
            <h2 className="group-title completed">
              Completed Internships ({groupedInternships.completed.length})
            </h2>
            <div className="internships-grid">
              {groupedInternships.completed.map(internship => (
                <div key={internship.id} className="internship-card completed">
                  <div className="card-header">
                    <div className="header-main">
                      <h3>{internship.position}</h3>
                      <div className="status-badge completed">Completed</div>
                    </div>
                    <div className="header-details">
                      <div className="company-info">
                        <i className="fas fa-building"></i>
                        <p className="company">{internship.company}</p>
                      </div>
                      <div className="date-info">
                        <i className="fas fa-calendar"></i>
                        <p className="date">Started: {internship.startDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-section">
                      <h4>Internship Details</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Location</span>
                          <span className="value">{internship.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type</span>
                          <span className="value">{internship.type}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Supervisor</span>
                          <span className="value">{internship.supervisor}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">End Date</span>
                          <span className="value">{internship.endDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Responsibilities</h4>
                      <p className="responsibilities">{internship.responsibilities}</p>
                    </div>

                    <div className="info-section">
                      <h4>Description</h4>
                      <p className="description">{internship.description}</p>
                    </div>

                    <div className="info-section">
                      <h4>Achievements</h4>
                      <p className="achievements">{internship.achievements}</p>
                    </div>

                    <div className="card-footer">
                      <span className="salary">{internship.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InternshipDashboard