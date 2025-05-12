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
  const { students } = useStudent();
  const { internships } = useInternships();
  const { companies } = useCompany();
  const { appointments } = useAppointments();
  const prevAppointmentsRef = useRef([]);

  // Get the logged-in student from context data
  const student = students.find(s => s.email === user.email);

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
        return 'Accepted';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
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

  useEffect(() => {
    // Load notifications from localStorage
    const loadNotifications = () => {
      const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${user?.id}`) || '[]');
      setNotifications(storedNotifications);
    };
    
    loadNotifications();
  }, [user]);

  // Student appointment notifications
  useEffect(() => {
    if (!user || user.role !== 'student') return;
    
    // Notify for any accepted or rejected appointment where user is sender or receiver
    const myAppointments = appointments.filter(
      apt => (apt.senderId?.toString() === user.id?.toString() || apt.receiverId?.toString() === user.id?.toString()) &&
        (apt.status === 'accepted' || apt.status === 'rejected')
    );

    myAppointments.forEach(apt => {
      // Find the other party
      let otherPartyName = 'SCAD';
      if (apt.senderId?.toString() === user.id?.toString()) {
        // User is sender, so receiver is other party
        if (apt.receiverId !== 'SCAD') {
          const other = students.find(s => s.id.toString() === apt.receiverId.toString());
          if (other) otherPartyName = other.name;
        }
      } else {
        // User is receiver, so sender is other party
        if (apt.senderId !== 'SCAD') {
          const other = students.find(s => s.id.toString() === apt.senderId.toString());
          if (other) otherPartyName = other.name;
        }
      }
      const date = new Date(apt.date).toLocaleString();
      const message = `Your appointment with ${otherPartyName} on ${date} was ${apt.status}: ${apt.description}`;
      
      // Avoid duplicate notifications for the same appointment and status
      setNotifications(prev => {
        const alreadyExists = prev.some(n => n.message === message);
        if (alreadyExists) return prev;
        return [
          { id: Date.now() + Math.random(), message, read: false },
          ...prev
        ];
      });
    });
    
    // Save notifications to localStorage
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(notifications));
    
    prevAppointmentsRef.current = myAppointments.map(a => ({ ...a }));
  }, [appointments, user, students]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Mark all notifications as read
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    // Update localStorage
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };

  const handleClose = () => {
    setAnchorEl(null);
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