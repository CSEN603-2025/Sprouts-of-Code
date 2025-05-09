import { useState } from 'react'
import { Link } from 'react-router-dom'
import './StudentDashboard.css'
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';


const StudentDashboard = () => {
  // Dummy data for student dashboard
  const [applications, setApplications] = useState([
    { id: 1, company: 'TechCorp', position: 'Frontend Developer', status: 'pending', date: '2023-05-15' },
    { id: 2, company: 'DataSystems', position: 'Data Analyst', status: 'approved', date: '2023-05-10' },
    { id: 3, company: 'InnovateTech', position: 'Mobile Developer', status: 'rejected', date: '2023-05-05' }
  ])
  
// ... inside StudentDashboard component ...
const [suggestedCompanies] = useState([
  {
    id: 1,
    name: "TechNova",
    industry: "Software",
    reason: "Matches your interest in Frontend Development",
    recommendedBy: "2 past interns",
    logo: "https://via.placeholder.com/40"
  },
  {
    id: 2,
    name: "GreenEnergy",
    industry: "Renewable Energy",
    reason: "Popular among students interested in sustainability",
    recommendedBy: "5 past interns",
    logo: "https://via.placeholder.com/40"
  },
  {
    id: 3,
    name: "FinWise",
    industry: "Finance",
    reason: "Recommended by past interns",
    recommendedBy: "3 past interns",
    logo: "https://via.placeholder.com/40"
  },
  // ... more companies ...
]);

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome back, John Student!</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Applications</h3>
          <div className="stat-number">3</div>
        </div>
        <div className="stat-card">
          <h3>Profile Completion</h3>
          <div className="stat-number">75%</div>
        </div>
        <div className="stat-card">
          <h3>Upcoming Interviews</h3>
          <div className="stat-number">1</div>
        </div>
        <div className="stat-card">
          <h3>Active Internships</h3>
          <div className="stat-number">1</div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">My Applications</h2>
            <Link to="/student/applications" className="btn btn-outline">View All</Link>
          </div>
          
          <div className="applications-list">
            {applications.map(app => (
              <div key={app.id} className="application-item">
                <div className="application-info">
                  <h3>{app.position}</h3>
                  <p className="company">{app.company}</p>
                  <p className="date">Applied: {app.date}</p>
                </div>
                <div className="application-status">
                  <span className={`status-badge ${app.status}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Paper elevation={3} sx={{ margin: '16px 0', padding: 2 }}>
  <Typography variant="h6" gutterBottom>
    Suggested Companies
  </Typography>
  <List sx={{ maxHeight: 220, overflow: 'auto' }}>
    {suggestedCompanies.map(company => (
      <ListItem key={company.id} alignItems="flex-start">
        <ListItemAvatar>
          <Avatar src={company.logo} alt={company.name} />
        </ListItemAvatar>
        <ListItemText
          primary={company.name}
          secondary={
            <>
              <Typography component="span" variant="body2" color="text.primary">
                {company.industry}
              </Typography>
              {" — " + company.reason}
              <br />
              <Typography component="span" variant="caption" color="text.secondary">
                {company.recommendedBy}
              </Typography>
            </>
          }
        />
      </ListItem>
    ))}
  </List>
</Paper>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Complete Your Profile</h2>
          </div>
          <div className="profile-completion">
            <div className="progress-bar">
              <div className="progress" style={{ width: '75%' }}></div>
            </div>
            <p>Complete your profile to improve your chances of getting hired</p>
            <Link to="/student/profile" className="btn btn-primary">Complete Profile</Link>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Active Internship</h2>
          </div>
          <div className="internship-card">
            <div className="internship-header">
              <div className="company-logo">DS</div>
              <div className="internship-details">
                <h3>Data Analyst Intern</h3>
                <p>DataSystems Inc.</p>
                <p className="internship-dates">Jun 1, 2023 - Aug 31, 2023</p>
              </div>
            </div>
            <div className="internship-actions">
              <Link to="/internship" className="btn btn-primary">Go to Dashboard</Link>
              <Link to="/internship/logs" className="btn btn-outline">Submit Work Log</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard