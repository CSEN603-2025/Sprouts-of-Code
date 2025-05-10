import { useState } from 'react'
import { useInternships } from '../../context/InternshipContext'
import { useCompany } from '../../context/CompanyContext'
import { usePendingCompany } from '../../context/PendingCompanyContext'
import './InternshipManagement.css'

const InternshipManagement = () => {
  const { internships, deleteInternship } = useInternships()
  const { companies } = useCompany()
  const { pendingCompanies } = usePendingCompany()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Filter internships based on search and filter
  const filteredInternships = internships.filter(internship => {
    if (filter !== 'all' && internship.status !== filter) return false
    if (search &&
      !internship.employer.toLowerCase().includes(search.toLowerCase()) &&
      !internship.position.toLowerCase().includes(search.toLowerCase()) &&
      !internship.skills.toLowerCase().includes(search.toLowerCase())
    ) return false
    return true
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      deleteInternship(id)
    }
  }

  return (
    <div className="internship-management">
      <div className="page-header">
        <h1>Internship Management</h1>
      </div>
      <div className="filter-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search internships..."
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-options">
          <button className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-button ${filter === 'applications' ? 'active' : ''}`} onClick={() => setFilter('applications')}>Applications</button>
        </div>
      </div>
      <div className="internships-table-container">
        <table className="internships-table">
          <thead>
            <tr>
              <th>Employer</th>
              <th>Position</th>
              <th>Duration</th>
              <th>Paid</th>
              <th>Expected Salary</th>
              <th>Skills Required</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInternships.map(internship => (
              <tr key={internship.id}>
                <td>{internship.employer}</td>
                <td>{internship.position}</td>
                <td>{internship.duration}</td>
                <td>{internship.paid ? 'Paid' : 'Unpaid'}</td>
                <td>{internship.paid ? internship.expectedSalary : '-'}</td>
                <td>{internship.skills}</td>
                <td>{internship.jobDescription}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-button danger" onClick={() => handleDelete(internship.id)}>Delete</button>
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