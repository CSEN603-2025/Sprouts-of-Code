import { useState } from 'react'
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
  
  // Dummy saved reports
  const [savedReports, setSavedReports] = useState([
    { 
      id: 1, 
      name: 'Internship Performance Q2 2023', 
      type: 'internship',
      date: '2023-07-01',
      format: 'pdf',
      size: '2.4 MB'
    },
    { 
      id: 2, 
      name: 'Employer Engagement Report', 
      type: 'employer',
      date: '2023-06-15',
      format: 'excel',
      size: '1.8 MB'
    },
    { 
      id: 3, 
      name: 'Student Placement Analysis', 
      type: 'student',
      date: '2023-05-30',
      format: 'pdf',
      size: '3.2 MB'
    }
  ])
  
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
            totalStudents: 245, // This would come from StudentContext in a real app
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
        id: savedReports.length + 1,
        name: `${reportName} ${new Date().toLocaleDateString()}`,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        format: format,
        size: `${(Math.random() * 5).toFixed(1)} MB`,
        data: reportData
      }
      
      setSavedReports([newReport, ...savedReports])
      setIsGenerating(false)
    }, 2000)
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
          </div>
          
          <div className="reports-list">
            <div className="reports-table-header">
              <div className="report-name-col">Name</div>
              <div className="report-date-col">Date</div>
              <div className="report-format-col">Format</div>
              <div className="report-actions-col">Actions</div>
            </div>
            
            {savedReports.map(report => (
              <div key={report.id} className="report-item">
                <div className="report-name-col">
                  <div className="report-icon">
                    {report.format === 'pdf' && '📄'}
                    {report.format === 'excel' && '📊'}
                    {report.format === 'csv' && '📋'}
                  </div>
                  <div className="report-details">
                    <div className="report-name">{report.name}</div>
                    <div className="report-size">{report.size}</div>
                  </div>
                </div>
                <div className="report-date-col">{report.date}</div>
                <div className="report-format-col">
                  <span className={`format-badge ${report.format}`}>
                    {report.format.toUpperCase()}
                  </span>
                </div>
                <div className="report-actions-col">
                  <button className="action-button">Download</button>
                  <button className="action-button">Share</button>
                  <button className="action-button danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports