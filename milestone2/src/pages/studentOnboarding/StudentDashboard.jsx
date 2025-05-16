import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useStudent } from '../../context/StudentContext'
import { useInternships } from '../../context/InternshipContext'
import { useCompany } from '../../context/CompanyContext'
import { useAppointments } from '../../context/AppointmentContext'
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
  const { students, checkCycleForStudent } = useStudent();
  const { internships } = useInternships();
  const { companies } = useCompany();
  const { appointments } = useAppointments();
  const prevAppointmentsRef = useRef([]);

  // Get the logged-in student from context data
  const student = students.find(s => s.email === user.email);
  
  // Debug log
  console.log('Student data:', {
    email: user.email,
    major: student?.major,
    videoPath: student?.major ? `/assets/videos/internship-requirements-${student.major.toLowerCase().replace(/\s+/g, '-')}.mp4` : 'No major'
  });

  // Map appliedInternships to actual internship data
  const applications = (student?.appliedInternships || []).map(app => {
    const internship = internships.find(i => i.id === app.internshipId);
    const company = companies.find(c => c.id === internship?.companyId);
    return internship
      ? { 
          ...internship, 
          status: app.status, 
          date: internship.startDate || '',
          company: company?.name || 'Unknown Company'
        }
      : null;
  }).filter(Boolean);

  // Helper function to get status display text
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'applied':
        return 'Pending';
      case 'undergoing':
        return 'Undergoing';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
      case 'finalized':
        return 'Finalized';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Helper function to get status class
  const getStatusClass = (status) => {
    switch(status) {
      case 'applied':
        return 'pending';
      case 'undergoing':
        return 'accepted';
      case 'completed':
        return 'completed';
      case 'rejected':
        return 'rejected';
      default:
        return status;
    }
  };

  // Calculate total internship duration from student's appliedInternships with status 'completed'
  const calculateTotalDuration = () => {
    let totalMonths = 0;
    (student?.appliedInternships || []).forEach(app => {
      if (app.status === 'completed') {
        const internship = internships.find(i => i.id === app.internshipId);
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
  const activeInternships = applications.filter(app => app.status === 'undergoing');
  const upcomingInterviews = applications.filter(app => app.status === 'interview').length;

  // Helper to get company name by companyId
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown Company';
  };

  // Get suggested companies based on student's major
  const getSuggestedCompanies = () => {
    if (!student) return [];

    // Map majors to relevant industries
    const majorToIndustries = {
      'Computer Science': ['Software Development', 'Artificial Intelligence', 'Data Science', 'Backend Development', 'Full Stack Development'],
      'Computer Engineering': ['Software Development', 'Network Engineering', 'IoT Development', 'Hardware', 'Embedded Systems'],
      'Software Engineering': ['Software Development', 'Full Stack Development', 'Backend Development', 'Frontend Development', 'DevOps'],
      'Information Technology': ['Software Development', 'IT Support', 'System Administration', 'Database Management', 'Cloud Computing']
    };

    // Get relevant industries for the student's major
    const relevantIndustries = majorToIndustries[student.major] || ['Software Development'];

    // Get companies that have internships in relevant industries
    const relevantCompanies = companies.filter(company => {
      const companyInternships = internships.filter(internship => 
        internship.companyId === company.id && 
        relevantIndustries.some(industry => 
          internship.industry.toLowerCase().includes(industry.toLowerCase())
        )
      );
      return companyInternships.length > 0;
    });

    // If no companies found, return some default companies
    if (relevantCompanies.length === 0) {
      return companies.slice(0, 3).map(company => ({
        id: company.id,
        name: company.name,
        industry: company.industry,
        reason: "Popular company in the tech industry",
        recommendedBy: "Multiple past interns",
        logo: company.logo
      }));
    }

    // Map companies to the required format
    return relevantCompanies.slice(0, 3).map(company => {
      const companyInternships = internships.filter(internship => 
        internship.companyId === company.id && 
        relevantIndustries.some(industry => 
          internship.industry.toLowerCase().includes(industry.toLowerCase())
        )
      );

      return {
        id: company.id,
        name: company.name,
        industry: company.industry,
        reason: `Matches your interest in ${student.major}`,
        recommendedBy: `${companyInternships.length} relevant internships`,
        logo: company.logo
      };
    });
  };

  const [suggestedCompanies] = useState(getSuggestedCompanies());

  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      if (!student || !student.id) {
        console.log('No student data available');
        return;
      }

      // Ensure student.id is a string
      const stringStudentId = student.id.toString();
      console.log('Loading notifications for student:', { id: stringStudentId, email: student.email });
      
      try {
        // Get notifications from localStorage
        const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${stringStudentId}`) || '[]');
        console.log('Loaded notifications from localStorage:', storedNotifications);
        
        // Sort notifications by time (newest first)
        const sortedNotifications = storedNotifications.sort((a, b) => b.id - a.id);
        console.log('Sorted notifications:', sortedNotifications);
        
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
      }
    };
    
    // Load notifications immediately
    loadNotifications();

    // Create a custom event for notification updates
    const handleNotificationUpdate = () => {
      console.log('Notification update event received');
      loadNotifications();
    };

    // Add event listener for custom notification updates
    window.addEventListener('notificationUpdate', handleNotificationUpdate);
    
    // Add event listener for storage changes (for cross-tab updates)
    const handleStorageChange = (e) => {
      if (!student || !student.id) return;
      
      const stringStudentId = student.id.toString();
      console.log('Storage change detected:', { key: e.key, newValue: e.newValue });
      
      if (e.key === `notifications_${stringStudentId}`) {
        console.log('Notifications changed, reloading');
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('notificationUpdate', handleNotificationUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [student?.id]);

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Mark all notifications as read
    setNotifications(prev => {
      const updatedNotifications = prev.map(n => ({ ...n, read: true }));
      if (student?.id) {
        const stringStudentId = student.id.toString();
        console.log('Saving updated notifications:', updatedNotifications);
        try {
          localStorage.setItem(`notifications_${stringStudentId}`, JSON.stringify(updatedNotifications));
        } catch (error) {
          console.error('Error saving updated notifications:', error);
        }
      }
      return updatedNotifications;
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Add effect to check cycle notifications on mount
  useEffect(() => {
    if (user?.id) {
      checkCycleForStudent(user.id);
    }
  }, [user?.id, checkCycleForStudent]);

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
            <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
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
                  >
                    <ListItemText 
                      primary={n.message}
                      secondary={new Date(n.id).toLocaleString()}
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
        {/* <div className="stat-card">
          <h3>Upcoming Interviews</h3>
          <div className="stat-number">{upcomingInterviews}</div>
        </div> */}
        <div className="stat-card">
          <h3>Active Internships</h3>
          <div className="stat-number">{activeInternships.length}</div>
        </div>
      </div>

      {/* Internship Requirement Video Section */}
      <Paper elevation={3} sx={{ margin: '16px 0', padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Internship Requirements for {student?.major}
        </Typography>
        <div className="video-container">
          <video 
            controls
            className="requirement-video"
            onError={(e) => {
              console.error('Video Error:', e.target.error);
              console.log('Attempted video source:', `/assets/videos/internship-requirements-${student?.major?.toLowerCase().replace(/\s+/g, '-')}.mp4`);
            }}
          >
            <source 
              src={`/assets/videos/internship-requirements-${student?.major?.toLowerCase().replace(/\s+/g, '-')}.mp4`} 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
          {!student?.major && (
            <Typography variant="body2" color="error">
              No major selected. Please update your profile.
            </Typography>
          )}
        </div>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Learn about the types of internships that count towards your internship requirements.
        </Typography>
      </Paper>

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
          <div className="applications-list">
            {applications.length > 0 ? (
              applications.map(app => (
                <div key={app.id} className="application-item">
                  <div className="application-info">
                    <h3>{app.position}</h3>
                    <p className="company">{app.company}</p>
                    <p className="date">Applied: {app.date}</p>
                    <p className="date">Duration: {app.duration}</p>
                  </div>
                  <div className="application-status">
                    <span className={`status-badge ${getStatusClass(app.status)}`}>
                      {getStatusDisplay(app.status)}
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
        
        {/* /*<div className="card">
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
        </div>*/}
      </div>
    </div>
  )
}

export default StudentDashboard