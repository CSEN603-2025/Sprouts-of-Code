
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useStudent } from '../../context/StudentContext'
import { useInternships } from '../../context/InternshipContext'
import { useCompany } from '../../context/CompanyContext'
import './StudentDashboard.css'
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import EventIcon from '@mui/icons-material/Event';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VerifiedIcon from '@mui/icons-material/Verified';
import { dummyCompanies, dummyStudents, dummyInternships } from '../../data/dummyData';
import '../../components/shared/Navbar.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Get the logged-in student using their email
  const loggedInStudent = dummyStudents.find(student => student.email === user.email);

  // Map appliedInternships to actual internship data
  const applications = (student?.appliedInternships || []).map(app => {
    const internship = dummyInternships.find(i => i.id === app.internshipId);
    return internship
      ? { ...internship, status: app.status, date: internship.startDate || '' }
      : null;
  }).filter(Boolean);

  // Only pending applications
  const pendingApplications = applications.filter(app => app.status === 'applied');

  // Map completedInternships to actual internship data
  const completedInternships = applications.filter(app => app.status === 'completed');

  // Calculate total internship duration from student's appliedInternships with status 'completed'
  const calculateTotalDuration = () => {
    let totalMonths = 0;
    (student?.appliedInternships || []).forEach(app => {
      if (app.status === 'completed') {
        const internship = dummyInternships.find(i => i.id === app.internshipId);
        if (internship && internship.duration) {
          // Extract the number from the duration string (e.g., '3 months')
          const match = internship.duration.match(/(\d+)/);
          if (match) {
            totalMonths += parseInt(match[1], 10);
          }
        }
      }
    });
    if (totalMonths === 0) {
      return 'Less than a month';
    } else if (totalMonths === 1) {
      return '1 month';
    } else {
      return `${totalMonths} months`;
    }
  };

  // Calculate stats
  const activeInternships = applications.filter(app => app.status === 'undergoing' || app.status === 'active');
  const upcomingInterviews = applications.filter(app => app.status === 'interview').length;


  // Helper to get company name by companyId
  const getCompanyName = (companyId) => {
    const company = dummyCompanies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown Company';
  };

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Load notifications from localStorage
    const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${user?.id}`) || '[]');
    setNotifications(storedNotifications);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <IconButton
            aria-label="show notifications"
            color="primary"
            onClick={handleBellClick}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '50%',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
              marginRight: '1rem'
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon sx={{ color: '#000', fontSize: '24px' }} />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              style: {
                width: '350px',
                padding: 0,
              },
            }}
          >
            <List sx={{ maxHeight: 300, overflow: 'auto', width: '100%' }}>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No notifications" />
                </ListItem>
              ) : (
                notifications.map((n) => (
                  <ListItem
                    key={n.id}
                    sx={{
                      backgroundColor: n.read ? '#fff' : '#e3f2fd',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                    }}
                    onClick={() => markAsRead(n.id)}
                  >
                    <ListItemText 
                      primary={n.message}
                      secondary={n.time}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Menu>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <p style={{ margin: 0 }}>Welcome back, {student ? student.name : 'Student'}!</p>
            {student?.isPro === true && (
              <span className="pro-badge">
                <VerifiedIcon style={{ fontSize: '14px', marginRight: '4px' }} />
                PRO
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Applications</h3>
          <div className="stat-number">{applications.length}</div>
        </div>
        <div className="stat-card">
          <h3>Duration Completed</h3>
          <div className="stat-number">{calculateTotalDuration()}</div>
        </div>
        <div className="stat-card">
          <h3>Upcoming Interviews</h3>
          <div className="stat-number">{upcomingInterviews}</div>
        </div>
        <div className="stat-card">
          <h3>Active Internships</h3>
          <div className="stat-number">{activeInternships.length}</div>
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
      
      <div className="dashboard-sections">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">My Applications</h2>
            <Link to="/student/applications" className="btn btn-outline">View All</Link>
          </div>
        )}

        {groupedApplications.finalized.length > 0 && (
          <div className="application-group">
            <h2 className="group-title finalized">
              Finalized Applications ({groupedApplications.finalized.length})
            </h2>
            <div className="applications-grid">
              {groupedApplications.finalized.map(app => (
                <div key={app.id} className="application-card finalized">
                  <div className="card-header">
                    <div className="header-main">
                      <h3>{app.position}</h3>
                      <div className="status-badge finalized">Finalized</div>
                    </div>
                    <div className="header-details">
                      <div className="company-info">
                        <i className="fas fa-building"></i>
                        <p className="company">{app.company}</p>
                      </div>
                      <div className="date-info">
                        <i className="fas fa-calendar"></i>
                        <p className="date">Applied: {app.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-section">
                      <h4>Job Details</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Location</span>
                          <span className="value">{app.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Duration</span>
                          <span className="value">{app.duration}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type</span>
                          <span className="value">{app.type}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Start Date</span>
                          <span className="value">{app.startDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Requirements</h4>
                      <p className="requirements">{app.requirements}</p>
                    </div>

                    <div className="info-section">
                      <h4>Description</h4>
                      <p className="description">{app.description}</p>
                    </div>

                    <div className="card-footer">
                      <span className="salary">{app.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* /*<div className="card">
          <div className="card-header">
            <h2 className="card-title">Completed Internships</h2>
          </div>
        )}

        {groupedApplications.rejected.length > 0 && (
          <div className="application-group">
            <h2 className="group-title rejected">
              Rejected Applications ({groupedApplications.rejected.length})
            </h2>
            <div className="applications-grid">
              {groupedApplications.rejected.map(app => (
                <div key={app.id} className="application-card rejected">
                  <div className="card-header">
                    <div className="header-main">
                      <h3>{app.position}</h3>
                      <div className="status-badge rejected">Rejected</div>
                    </div>
                    <div className="header-details">
                      <div className="company-info">
                        <i className="fas fa-building"></i>
                        <p className="company">{app.company}</p>
                      </div>
                      <div className="date-info">
                        <i className="fas fa-calendar"></i>
                        <p className="date">Applied: {app.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-section">
                      <h4>Job Details</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Location</span>
                          <span className="value">{app.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Duration</span>
                          <span className="value">{app.duration}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type</span>
                          <span className="value">{app.type}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Start Date</span>
                          <span className="value">{app.startDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Requirements</h4>
                      <p className="requirements">{app.requirements}</p>
                    </div>

                    <div className="info-section">
                      <h4>Description</h4>
                      <p className="description">{app.description}</p>
                    </div>

                    <div className="card-footer">
                      <span className="salary">{app.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Completed Internships Section at the end of the page */}
      {completedInternships.length > 0 && (
        <div className="completed-internships-section">
          <h2>Completed Internships</h2>
          <div className="completed-internships-list">
            {completedInternships.map(intern => (
              <div key={intern.id} className="completed-internship-card">
                <div className="completed-summary">
                  <span className="completed-position">{intern.position}</span>
                  <span className="completed-company">{intern.company}</span>
                  <button className="view-more-btn" onClick={() => toggleCompletedExpand(intern.id)}>
                    {expandedCompleted.includes(intern.id) ? 'Hide Details' : 'View More'}
                  </button>
                </div>
                {expandedCompleted.includes(intern.id) && (
                  <div className="completed-details">
                    <div><strong>Location:</strong> {intern.location}</div>
                    <div><strong>Duration:</strong> {intern.duration}</div>
                    <div><strong>Type:</strong> {intern.type}</div>
                    <div><strong>Start Date:</strong> {intern.startDate}</div>
                    <div><strong>Salary:</strong> {intern.salary}</div>
                    <div><strong>Requirements:</strong> {intern.requirements}</div>
                    <div><strong>Description:</strong> {intern.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default StudentDashboard
