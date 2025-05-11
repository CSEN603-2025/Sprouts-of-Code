import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = ({ user }) => {
  const location = useLocation()
  
  // Define menu items based on user role
  const getMenuItems = () => {
    if (!user) return []
    
    switch (user.role) {
      case 'student':
        const baseItems = [
          { label: 'Dashboard', path: '/student', icon: '📊' },
          { label: 'My Profile', path: '/student/profile', icon: '👤' },
          { label: 'Applications', path: '/student/applications', icon: '📝' },
          { label: 'Internships', path: '/student/internships', icon: '💼' },
          { label: 'Work Logs', path: '/internship/logs', icon: '📓' },
          { label: 'Certificates', path: '/student/certificates', icon: '🎓' },
        ];
        if (user.isPro) {
          baseItems.push(
            { label: 'Appointments', path: '/student/appointments', icon: '🎥' , pro : true},
            { label: 'Profile Viewers', path: '/student/profile-viewers', icon: '👁️', pro: true },
            { label: 'Online Assessments', path: '/student/assessments', icon: '📝', pro: true },
            { label: 'Career Workshops', path: '/student/workshops', icon: '🧑‍💻', pro: true }
          );
        }
        return baseItems;
      case 'employer':
        return [
          { label: 'Dashboard', path: '/employer', icon: '📊' },
          { label: 'Internships', path: '/employer/internships', icon: '📋' },
          { label: 'Applications', path: '/employer/applications', icon: '📝' },
          { label: 'Interns', path: '/employer/interns', icon: '👥' },
        ]
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin', icon: '📊' },
          { label: 'Students', path: '/admin/students', icon: '👨‍🎓' },
          { label: 'Employers', path: '/admin/employers', icon: '🏢' },
          { label: 'Internships', path: '/admin/internship-management', icon: '💼' },
          { label: 'Analytics', path: '/analytics', icon: '📈' },
          { label: 'Evaluations', path: '/admin/evaluations', icon: '📝' },
          { label: 'Reports', path: '/analytics/reports', icon: '📊' },
          { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
        ]
      default:
        return []
    }
  }
  
  const menuItems = getMenuItems()
  
  if (!user) return null
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="role-badge">{user.role.toUpperCase()}</div>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className={location.pathname === item.path ? 'active' : ''}>
            <Link to={item.path}>
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.pro && <span className="pro-badge">PRO</span>}
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <p>© 2025 Sprouts of Code</p>
      </div>
    </div>
  )
}

export default Sidebar