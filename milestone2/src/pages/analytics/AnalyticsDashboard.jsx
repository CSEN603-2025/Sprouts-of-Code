import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AnalyticsDashboard.css'

const AnalyticsDashboard = () => {
  // Dummy stats
  const stats = {
    totalStudents: 245,
    totalEmployers: 38,
    activeInternships: 87,
    completedInternships: 156
  }
  
  // Dummy chart data
  const chartData = {
    internshipsByMonth: [32, 45, 37, 29, 43, 58, 70, 85, 65, 48, 42, 35],
    internshipsByDepartment: [
      { department: 'Engineering', count: 45 },
      { department: 'Business', count: 32 },
      { department: 'Design', count: 28 },
      { department: 'Marketing', count: 25 },
      { department: 'Data Science', count: 22 },
      { department: 'Finance', count: 16 },
      { department: 'Human Resources', count: 12 },
      { department: 'Other', count: 8 }
    ]
  }
  
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
              {/* In a real app, this would be a chart component */}
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
            <div className="insight-item">
              <div className="insight-icon positive">↗</div>
              <div className="insight-content">
                <h3>Increasing Employer Engagement</h3>
                <p>Employer participation increased by 15% compared to last quarter.</p>
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon positive">↗</div>
              <div className="insight-content">
                <h3>Engineering Internships Leading</h3>
                <p>The Engineering department continues to have the highest internship placement rate.</p>
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon negative">↘</div>
              <div className="insight-content">
                <h3>Finance Internships Decreased</h3>
                <p>Finance internships have decreased by 8% compared to last year.</p>
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon positive">↗</div>
              <div className="insight-content">
                <h3>Student Satisfaction Rate Up</h3>
                <p>Overall student satisfaction with internships has increased to 92%.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard