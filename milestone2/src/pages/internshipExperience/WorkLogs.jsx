import { useState } from 'react'
import './WorkLogs.css'

const WorkLogs = () => {
  // Dummy data
  const [logs, setLogs] = useState([
    { 
      id: 1, 
      date: '2023-06-05', 
      hours: 8, 
      tasks: 'Data cleaning and preprocessing for Q2 project',
      learnings: 'Learned how to handle missing data and outliers in large datasets',
      status: 'approved'
    },
    { 
      id: 2, 
      date: '2023-06-12', 
      hours: 7, 
      tasks: 'Created initial data visualizations for Q2 project',
      learnings: 'Improved my skills with data visualization libraries',
      status: 'approved'
    },
    { 
      id: 3, 
      date: '2023-06-19', 
      hours: 8, 
      tasks: 'Started building the visualization dashboard',
      learnings: 'Learned about interactive dashboards and user experience design',
      status: 'pending'
    }
  ])
  
  const [showModal, setShowModal] = useState(false)
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: 8,
    tasks: '',
    learnings: '',
    challenges: ''
  })
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewLog({
      ...newLog,
      [name]: value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    const log = {
      id: logs.length + 1,
      ...newLog,
      status: 'pending'
    }
    
    setLogs([log, ...logs])
    setShowModal(false)
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      hours: 8,
      tasks: '',
      learnings: '',
      challenges: ''
    })
  }
  
  return (
    <div className="work-logs">
      <div className="page-header">
        <h1>Work Logs</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Submit New Log
        </button>
      </div>
      
      <div className="logs-summary card">
        <div className="summary-item">
          <h3>Total Logs</h3>
          <div className="summary-value">{logs.length}</div>
        </div>
        <div className="summary-item">
          <h3>Total Hours</h3>
          <div className="summary-value">{logs.reduce((sum, log) => sum + log.hours, 0)}</div>
        </div>
        <div className="summary-item">
          <h3>Pending Approval</h3>
          <div className="summary-value">{logs.filter(log => log.status === 'pending').length}</div>
        </div>
      </div>
      
      <div className="logs-list">
        {logs.map(log => (
          <div key={log.id} className="log-card">
            <div className="log-header">
              <div className="log-date">
                <div className="log-day">{log.date.split('-')[2]}</div>
                <div className="log-month">
                  {new Date(log.date).toLocaleString('default', { month: 'short' })}
                </div>
              </div>
              
              <div className="log-info">
                <div className="log-hours">{log.hours} hours</div>
                <div className="log-status">
                  <span className={`status-badge ${log.status}`}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="log-content">
              <div className="log-section">
                <h3>Tasks Completed</h3>
                <p>{log.tasks}</p>
              </div>
              
              <div className="log-section">
                <h3>Learnings</h3>
                <p>{log.learnings}</p>
              </div>
            </div>
            
            {log.status === 'approved' && (
              <div className="log-feedback">
                <h3>Supervisor Feedback</h3>
                <p>Great work! Your data cleaning process was thorough and efficient.</p>
              </div>
            )}
            
            <div className="log-actions">
              <button className="btn btn-outline">Edit</button>
              {log.status === 'pending' && (
                <button className="btn btn-outline delete">Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* New Log Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Submit Work Log</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="log-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newLog.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="hours">Hours Worked *</label>
                  <input
                    type="number"
                    id="hours"
                    name="hours"
                    min="1"
                    max="24"
                    value={newLog.hours}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="tasks">Tasks Completed *</label>
                <textarea
                  id="tasks"
                  name="tasks"
                  value={newLog.tasks}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  placeholder="Describe the tasks you completed today"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="learnings">What Did You Learn? *</label>
                <textarea
                  id="learnings"
                  name="learnings"
                  value={newLog.learnings}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  placeholder="Share what you learned or skills you developed"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="challenges">Challenges (Optional)</label>
                <textarea
                  id="challenges"
                  name="challenges"
                  value={newLog.challenges}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe any challenges you faced"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkLogs