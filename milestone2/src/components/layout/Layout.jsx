import { useAuth } from '../../context/AuthContext'
import Navbar from '../shared/Navbar'
import Sidebar from '../shared/Sidebar'
import { useStudent } from '../../context/StudentContext'
import { useInternships } from '../../context/InternshipContext'
import './Layout.css'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const { students } = useStudent()
  const { internships } = useInternships()

  let userWithPro = user
  if (user && user.role === 'student') {
    const student = students.find(s => s.email === user.email)
    let totalMonths = 0
    if (student) {
      (student.appliedInternships || []).forEach(app => {
        if (app.status === 'completed') {
          const internship = internships.find(i => i.id === app.internshipId)
          if (internship && internship.duration) {
            const match = internship.duration.match(/(\d+)/)
            if (match) {
              totalMonths += parseInt(match[1], 10)
            }
          }
        }
      })
    }
    userWithPro = { ...user, isPro: totalMonths >= 3 }
  }

  return (
    <div className="layout">
      <Navbar user={userWithPro} onLogout={logout} />
      <div className="layout-content">
        <Sidebar user={userWithPro} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout 