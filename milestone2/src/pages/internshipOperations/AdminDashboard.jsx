import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AdminDashboard.css'

const AdminDashboard = () => {
  // Dummy stats data
  const stats = {
    students: 245,
    employers: 38,
    activeInternships: 87,
    pendingApprovals: 12
  }
  
  // Dummy recent activities
  const [activities, setActivities] = useState([
    { id: 1, type: 'application', message: 'New internship application from TechCorp needs approval', time: '2 hours ago' },
    { id: 2, type: 'student', message: 'John Smith completed profile registration', time: '4 hours ago' },
    { id: 3, type: 'employer', message: 'DataSystems Inc. posted 3 new job positions', time: '1 day ago' },
    { id: 4, type: 'internship', message: 'Sarah Johnson completed internship at WebTech', time: '2 days ago' }
  ])
  
  // Dummy pending approvals
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, type: 'employer', name: 'CloudNet Solutions', status: 'pending', date: '2023-06-15' },
    { id: 2, type: 'job', name: 'Software Developer Intern - TechCorp', status: 'pending', date: '2023-06-14' },
    { id: 3, type: 'internship', name: 'Marketing Intern - BrandWave', status: 'pending', date: '2023-06-12' }
  ])
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Admin!</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Students</h3>
          <div className="stat-number">{stats.students}</div>
          <Link to="/admin/students" className="stat-link">View all</Link>
        </div>
        <div className="stat-card">
          <h3>Employers</h3>
          <div className="stat-number">{stats.employers}</div>
          <Link to="/admin/employers" className="stat-link">View all</Link>
        </div>
        <div className="stat-card">
          <h3>Active Internships</h3>
          <div className="stat-number">{stats.activeInternships}</div>
          <Link to="/admin/internships" className="stat-link">View all</Link>
        </div>
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <div className="stat-number">{stats.pendingApprovals}</div>
          <Link to="/admin/approvals" className="stat-link">View all</Link>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="card pending-approvals">
          <div className="card-header">
            <h2 className="card-title">Pending Approvals</h2>
            <Link to="/admin/approvals" className="btn btn-outline">View All</Link>
          </div>
          
          <div className="approvals-list">
            {pendingApprovals.map(item => (
              <div key={item.id} className="approval-item">
                <div className="approval-info">
                  <div className="approval-type">
                    {item.type === 'employer' && '🏢'}
                    {item.type === 'job' && '📋'}
                    {item.type === 'internship' && '📝'}
                  </div>
                  <div className="approval-details">
                    <h3>{item.name}</h3>
                    <p className="approval-date">Submitted: {item.date}</p>
                  </div>
                </div>
                <div className="approval-actions">
                  <button className="btn btn-outline">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card recent-activity">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
          </div>
          
          <div className="activity-list">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-type">
                  {activity.type === 'application' && '📨'}
                  {activity.type === 'student' && '👨‍🎓'}
                  {activity.type === 'employer' && '🏢'}
                  {activity.type === 'internship' && '📝'}
                </div>
                <div className="activity-details">
                  <p className="activity-message">{activity.message}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card quick-actions">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          
          <div className="actions-grid">
            <Link to="/admin/students/create" className="action-card">
              <div className="action-icon">👨‍🎓</div>
              <div className="action-label">Add Student</div>
            </Link>
            
            <Link to="/admin/employers/create" className="action-card">
              <div className="action-icon">🏢</div>
              <div className="action-label">Add Employer</div>
            </Link>
            
            <Link to="/admin/internships/create" className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-label">Create Internship</div>
            </Link>
            
            <Link to="/analytics/reports" className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">Generate Report</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard