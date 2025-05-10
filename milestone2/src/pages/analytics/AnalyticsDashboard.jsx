import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCompany } from '../../context/CompanyContext'
import { usePendingCompany } from '../../context/PendingCompanyContext'
import { useInternships } from '../../context/InternshipContext'
import { useStudent } from '../../context/StudentContext'
import './AnalyticsDashboard.css'

const AnalyticsDashboard = () => {
  const { companies } = useCompany()
  const { pendingCompanies } = usePendingCompany()
  const { internships } = useInternships()
  const { students } = useStudent()

  // Calculate stats from real data
  const stats = {
    totalStudents: students.length,
    totalEmployers: companies.length,
    activeInternships: internships.filter(internship => internship.status === 'active').length,
    completedInternships: internships.filter(internship => internship.status === 'completed').length
  }

  // Calculate internships by month (based on startDate)
  const internshipsByMonth = Array(12).fill(0)
  internships.forEach(internship => {
    if (internship.startDate) {
      const month = new Date(internship.startDate).getMonth()
      internshipsByMonth[month]++
    }
  })

  // Calculate internships by department (using position/skills as proxy)
  const departmentMap = {}
  internships.forEach(internship => {
    const dept = internship.position?.split(' ')[0] || 'Other'
    departmentMap[dept] = (departmentMap[dept] || 0) + 1
  })
  const chartData = {
    internshipsByMonth,
    internshipsByDepartment: Object.entries(departmentMap).map(([department, count]) => ({ department, count }))
  }

  // Calculate insights from real data
  const insights = [
    {
      title: 'Increasing Employer Engagement',
      description: `Total employers increased to ${companies.length} with ${pendingCompanies.length} pending approvals.`,
      type: 'positive'
    },
    {
      title: 'Most Popular Department',
      description: `${chartData.internshipsByDepartment.length > 0 ? chartData.internshipsByDepartment[0].department : 'N/A'} has the highest internship count.`,
      type: 'positive'
    },
    {
      title: 'Internship Activity',
      description: `There are ${stats.activeInternships} active and ${stats.completedInternships} completed internships.`,
      type: 'positive'
    },
    {
      title: 'Student Participation',
      description: `There are currently ${students.length} registered students in the system.`,
      type: 'positive'
    }
  ]

  return (
    <div className="analytics-dashboard">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <div className="header-actions">
          <select className="time-select">
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
            <option>Last Year</option>
          </select>
          <Link to="/analytics/reports" className="btn btn-primary">
            Generate Report
          </Link>
        </div>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-number">{stats.totalStudents}</div>
          <div className="stat-change positive">+12% from last year</div>
        </div>
        <div className="stat-card">
          <h3>Total Employers</h3>
          <div className="stat-number">{stats.totalEmployers}</div>
          <div className="stat-change positive">+8% from last year</div>
        </div>
        <div className="stat-card">
          <h3>Active Internships</h3>
          <div className="stat-number">{stats.activeInternships}</div>
          <div className="stat-change positive">+15% from last year</div>
        </div>
        <div className="stat-card">
          <h3>Completed Internships</h3>
          <div className="stat-number">{stats.completedInternships}</div>
          <div className="stat-change positive">+22% from last year</div>
        </div>
      </div>
      
      <div className="analytics-content">
        <div className="chart-container card">
          <div className="card-header">
            <h2 className="card-title">Internships by Month</h2>
            <div className="chart-actions">
              <button className="chart-toggle active">Line</button>
              <button className="chart-toggle">Bar</button>
            </div>
          </div>
          
          <div className="chart-placeholder">
            <div className="chart-visual">
              <div className="bar-chart">
                {chartData.internshipsByMonth.map((count, index) => (
                  <div key={index} className="chart-bar" style={{ height: `${count * 2}px` }}>
                    <span className="bar-value">{count}</span>
                  </div>
                ))}
              </div>
              <div className="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color active"></div>
                <span>Active Internships</span>
              </div>
              <div className="legend-item">
                <div className="legend-color completed"></div>
                <span>Completed Internships</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="department-chart card">
          <div className="card-header">
            <h2 className="card-title">Internships by Department</h2>
          </div>
          
          <div className="department-list">
            {chartData.internshipsByDepartment.map((item, index) => (
              <div key={index} className="department-item">
                <div className="department-info">
                  <h3>{item.department}</h3>
                  <span className="department-count">{item.count} internships</span>
                </div>
                <div className="department-bar-container">
                  <div 
                    className="department-bar" 
                    style={{ width: `${(item.count / Math.max(...chartData.internshipsByDepartment.map(d => d.count))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="insights-card card">
          <div className="card-header">
            <h2 className="card-title">Key Insights</h2>
          </div>
          
          <div className="insights-list">
            {insights.map((insight, index) => (
              <div key={index} className="insight-item">
                <div className={`insight-icon ${insight.type}`}>
                  {insight.type === 'positive' ? '↗' : '↘'}
                </div>
                <div className="insight-content">
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard