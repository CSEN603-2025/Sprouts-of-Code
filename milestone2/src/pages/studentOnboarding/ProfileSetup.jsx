import { useState } from 'react'
import './ProfileSetup.css'

const ProfileSetup = () => {
  const [profile, setProfile] = useState({
    fullName: 'John Student',
    email: 'student@example.com',
    phone: '',
    major: '',
    graduationYear: '',
    skills: '',
    bio: '',
    linkedin: '',
    github: ''
  })
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would update the profile via API
    alert('Profile updated successfully!')
  }
  
  return (
    <div className="profile-setup">
      <div className="page-header">
        <h1>Complete Your Profile</h1>
      </div>
      
      <div className="profile-completion-card">
        <div className="progress-bar-container">
          <div className="progress-text">Profile Completion: 75%</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
      
      <div className="profile-form-container card">
        <div className="card-header">
          <h2 className="card-title">Personal Information</h2>
        </div>
        
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-avatar">
            <div className="avatar-placeholder">JS</div>
            <button type="button" className="btn btn-outline">Change Photo</button>
          </div>
          
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  required
                  disabled
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="major">Major/Field of Study *</label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={profile.major}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="graduationYear">Expected Graduation Year *</label>
              <select
                id="graduationYear"
                name="graduationYear"
                value={profile.graduationYear}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Professional Information</h3>
            
            <div className="form-group">
              <label htmlFor="skills">Skills *</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={profile.skills}
                onChange={handleInputChange}
                required
                placeholder="e.g. JavaScript, React, UI/UX Design, Data Analysis"
              />
              <div className="form-hint">Separate skills with commas</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows="4"
                placeholder="Write a brief description about yourself"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Social Links</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn Profile</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="github">GitHub Profile</label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={profile.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSetup