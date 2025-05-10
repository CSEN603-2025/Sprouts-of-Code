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

const StudentDashboard = () => {
  const { user } = useAuth();
  const { students } = useStudent();
  const { internships } = useInternships();
  const { companies } = useCompany();

  // Get the logged-in student
  const student = students.find(s => s.email === user.email);

  // Map appliedInternships to actual internship data
  const applications = (student?.appliedInternships || []).map(app => {
    const internship = internships.find(i => i.id === app.internshipId);
    return internship
      ? { ...internship, status: app.status, date: internship.startDate || '' }
      : null;
  }).filter(Boolean);

  // Only pending applications
  const pendingApplications = applications.filter(app => app.status === 'pending');

  // Map completedInternships to actual internship data
  const completedInternships = applications.filter(id => id.status === 'completed');
  console.log(completedInternships);

  // Calculate total internship duration from student's appliedInternships with status 'completed', using the duration attribute
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
  const activeInternships = applications.filter(app => app.status === 'undergoing' || app.status === 'active');
  const upcomingInterviews = applications.filter(app => app.status === 'interview').length;

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
  ]);

  // Add new state for workshops
  const [workshops, setWorkshops] = useState({
    upcoming: [
      {
        id: 1,
        title: "Career Development Workshop",
        date: "2025-05-20",
        time: "14:00",
        speaker: "John Smith",
        speakerJob: "Senior Career Coach at LinkedIn",
        description: "Learn how to build your professional network"
      },
      {
        id: 2,
        title: "Resume Building Masterclass",
        date: "2025-05-09",
        time: "23:14",
        speaker: "Sarah Johnson",
        speakerJob: "HR Director at Google",
        description: "Create a standout resume that gets noticed"
      }
    ],
    live: [
      {
        id: 1,
        title: "Interview Preparation",
        speaker: "Mike Brown",
        speakerJob: "Technical Recruiter at Microsoft",
        description: "Live Q&A session on interview techniques",
        startTime: "2024-03-15T10:00:00"
      }
    ],
    recorded: [
      {
        id: 1,
        title: "Personal Branding",
        duration: "45:00",
        speaker: "Emma Wilson",
        speakerJob: "Digital Marketing Expert at Meta",
        description: "Build your professional brand online",
        videoUrl: "https://www.youtube.com/watch?v=4wJ4cMqYwow"
      },
      {
        id: 2,
        title: "Networking Strategies",
        duration: "30:00",
        speaker: "David Chen",
        speakerJob: "Senior Software Engineer at Amazon",
        description: "Master the art of professional networking",
        videoUrl: "https://www.youtube.com/watch?v=6aKbXzxNc4U"
      },
      {
        id: 3,
        title: "Career Path Planning",
        duration: "60:00",
        speaker: "Lisa Rodriguez",
        speakerJob: "Career Development Manager at IBM",
        description: "Plan your career trajectory effectively",
        videoUrl: "https://www.youtube.com/watch?v=8NBd15kL8Qk"
      }
    ]
  });

  const [isPro, setIsPro] = useState(false);

  // Add state to track registered workshops
  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);

  // Add video ref
  const videoRef = useRef(null);

  // Update video state management
  const [currentVideoState, setCurrentVideoState] = useState({
    currentWorkshopId: null,
    isLoading: false,
    playing: false,
    error: null
  });

  // Check if student is PRO based on internship duration
  useEffect(() => {
    const duration = calculateTotalDuration();
    setIsPro(duration >= '3 months');
  }, [completedInternships]);

  // Workshop handlers
  const handleRegisterWorkshop = (workshopId) => {
    console.log(`Registered for workshop ${workshopId}`);
    setRegisteredWorkshops(prev => [...prev, workshopId]);

    const workshop = workshops.upcoming.find(w => w.id === workshopId);
    if (workshop) {
      setNotifications(prev => [{
        id: Date.now(),
        message: `You have successfully registered for "${workshop.title}"`,
        read: false,
        time: "Just now"
      }, ...prev]);

      const workshopDate = new Date(`${workshop.date}T${workshop.time}`);
      const oneDayBefore = new Date(workshopDate.getTime() - 24 * 60 * 60 * 1000);
      
      if (oneDayBefore > new Date()) {
        setTimeout(() => {
          setNotifications(prev => [{
            id: Date.now(),
            message: `Reminder: "${workshop.title}" starts tomorrow at ${workshop.time}`,
            read: false,
            time: "Just now"
          }, ...prev]);
        }, oneDayBefore.getTime() - new Date().getTime());
      }

      if (workshopDate > new Date()) {
        setTimeout(() => {
          setNotifications(prev => [{
            id: Date.now(),
            message: `"${workshop.title}" is starting now!`,
            read: false,
            time: "Just now"
          }, ...prev]);
        }, workshopDate.getTime() - new Date().getTime());
      }
    }
  };

  const handleUnregisterWorkshop = (workshopId) => {
    console.log(`Unregistered from workshop ${workshopId}`);
    setRegisteredWorkshops(prev => prev.filter(id => id !== workshopId));

    const workshop = workshops.upcoming.find(w => w.id === workshopId);
    if (workshop) {
      setNotifications(prev => [{
        id: Date.now(),
        message: `You have unregistered from "${workshop.title}"`,
        read: false,
        time: "Just now"
      }, ...prev]);
    }
  };

  const handleJoinLiveWorkshop = (workshopId) => {
    console.log(`Joining live workshop ${workshopId}`);
  };

  const handleVideoControl = (action, workshopId) => {
    console.log('Video control clicked:', action, workshopId);
    if (action === 'play') {
      const workshop = workshops.recorded.find(w => w.id === workshopId);
      console.log('Attempting to play video:', workshop?.videoUrl);
      setCurrentVideoState({
        currentWorkshopId: workshopId,
        isLoading: true,
        playing: true,
        error: null
      });
    } else if (action === 'stop') {
      setCurrentVideoState({
        currentWorkshopId: null,
        isLoading: false,
        playing: false,
        error: null
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentVideoState(prev => ({
        ...prev,
        currentTime: videoRef.current.currentTime,
        duration: videoRef.current.duration
      }));
    }
  };

  const handleVideoError = (error) => {
    console.error('Video error:', error);
    setCurrentVideoState(prev => ({
      ...prev,
      isLoading: false,
      error: "Sorry, this video is currently unavailable. Please try again later."
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getEmbedUrl = (url) => {
    try {
      const videoId = url.split('v=')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error('Error converting URL:', error);
      return url;
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  // Helper to get company name by companyId
  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown Company';
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
            {isPro && (
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
          <div className="stat-number">{pendingApplications.length}</div>
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
            {pendingApplications.length > 0 ? (
              pendingApplications.map(app => (
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
                <p>No pending applications.</p>
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
      </div>
      
      {isPro && (
        <div className="workshops-section">
          <h2>Career Workshops</h2>
          
          <Paper elevation={3} sx={{ margin: '16px 0', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Workshops
            </Typography>
            <List>
              {workshops.upcoming.map(workshop => (
                <ListItem key={workshop.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <EventIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={workshop.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {workshop.speaker}
                        </Typography>
                        {` — ${workshop.speakerJob}`}
                        <br />
                        {`${workshop.description}`}
                        <br />
                        <Typography component="span" variant="caption" color="text.secondary">
                          {`${workshop.date} at ${workshop.time}`}
                        </Typography>
                      </>
                    }
                  />
                  <Button 
                    variant={registeredWorkshops.includes(workshop.id) ? "outlined" : "contained"}
                    color={registeredWorkshops.includes(workshop.id) ? "error" : "primary"}
                    onClick={() => registeredWorkshops.includes(workshop.id) 
                      ? handleUnregisterWorkshop(workshop.id)
                      : handleRegisterWorkshop(workshop.id)
                    }
                  >
                    {registeredWorkshops.includes(workshop.id) ? "Unregister" : "Register"}
                  </Button>
      </ListItem>
    ))}
  </List>
</Paper>
        
          <Paper elevation={3} sx={{ margin: '16px 0', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Live Workshops
            </Typography>
            <List>
              {workshops.live.map(workshop => (
                <ListItem key={workshop.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <VideoCallIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={workshop.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {workshop.speaker}
                        </Typography>
                        {` — ${workshop.speakerJob}`}
                        <br />
                        {`${workshop.description}`}
                      </>
                    }
                  />
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={() => handleJoinLiveWorkshop(workshop.id)}
                  >
                    Join Now
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper elevation={3} sx={{ margin: '16px 0', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pre-recorded Workshops
            </Typography>
            <List>
              {workshops.recorded.map(workshop => (
                <ListItem key={workshop.id} alignItems="flex-start" className="recorded-workshop">
                  <ListItemAvatar>
                    <Avatar>
                      <PlayArrowIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={workshop.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {workshop.speaker}
                        </Typography>
                        {` — ${workshop.speakerJob}`}
                        <br />
                        {`${workshop.description}`}
                        <br />
                        <Typography component="span" variant="caption" color="text.secondary">
                          Duration: {workshop.duration}
                        </Typography>
                      </>
                    }
                  />
                  {currentVideoState.currentWorkshopId === workshop.id ? (
                    <Button 
                      onClick={() => handleVideoControl('stop', workshop.id)}
                      variant="outlined"
                      color="error"
                      className="btn btn-outline"
                    >
                      Close Video
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleVideoControl('play', workshop.id)}
                      variant="contained"
                      color="error"
                      className="btn btn-primary"
                      startIcon={<PlayArrowIcon />}
                    >
                      Watch Workshop
                    </Button>
                  )}
                  {currentVideoState.currentWorkshopId === workshop.id && (
                    <div className="workshop-video-container">
                      <div className="video-player">
                        {currentVideoState.isLoading && (
                          <div className="video-loading">
                            <CircularProgress />
                            <Typography>Loading video...</Typography>
          </div>
                        )}
                        {currentVideoState.error ? (
                          <div className="video-error">
                            <Typography color="error">{currentVideoState.error}</Typography>
              </div>
                        ) : (
                          <iframe
                            width="560"
                            height="315"
                            src={`${getEmbedUrl(workshop.videoUrl)}?autoplay=${currentVideoState.playing ? 1 : 0}`}
                            title={workshop.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => {
                              console.log('Video iframe loaded successfully');
                              setCurrentVideoState(prev => ({ ...prev, isLoading: false }));
                            }}
                            onError={handleVideoError}
                          />
                        )}
            </div>
          </div>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard