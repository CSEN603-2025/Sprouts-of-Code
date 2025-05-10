import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useStudent } from '../../context/StudentContext'
import { useInternships } from '../../context/InternshipContext'
import './StudentOnboarding.css'

const StudentOnboarding = () => {
  const { user } = useAuth()
  const { students, updateStudent } = useStudent()
  const { internships } = useInternships()
  
  // Get student data
  const student = students.find(s => s.email === user.email)
  
  // Get student's internships
  const studentInternships = internships.filter(internship => 
    internship.student === student?.name
  )
  
  // State for form
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    department: student?.department || '',
    year: student?.year || '',
    skills: student?.skills || [],
    interests: student?.interests || [],
    resume: student?.resume || null
  })
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle skills and interests
  const handleArrayInput = (e, field) => {
    const value = e.target.value
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }))
      e.target.value = ''
    }
  }
  
  // Remove item from array
  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }))
    }
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    updateStudent(student.id, formData)
  }
  
  return (
    <div className="student-onboarding">
      <div className="page-header">
        <h1>Student Onboarding</h1>
        <p>Complete your profile to get started with internships</p>
      </div>
      
      <div className="onboarding-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="year">Year of Study</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <input
                type="text"
                id="skills"
                placeholder="Type a skill and press Enter"
                onKeyDown={(e) => handleArrayInput(e, 'skills')}
              />
              <div className="tags-list">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="tag">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeItem('skills', index)}
                      className="remove-tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="interests">Areas of Interest</label>
              <input
                type="text"
                id="interests"
                placeholder="Type an interest and press Enter"
                onKeyDown={(e) => handleArrayInput(e, 'interests')}
              />
              <div className="tags-list">
                {formData.interests.map((interest, index) => (
                  <span key={index} className="tag">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeItem('interests', index)}
                      className="remove-tag"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="resume">Resume</label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              {formData.resume && (
                <p className="file-name">{formData.resume.name}</p>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
          </form>
        </div>
        
        <div className="internships-section">
          <h2>Your Internships</h2>
          {studentInternships.length > 0 ? (
            <div className="internships-list">
              {studentInternships.map(internship => (
                <div key={internship.id} className="internship-card">
                  <div className="internship-header">
                    <h3>{internship.title}</h3>
                    <span className={`status-badge ${internship.status}`}>
                      {internship.status}
                    </span>
                  </div>
                  <p className="employer-name">{internship.employer}</p>
                  <div className="internship-details">
                    <span>{internship.department}</span>
                    <span>
                      {new Date(internship.startDate).toLocaleDateString()} - 
                      {new Date(internship.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-internships">
              You haven't applied for any internships yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentOnboarding 