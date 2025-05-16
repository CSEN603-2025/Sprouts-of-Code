import { useState, useEffect, useRef, useMemo } from 'react'
import { useCompany } from '../../context/CompanyContext'
import { usePendingCompany } from '../../context/PendingCompanyContext'
import { useInternships } from '../../context/InternshipContext'
import { useInternshipReport } from '../../context/InternshipReportContext'
import { useStudent } from '../../context/StudentContext'
import ReportStatusSection from '../../components/reports/ReportStatusSection'
import TopCoursesSection from '../../components/reports/TopCoursesSection'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Chart, registerables } from 'chart.js'
import './Reports.css'

// Register Chart.js components
Chart.register(...registerables)

const Reports = () => {
  const { companies } = useCompany()
  const { pendingCompanies } = usePendingCompany()
  const { internships } = useInternships()
  const { reports } = useInternshipReport()
  const { students } = useStudent()

  const [reportType, setReportType] = useState('internship')
  const [timeFrame, setTimeFrame] = useState('past-12-months')
  const [format, setFormat] = useState('pdf')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [filters, setFilters] = useState({
    major: '',
    status: ''
  })

  // Chart refs for each report type
  const studentPieRef = useRef(null)
  const studentBarRef = useRef(null)
  const internshipBarRef = useRef(null)
  const employerBarRef = useRef(null)
  const chartInstances = useRef([])

  // Load saved reports from localStorage on component mount
  const [savedReports, setSavedReports] = useState(() => {
    try {
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
    } catch (error) {
      console.error('Error loading saved reports:', error)
      return []
    }
  })

  // Save reports to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('savedReports', JSON.stringify(savedReports))
    } catch (error) {
      console.error('Error saving reports:', error)
    }
  }, [savedReports])

  // Render charts for each report type when modal opens
  useEffect(() => {
    let charts = []

    const cleanupCharts = () => {
      charts.forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          try {
            chart.destroy()
          } catch (error) {
            console.error('Error destroying chart:', error)
          }
        }
      })
      charts = []
    }

    // Cleanup previous charts
    cleanupCharts()

    if (!selectedReport) return

    const createChart = (canvas, config) => {
      if (!canvas) return null
      try {
        const ctx = canvas.getContext('2d')
        if (!ctx) return null
        return new Chart(ctx, config)
      } catch (error) {
        console.error('Error creating chart:', error)
        return null
      }
    }

    // Small delay to ensure canvas is ready
    const timeoutId = setTimeout(() => {
      try {
        if (selectedReport.type === 'student') {
          // Pie chart for placement
          if (studentPieRef.current) {
            const data = selectedReport.details
            const pieChart = createChart(studentPieRef.current, {
              type: 'pie',
              data: {
                labels: ['Placed', 'Not Placed'],
                datasets: [{
                  data: [
                    parseInt(data.placedStudents || 0),
                    parseInt((data.totalStudents || 0) - (data.placedStudents || 0))
                  ],
                  backgroundColor: ['#4caf50', '#e0e0e0']
                }]
              },
              options: { 
                plugins: { 
                  legend: { display: true, position: 'bottom' },
                  tooltip: { enabled: true }
                },
                responsive: true,
                maintainAspectRatio: false
              }
            })
            if (pieChart) charts.push(pieChart)
          }

          // Bar chart for top skills
          if (studentBarRef.current && selectedReport.details.topSkills) {
            const barChart = createChart(studentBarRef.current, {
              type: 'bar',
              data: {
                labels: selectedReport.details.topSkills,
                datasets: [{
                  label: 'Top Skills',
                  data: selectedReport.details.topSkills.map(() => 1),
                  backgroundColor: '#1976d2'
                }]
              },
              options: { 
                plugins: { 
                  legend: { display: false },
                  tooltip: { enabled: true }
                },
                responsive: true,
                maintainAspectRatio: false
              }
            })
            if (barChart) charts.push(barChart)
          }
        } else if (selectedReport.type === 'internship') {
          // Bar chart for internships by company
          if (internshipBarRef.current && selectedReport.details.internshipsByCompany) {
            const barChart = createChart(internshipBarRef.current, {
              type: 'bar',
              data: {
                labels: selectedReport.details.internshipsByCompany.map(i => i.company),
                datasets: [{
                  label: 'Internships',
                  data: selectedReport.details.internshipsByCompany.map(i => i.count),
                  backgroundColor: '#43a047'
                }]
              },
              options: { 
                plugins: { 
                  legend: { display: false },
                  tooltip: { enabled: true }
                },
                responsive: true,
                maintainAspectRatio: false
              }
            })
            if (barChart) charts.push(barChart)
          }
        } else if (selectedReport.type === 'employer') {
          // Bar chart for employers by industry
          if (employerBarRef.current && selectedReport.details.industries) {
            const industries = selectedReport.details.industries
            const barChart = createChart(employerBarRef.current, {
              type: 'bar',
              data: {
                labels: Object.keys(industries),
                datasets: [{
                  label: 'Employers',
                  data: Object.values(industries),
                  backgroundColor: '#ffa000'
                }]
              },
              options: { 
                plugins: { 
                  legend: { display: false },
                  tooltip: { enabled: true }
                },
                responsive: true,
                maintainAspectRatio: false
              }
            })
            if (barChart) charts.push(barChart)
          }
        }
      } catch (error) {
        console.error('Error rendering charts:', error)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      cleanupCharts()
    }
  }, [selectedReport])

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
    // Cleanup charts before closing
    chartInstances.current.forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        try {
          chart.destroy()
        } catch (error) {
          console.error('Error destroying chart:', error)
        }
      }
    })
    chartInstances.current = []
    setSelectedReport(null)
  }

  const handleDeleteReport = (reportId) => {
    setSavedReports(prev => prev.filter(report => report.id !== reportId))
  }

  const handleDownloadReport = async (report) => {
    const doc = new jsPDF()
    // Title
    doc.setFontSize(18)
    doc.text(report.name, 10, 20)
    doc.setFontSize(12)
    doc.text(`Date: ${report.date}`, 10, 30)
    doc.text(`Format: ${report.format.toUpperCase()}`, 10, 38)
    doc.text(`Size: ${report.size}`, 10, 46)
    doc.text(`Status: ${report.status}`, 10, 54)
    doc.text('---', 10, 60)
    // Analytics
    let y = 70
    if (report.details) {
      Object.entries(report.details).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          doc.text(`${key.split(/(?=[A-Z])/).join(' ')}: ${value}`, 10, y)
          y += 8
        }
      })
    }
    // Add charts
    if (report.type === 'student') {
      if (studentPieRef.current) {
        const chartImg = await html2canvas(studentPieRef.current, { backgroundColor: null })
        const imgData = chartImg.toDataURL('image/png')
        doc.addImage(imgData, 'PNG', 10, y + 5, 90, 60)
        y += 70
      }
      if (studentBarRef.current && report.details.topSkills) {
        const chartImg = await html2canvas(studentBarRef.current, { backgroundColor: null })
        const imgData = chartImg.toDataURL('image/png')
        doc.addImage(imgData, 'PNG', 10, y + 5, 90, 60)
        y += 70
      }
    } else if (report.type === 'internship') {
      if (internshipBarRef.current && report.details.internshipsByCompany) {
        const chartImg = await html2canvas(internshipBarRef.current, { backgroundColor: null })
        const imgData = chartImg.toDataURL('image/png')
        doc.addImage(imgData, 'PNG', 10, y + 5, 120, 60)
        y += 70
      }
    } else if (report.type === 'employer') {
      if (employerBarRef.current && report.details.industries) {
        const chartImg = await html2canvas(employerBarRef.current, { backgroundColor: null })
        const imgData = chartImg.toDataURL('image/png')
        doc.addImage(imgData, 'PNG', 10, y + 5, 120, 60)
        y += 70
      }
    }
    doc.save(`${report.name.replace(/\s+/g, '_')}.pdf`)
  }

  // Calculate top rated companies based on student evaluations
  const topRatedCompanies = useMemo(() => {
    if (!reports) return [];
    
    const companyRatings = {};
    
    // Transform nested evaluations object into flat array
    const allEvaluations = Object.entries(reports).flatMap(([userId, userReports]) => 
      Object.entries(userReports).map(([internshipId, evaluation]) => ({
        ...evaluation,
        studentId: parseInt(userId),
        internshipId: parseInt(internshipId)
      }))
    );
    
    // Get all evaluations
    allEvaluations.forEach(evaluation => {
      if (evaluation.companyId && evaluation.rating) {
        if (!companyRatings[evaluation.companyId]) {
          companyRatings[evaluation.companyId] = {
            totalRating: 0,
            count: 0
          };
        }
        companyRatings[evaluation.companyId].totalRating += evaluation.rating;
        companyRatings[evaluation.companyId].count += 1;
      }
    });

    // Calculate average ratings and sort
    return Object.entries(companyRatings)
      .map(([companyId, data]) => ({
        id: companyId,
        name: companies.find(c => c.id === parseInt(companyId))?.name || 'Unknown Company',
        averageRating: data.totalRating / data.count
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);
  }, [reports, companies]);

  // Calculate companies with most internships based on student applications
  const companiesWithMostInternships = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    
    const internshipCounts = {};
    
    // Count internships per company from student applications
    students.forEach(student => {
      if (student.appliedInternships) {
        student.appliedInternships.forEach(application => {
          const internship = internships.find(i => i.id === application.internshipId);
          if (internship?.companyId) {
            internshipCounts[internship.companyId] = (internshipCounts[internship.companyId] || 0) + 1;
          }
        });
      }
    });

    // Convert to array and sort
    return Object.entries(internshipCounts)
      .map(([companyId, count]) => ({
        id: companyId,
        name: companies.find(c => c.id === parseInt(companyId))?.name || 'Unknown Company',
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [students, internships, companies]);

  // Real-time statistics data
  const realTimeStats = {
    // Report status counts
    reportStatus: {
      accepted: savedReports.filter(r => r.status === 'approved').length,
      rejected: savedReports.filter(r => r.status === 'rejected').length,
      flagged: savedReports.filter(r => r.status === 'flagged').length
    },
    // Average review time (in days)
    averageReviewTime: 3.5,
    // Most frequent courses in internships
    frequentCourses: internships.reduce((acc, internship) => {
      const course = internship.course || 'Other'
      acc[course] = (acc[course] || 0) + 1
      return acc
    }, {}),
    // Top rated companies (based on student evaluations)
    topRatedCompanies: topRatedCompanies,
    // Top companies by internship count
    topCompaniesByInternships: companiesWithMostInternships
  }

  // Calculate average review time
  const calculateAverageReviewTime = useMemo(() => {
    const reportsWithStatus = Object.entries(reports).flatMap(([userId, userReports]) => 
      Object.values(userReports).filter(report => 
        report.status !== 'submitted' && report.submissionTime && report.statusUpdateTime
      )
    );

    if (reportsWithStatus.length === 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const totalTimeMs = reportsWithStatus.reduce((total, report) => {
      const submissionTime = new Date(report.submissionTime).getTime();
      const statusUpdateTime = new Date(report.statusUpdateTime).getTime();
      return total + (statusUpdateTime - submissionTime);
    }, 0);

    const averageTimeMs = totalTimeMs / reportsWithStatus.length;
    const hours = Math.floor(averageTimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((averageTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((averageTimeMs % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }, [reports]);

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
      </div>

      <div className="real-time-stats">
        <ReportStatusSection />

        <div className="stats-section">
          <h2>Review Metrics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Average Review Time</h3>
              <div className="stat-value">
                {calculateAverageReviewTime.hours}h {calculateAverageReviewTime.minutes}m {calculateAverageReviewTime.seconds}s
              </div>
              <div className="stat-label">Time to Review</div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Top Courses</h2>
          <div className="stats-grid">
            {realTimeStats.frequentCourses && Object.entries(realTimeStats.frequentCourses)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([course, count], index) => (
                <div key={course} className="stat-card">
                  <h3>#{index + 1} {course}</h3>
                  <div className="stat-number">{count}</div>
                  <div className="stat-label">Reports</div>
                </div>
              ))}
          </div>
        </div>

        <div className="stats-section">
          <h2>Top Companies</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Top Rated</h3>
              <div className="company-list">
                {topRatedCompanies.map((company, index) => (
                  <div key={company.id} className="company-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="name">{company.name}</span>
              </div>
            ))}
          </div>
            </div>
            <div className="stat-card">
              <h3>Most Internships</h3>
              <div className="company-list">
                {companiesWithMostInternships.map((company, index) => (
                  <div key={company.id} className="company-item">
                    <span className="rank">#{index + 1}</span>
                    <span className="name">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
                    <button className="action-button" onClick={() => handleDownloadReport(report)}>Download</button>
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

              {selectedReport.type === 'student' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px 0' }}>
                  <h4>Placement Rate</h4>
                  <canvas ref={studentPieRef} width={300} height={200} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: 24 }} />
                  {selectedReport.details.topSkills && (
                    <>
                      <h4>Top Skills</h4>
                      <canvas ref={studentBarRef} width={300} height={200} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }} />
                    </>
                  )}
                </div>
              )}
              {selectedReport.type === 'internship' && selectedReport.details.internshipsByCompany && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px 0' }}>
                  <h4>Internships by Company</h4>
                  <canvas ref={internshipBarRef} width={350} height={200} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }} />
                </div>
              )}
              {selectedReport.type === 'employer' && selectedReport.details.industries && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px 0' }}>
                  <h4>Employers by Industry</h4>
                  <canvas ref={employerBarRef} width={350} height={200} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }} />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseReport}>Close</button>
              <button className="btn btn-primary" onClick={() => handleDownloadReport(selectedReport)}>Download Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports