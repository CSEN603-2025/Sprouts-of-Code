import { useState } from 'react'
import { Link } from 'react-router-dom'
import './InternshipDashboard.css'

const InternshipDashboard = () => {
  // Dummy data
  const [internship, setInternship] = useState({
    id: 1,
    position: 'Data Analyst Intern',
    company: 'DataSystems Inc.',
    supervisor: 'Alex Johnson',
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    status: 'active',
    workLogs: 8,
    tasks: [
      { id: 1, title: 'Data cleaning for Q2 project', status: 'completed', due: '2023-06-15' },
      { id: 2, title: 'Create visualization dashboard', status: 'in-progress', due: '2023-06-30' },
      { id: 3, title: 'Analyze customer survey results', status: 'pending', due: '2023-07-10' }
    ]
  })
  
  const [activities, setActivities] = useState([
    { id: 1, type: 'feedback', title: 'Mid-term evaluation received', date: '2023-07-05' },
    { id: 2, type: 'task', title: 'Data cleaning task completed', date: '2023-06-15' },
    { id: 3, type: 'message', title: 'Message from supervisor', date: '2023-06-10' }
  ])
  
  return (
    <div className="internship-dashboard">
      <div className="internship-header">
        <div className="internship-title">
          <h1>{internship.position}</h1>
          <div className="company-name">{internship.company}</div>
          <div className="internship-period">{internship.startDate} - {internship.endDate}</div>
        </div>
        
        <div className="internship-header-actions">
          <button className="btn btn-outline">Contact Supervisor</button>
          <Link to="/internship/logs" className="btn btn-primary">Submit Work Log</Link>
        </div>
      </div>
      
      <div className="internship-stats">
        <div className="stat-card">
          <h3>Days Remaining</h3>
          <div className="stat-number">58</div>
        </div>
        <div className="stat-card">
          <h3>Work Logs</h3>
          <div className="stat-number">{internship.workLogs}</div>
        </div>
        <div className="stat-card">
          <h3>Tasks</h3>
          <div className="stat-number">{internship.tasks.length}</div>
        </div>
        <div className="stat-card">
          <h3>Overall Progress</h3>
          <div className="stat-number">35%</div>
        </div>
      </div>
      
      <div className="internship-content">
        <div className="tasks-section card">
          <div className="card-header">
            <h2 className="card-title">Current Tasks</h2>
          </div>
          
          <div className="tasks-list">
            {internship.tasks.map(task => (
              <div key={task.id} className={`task-item ${task.status}`}>
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <p className="task-due">Due: {task.due}</p>
                </div>
                <div className="task-status">
                  <span className={`status-badge ${task.status}`}>
                    {task.status.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="supervisor-section card">
          <div className="card-header">
            <h2 className="card-title">Supervisor</h2>
          </div>
          
          <div className="supervisor-info">
            <div className="supervisor-avatar">AJ</div>
            <div className="supervisor-details">
              <h3>{internship.supervisor}</h3>
              <p className="supervisor-title">Senior Data Analyst</p>
              <p className="supervisor-contact">alex.johnson@datasystems.com</p>
            </div>
          </div>
          
          <div className="supervisor-actions">
            <button className="btn btn-outline">Send Message</button>
            <button className="btn btn-outline">Schedule Meeting</button>
          </div>
        </div>
        
        <div className="activities-section card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
          </div>
          
          <div className="activities-list">
            {activities.map(activity => (
              <div key={activity.id} className={`activity-item ${activity.type}`}>
                <div className="activity-icon">
                  {activity.type === 'feedback' && '📝'}
                  {activity.type === 'task' && '✅'}
                  {activity.type === 'message' && '💬'}
                </div>
                <div className="activity-info">
                  <h3>{activity.title}</h3>
                  <p className="activity-date">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternshipDashboard