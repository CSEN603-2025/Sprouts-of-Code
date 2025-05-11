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

const StudentDashboard = () => {
  const { user } = useAuth();
  const { students } = useStudent();
  const { internships } = useInternships();
  const { companies } = useCompany();

  // Get the logged-in student from dummy data
  const student = dummyStudents.find(s => s.email === user.email);

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
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
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
              <Badge
                badgeContent={
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <VerifiedIcon style={{ fontSize: '16px' }} />
                    PRO
                  </span>
                }
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    position: 'static',
                    transform: 'none',
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              />
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
      
      <div className="dashboard-sections">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">My Applications</h2>
            <Link to="/student/applications" className="btn btn-outline">View All</Link>
          </div>
          <div className="applications-list">
            {applications.length > 0 ? (
              applications.map(app => (
                <div key={app.id} className="application-item">
                  <div className="application-info">
                    <h3>{app.position}</h3>
                    <p className="company">{getCompanyName(app.companyId)}</p>
                    <p className="date">Applied: {app.date}</p>
                    <p className="date">Duration: {app.duration}</p>
                  </div>
                  <div className="application-status">
                    <span className={`status-badge ${app.status}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="application-item">
                <p>No applications found.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Completed Internships</h2>
          </div>
          <div className="applications-list">
            {completedInternships.length > 0 ? (
              completedInternships.map(internship => (
                <div key={internship.id} className="application-item">
                  <div className="application-info">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' , width: '100%'}}>
                      <h3 style={{ margin: 0 }}>{internship.position}</h3>
                      <span className="status-badge completed">Completed</span>
                    </div>
                    <p className="company">{getCompanyName(internship.companyId)}</p>
                    <p className="date">Duration: {internship.duration}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="application-item">
                <p>No completed internships.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard