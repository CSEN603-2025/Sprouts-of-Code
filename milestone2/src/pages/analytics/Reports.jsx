import { useState, useEffect } from 'react'
import { useCompany } from '../../context/CompanyContext'
import { usePendingCompany } from '../../context/PendingCompanyContext'
import { useInternships } from '../../context/InternshipContext'
import './Reports.css'

const Reports = () => {
  const { companies } = useCompany()
  const { pendingCompanies } = usePendingCompany()
  const { internships } = useInternships()

  const [reportType, setReportType] = useState('internship')
  const [timeFrame, setTimeFrame] = useState('past-12-months')
  const [format, setFormat] = useState('pdf')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [filters, setFilters] = useState({
    major: '',
    status: ''
  })
  
  // Load saved reports from localStorage on component mount
  const [savedReports, setSavedReports] = useState(() => {
    const saved = localStorage.getItem('savedReports')
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        name: 'Internship Performance Q2 2023', 
        type: 'internship',
        date: '2023-07-01',
        format: 'pdf',
        size: '2.4 MB',
        major: 'Computer Science',
        status: 'approved',
        details: {
          totalInternships: 45,
          activeInternships: 30,
          completedInternships: 15,
          averageDuration: '3.5 months',
          successRate: '92%',
          feedback: {
            positive: 85,
            neutral: 10,
            negative: 5
          }
        }
      },
      { 
        id: 2, 
        name: 'Employer Engagement Report', 
        type: 'employer',
        date: '2023-06-15',
        format: 'excel',
        size: '1.8 MB',
        major: 'Business',
        status: 'pending',
        details: {
          totalEmployers: 25,
          activeEmployers: 20,
          newEmployers: 5,
          engagementRate: '85%',
          industries: {
            'Technology': 10,
            'Finance': 8,
            'Healthcare': 7
          }
        }
      },
      { 
        id: 3, 
        name: 'Student Placement Analysis', 
        type: 'student',
        date: '2023-05-30',
        format: 'pdf',
        size: '3.2 MB',
        major: 'Engineering',
        status: 'flagged',
        details: {
          totalStudents: 150,
          placedStudents: 120,
          placementRate: '80%',
          averageSalary: '$45,000',
          topSkills: ['JavaScript', 'Python', 'Data Analysis']
        }
      }
    ]
  })

  // Save reports to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedReports', JSON.stringify(savedReports))
  }, [savedReports])

  const handleGenerateReport = () => {
    setIsGenerating(true)
    
    // Generate report based on selected type and current data
    setTimeout(() => {
      let reportData = {}
      let reportName = ''

      switch (reportType) {
        case 'internship':
          reportData = {
            totalInternships: internships.length,
            activeInternships: internships.filter(i => i.status === 'active').length,
            completedInternships: internships.filter(i => i.status === 'completed').length,
            internshipsByCompany: companies.map(company => ({
              company: company.name,
              count: internships.filter(i => i.employer === company.name).length
            }))
          }
          reportName = 'Internship Performance Report'
          break

        case 'employer':
          reportData = {
            totalEmployers: companies.length,
            pendingApprovals: pendingCompanies.length,
            employersByIndustry: companies.reduce((acc, company) => {
              acc[company.industry] = (acc[company.industry] || 0) + 1
              return acc
            }, {})
          }
          reportName = 'Employer Engagement Report'
          break

        case 'student':
          reportData = {
            totalStudents: 245,
            placementRate: '85%',
            averageDuration: '3.5 months'
          }
          reportName = 'Student Analytics Report'
          break

        default:
          reportData = {}
          reportName = 'General Report'
      }

      const newReport = {
        id: Date.now(), // Use timestamp as unique ID
        name: `${reportName} ${new Date().toLocaleDateString()}`,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        format: format,
        size: `${(Math.random() * 5).toFixed(1)} MB`,
        major: 'Computer Science', // This would be dynamic in a real app
        status: 'pending',
        details: reportData
      }
      
      setSavedReports(prev => [newReport, ...prev])
      setIsGenerating(false)
    }, 1500)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredReports = savedReports.filter(report => {
    if (filters.major && report.major !== filters.major) return false
    if (filters.status && report.status !== filters.status) return false
    return true
  })

  const handleViewReport = (report) => {
    setSelectedReport(report)
  }

  const handleCloseReport = () => {
    setSelectedReport(null)
  }

  const handleDeleteReport = (reportId) => {
    setSavedReports(prev => prev.filter(report => report.id !== reportId))
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
      </div>
      
      <div className="reports-container">
        <div className="generate-report-card card">
          <div className="card-header">
            <h2 className="card-title">Generate New Report</h2>
          </div>
          
          <div className="report-form">
            <div className="form-group">
              <label htmlFor="reportType">Report Type</label>
              <select 
                id="reportType" 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="internship">Internship Performance</option>
                <option value="student">Student Analytics</option>
                <option value="employer">Employer Engagement</option>
                <option value="department">Department Analysis</option>
                <option value="feedback">Feedback Summary</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="timeFrame">Time Frame</label>
              <select 
                id="timeFrame" 
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                <option value="past-12-months">Past 12 Months</option>
                <option value="past-6-months">Past 6 Months</option>
                <option value="past-3-months">Past 3 Months</option>
                <option value="current-year">Current Year</option>
                <option value="previous-year">Previous Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="format">Format</label>
              <select 
                id="format" 
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="saved-reports-card card">
          <div className="card-header">
            <h2 className="card-title">Saved Reports</h2>
            <div className="report-filters">
              <select 
                name="major" 
                value={filters.major}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Majors</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Business">Business</option>
                <option value="Engineering">Engineering</option>
              </select>
              <select 
                name="status" 
                value={filters.status}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="flagged">Flagged</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="reports-list">
            <div className="reports-table-header">
              <div className="report-name-col">Name</div>
              <div className="report-actions-col">
                <div className="actions-title">Actions</div>
              </div>
            </div>
            
            {filteredReports.map(report => (
              <div key={report.id} className="report-item">
                <div className="report-name-col">
                  <div className="report-details">
                    <div className="report-name">
                      {report.format === 'pdf' && <span className="format-icon">📄</span>}
                      {report.format === 'excel' && <span className="format-icon">📊</span>}
                      {report.format === 'csv' && <span className="format-icon">📑</span>}
                      {report.name}
                    </div>
                  </div>
                </div>
                <div className="report-actions-col">
                  <div className="action-buttons">
                    <button className="action-button" onClick={() => handleViewReport(report)}>View</button>
                    <button className="action-button">Download</button>
                    <button className="action-button">Share</button>
                    <button className="action-button danger" onClick={() => handleDeleteReport(report.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedReport && (
        <div className="report-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedReport.name}</h2>
              <button className="close-button" onClick={handleCloseReport}>×</button>
            </div>
            <div className="modal-body">
              <div className="report-metadata">
                <div className="metadata-item">
                  <label>Date Generated:</label>
                  <span>{selectedReport.date}</span>
                </div>
                <div className="metadata-item">
                  <label>Format:</label>
                  <span>{selectedReport.format.toUpperCase()}</span>
                </div>
                <div className="metadata-item">
                  <label>Size:</label>
                  <span>{selectedReport.size}</span>
                </div>
                <div className="metadata-item">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedReport.status}`}>
                    {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {(selectedReport.status === 'flagged' || selectedReport.status === 'rejected') && (
                <div className="report-comments">
                  <h3>Review Comments</h3>
                  <div className="comments-content">
                    {selectedReport.comments ? (
                      <div className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">Reviewer</span>
                          <span className="comment-date">{selectedReport.commentDate || selectedReport.date}</span>
                        </div>
                        <div className="comment-text">{selectedReport.comments}</div>
                      </div>
                    ) : (
                      <div className="no-comments">
                        No review comments available
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="report-details">
                <h3>Report Details</h3>
                {selectedReport.details && (
                  <div className="details-content">
                    {Object.entries(selectedReport.details).map(([key, value]) => (
                      <div key={key} className="detail-section">
                        <h4>{key.split(/(?=[A-Z])/).join(' ')}</h4>
                        {typeof value === 'object' ? (
                          <div className="nested-details">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey} className="detail-item">
                                <span className="detail-label">{subKey}:</span>
                                <span className="detail-value">{subValue}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="detail-value">{value}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseReport}>Close</button>
              <button className="btn btn-primary">Download Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports