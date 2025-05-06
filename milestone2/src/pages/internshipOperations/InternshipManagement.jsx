import { useState } from 'react'
import './InternshipManagement.css'

const InternshipManagement = () => {
  // Dummy data
  const [internships, setInternships] = useState([
    {
      id: 1,
      student: 'John Smith',
      employer: 'TechCorp',
      position: 'Frontend Developer',
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      status: 'active',
      progress: 35
    },
    {
      id: 2,
      student: 'Sarah Johnson',
      employer: 'DataSystems',
      position: 'Data Analyst',
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      status: 'active',
      progress: 40
    },
    {
      id: 3,
      student: 'Michael Chen',
      employer: 'WebSolutions',
      position: 'UX Designer',
      startDate: '2023-05-15',
      endDate: '2023-08-15',
      status: 'active',
      progress: 50
    },
    {
      id: 4,
      student: 'Emily Davis',
      employer: 'MarketBoost',
      position: 'Marketing Intern',
      startDate: '2023-05-01',
      endDate: '2023-07-31',
      status: 'active',
      progress: 70
    },
    {
      id: 5,
      student: 'David Wilson',
      employer: 'TechCorp',
      position: 'Backend Developer',
      startDate: '2023-04-15',
      endDate: '2023-07-15',
      status: 'completed',
      progress: 100
    }
  ])
  
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  
  // Filter internships based on status and search
  const filteredInternships = internships.filter(internship => {
    // Filter by status
    if (filter !== 'all' && internship.status !== filter) {
      return false
    }
    
    // Filter by search term
    if (search && 
        !internship.student.toLowerCase().includes(search.toLowerCase()) &&
        !internship.employer.toLowerCase().includes(search.toLowerCase()) &&
        !internship.position.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    
    return true
  })
  
  return (
    <div className="internship-management">
      <div className="page-header">
        <h1>Internship Management</h1>
        <button className="btn btn-primary">Create Internship</button>
      </div>
      
      <div className="filter-bar">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search internships..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="filter-options">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      <div className="internships-table-container">
        <table className="internships-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Employer</th>
              <th>Position</th>
              <th>Period</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInternships.map(internship => (
              <tr key={internship.id}>
                <td>{internship.student}</td>
                <td>{internship.employer}</td>
                <td>{internship.position}</td>
                <td>{internship.startDate} to {internship.endDate}</td>
                <td>
                  <div className="progress-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${internship.progress}%` }}
                    ></div>
                    <span className="progress-text">{internship.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${internship.status}`}>
                    {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="action-button">View</button>
                    <button className="action-button">Edit</button>
                    {internship.status !== 'completed' && (
                      <button className="action-button danger">End</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredInternships.length === 0 && (
          <div className="no-results">
            <p>No internships found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InternshipManagement