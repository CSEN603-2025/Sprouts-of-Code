import { useState } from 'react'
import { useInternships } from '../../context/InternshipContext'
import './InternshipDashboard.css'

const InternshipDashboard = () => {
  const { internships } = useInternships()
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  // Filter active internships and apply search
  const filteredInternships = internships
    .filter(internship => internship.status === 'active')
    .filter(internship => 
      internship.position.toLowerCase().includes(search.toLowerCase()) ||
      internship.employer.toLowerCase().includes(search.toLowerCase())
    )

  const handleApply = (internshipId) => {
    console.log("applied")
    setExpandedId(null)
  }

  return (
    <div className="internship-dashboard">
      <div className="page-header">
        <h1>Available Internships</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by job title or company name..."
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="internships-list">
        {filteredInternships.length === 0 ? (
          <div className="no-results">
            <p>No internships found matching your search criteria.</p>
          </div>
        ) : (
          filteredInternships.map(internship => (
            <div 
              key={internship.id} 
              className={`internship-card ${expandedId === internship.id ? 'expanded' : ''}`}
              onClick={() => setExpandedId(expandedId === internship.id ? null : internship.id)}
            >
              <div className="internship-header">
                <div className="company-logo">
                  {internship.employer.charAt(0)}
                </div>
                <div className="internship-details">
                  <h3>{internship.position}</h3>
                  <p className="company-name">{internship.employer}</p>
                  <p className="internship-duration">{internship.duration}</p>
                </div>
              </div>

              {expandedId === internship.id && (
                <div className="internship-expanded">
                  <div className="expanded-details">
                    <div className="detail-group">
                      <label>Skills Required:</label>
                      <p>{internship.skills}</p>
                    </div>
                    <div className="detail-group">
                      <label>Compensation:</label>
                      <p>{internship.paid ? `$${internship.expectedSalary}/month` : 'Unpaid'}</p>
                    </div>
                    <div className="detail-group">
                      <label>Description:</label>
                      <p>{internship.jobDescription}</p>
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary apply-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleApply(internship.id)
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default InternshipDashboard