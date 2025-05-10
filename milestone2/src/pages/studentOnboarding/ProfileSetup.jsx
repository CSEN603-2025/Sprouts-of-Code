import { useState, useEffect } from 'react'
import './ProfileSetup.css'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ProfileSetup = () => {
  const [profile, setProfile] = useState({
    fullName: 'John Student',
    email: 'student@example.com',
    phone: '',
    major: '',
    semester: '',
    graduationYear: '',
    skills: '',
    bio: '',
    linkedin: '',
    github: '',
    jobInterests: '',
    documents: {
      cv: null,
      additionalDocuments: []
    },
    internships: [
      {
        company: 'TechNova',
        role: 'Frontend Developer',
        duration: 'Jun 2022 - Aug 2022',
        responsibilities: 'Developed UI components using React and Redux.',
        isEditing: false
      },
      {
        company: 'GreenEnergy',
        role: 'Data Analyst',
        duration: 'Jan 2023 - Mar 2023',
        responsibilities: 'Analyzed renewable energy data and created reports.',
        isEditing: false
      }
    ],
    activities: [
      {
        name: 'Hackathon',
        description: 'Participated in a hackathon to develop a mobile app for a local charity.',
        isEditing: false
      }
    ]
  })
  
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'semester') {
      setProfile({
        ...profile,
        [name]: value,
        major: ''
      })
    } else {
      setProfile({
        ...profile,
        [name]: value
      })
    }
  }
  
  const handleInternshipChange = (idx, e) => {
    const { name, value } = e.target
    const updated = [...profile.internships]
    updated[idx][name] = value
    setProfile({ ...profile, internships: updated })
  }
  
  const addInternship = () => {
    setProfile({
      ...profile,
      internships: [...profile.internships, { company: '', role: '', duration: '', responsibilities: '', isEditing: true }]
    })
  }
  
  const removeInternship = (idx) => {
    const updated = profile.internships.filter((_, i) => i !== idx)
    setProfile({ ...profile, internships: updated })
  }
  
  const toggleEditInternship = (idx) => {
    const updated = [...profile.internships]
    updated[idx].isEditing = !updated[idx].isEditing
    setProfile({ ...profile, internships: updated })
  }
  
  const saveInternship = (idx) => {
    const updated = [...profile.internships]
    updated[idx].isEditing = false
    setProfile({ ...profile, internships: updated })
    // In a real app, send this to your backend
    console.log('Saving internship:', updated[idx])
  }
  
  const handleActivityChange = (idx, e) => {
    const { name, value } = e.target
    const updated = [...profile.activities]
    updated[idx][name] = value
    setProfile({ ...profile, activities: updated })
  }
  
  const addActivity = () => {
    setProfile({
      ...profile,
      activities: [...profile.activities, { name: '', description: '', isEditing: true }]
    })
  }
  
  const removeActivity = (idx) => {
    const updated = profile.activities.filter((_, i) => i !== idx)
    setProfile({ ...profile, activities: updated })
  }
  
  const toggleEditActivity = (idx) => {
    const updated = [...profile.activities]
    updated[idx].isEditing = !updated[idx].isEditing
    setProfile({ ...profile, activities: updated })
  }
  
  const saveActivity = (idx) => {
    const updated = [...profile.activities]
    updated[idx].isEditing = false
    setProfile({ ...profile, activities: updated })
    // In a real app, send this to your backend
    console.log('Saving activity:', updated[idx])
  }
  
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF or Word documents');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }

    if (type === 'cv') {
      // If CV already exists, don't allow new upload
      if (profile.documents.cv) {
        alert('Please remove the existing CV before uploading a new one');
        e.target.value = ''; // Reset the input
        return;
      }
      setProfile(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          cv: file
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          additionalDocuments: [...prev.documents.additionalDocuments, file]
        }
      }));
    }
  };

  const removeDocument = (index) => {
    setProfile(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        additionalDocuments: prev.documents.additionalDocuments.filter((_, i) => i !== index)
      }
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would update the profile via API
    setShowSuccessModal(true)
  }
  
  const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && showSuccessModal) {
      setShowSuccessModal(false);
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'employer') navigate('/employer');
      else if (user?.role === 'student') navigate('/student');
      else navigate('/');
    }
  };
  
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      setShowSuccessModal(false);
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'employer') navigate('/employer');
      else if (user?.role === 'student') navigate('/student');
      else navigate('/');
    }
  };
  
  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showSuccessModal, user, navigate]);
  
  const getMajorOptions = (semester) => {
    switch (semester) {
      case '1':
      case '2':
        return [
          'Engineering',
          'Architecture',
          'Pharmacy',
          'Management',
          'Business Informatics',
          'Law'
        ];
      case '3':
        return [
          'IET and MET',
          'Mechatronics',
          'Architecture',
          'Pharmacy',
          'Management',
          'Business Informatics',
          'Law'
        ];
      case '4':
        return [
          'IET',
          'MET',
          'Mechatronics',
          'Architecture',
          'Pharmacy',
          'Management',
          'Business Informatics',
          'Law'
        ];
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '10':
        return [
          'Electronics',
          'Networks',
          'Communications',
          'Computer Science',
          'DMET',
          'Mechatronics',
          'Architecture',
          'Pharmacy',
          'Management',
          'Business Informatics',
          'Law'
        ];
      default:
        return [];
    }
  };
  
  const semesters = Array.from({ length: 10 }, (_, i) => i + 1);
  
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
              

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="semester">Current Semester *</label>
                <select
                  id="semester"
                  name="semester"
                  value={profile.semester}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="major">Major/Field of Study *</label>
                <select
                  id="major"
                  name="major"
                  value={profile.major}
                  onChange={handleInputChange}
                  required
                  disabled={!profile.semester}
                >
                  <option value="">Select Major</option>
                  {getMajorOptions(profile.semester).map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
                {!profile.semester && (
                  <div className="form-hint">Please select a semester first</div>
                )}
              </div>
            </div>
            
              
              <div className="form-group">
                <label htmlFor="graduationYear"> Graduation Year *</label>
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
            <h3>Job Interests</h3>
            <div className="form-group">
              <label htmlFor="jobInterests">Job Interests</label>
              <input
                type="text"
                id="jobInterests"
                name="jobInterests"
                value={profile.jobInterests}
                onChange={handleInputChange}
                placeholder="e.g. Frontend Development, Data Science, Product Management"
              />
              <div className="form-hint">Separate interests with commas</div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Previous Internships & Part-time Jobs</h3>
            {profile.internships.map((intern, idx) => (
              <div key={idx} className="dynamic-entry">
                {intern.isEditing ? (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Company Name</label>
                        <input
                          type="text"
                          name="company"
                          value={intern.company}
                          onChange={e => handleInternshipChange(idx, e)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Role/Position</label>
                        <input
                          type="text"
                          name="role"
                          value={intern.role}
                          onChange={e => handleInternshipChange(idx, e)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Duration</label>
                        <input
                          type="text"
                          name="duration"
                          value={intern.duration}
                          onChange={e => handleInternshipChange(idx, e)}
                          placeholder="e.g. Jun 2022 - Aug 2022"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Responsibilities</label>
                      <textarea
                        name="responsibilities"
                        value={intern.responsibilities}
                        onChange={e => handleInternshipChange(idx, e)}
                        rows="2"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={() => removeInternship(idx)}>Remove</button>
                      <button type="button" className="btn btn-primary" onClick={() => saveInternship(idx)}>Save</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Company Name</label>
                        <div>{intern.company}</div>
                      </div>
                      <div className="form-group">
                        <label>Role/Position</label>
                        <div>{intern.role}</div>
                      </div>
                      <div className="form-group">
                        <label>Duration</label>
                        <div>{intern.duration}</div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Responsibilities</label>
                      <div>{intern.responsibilities}</div>
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={() => toggleEditInternship(idx)}>Edit</button>
                      <button type="button" className="btn btn-outline" onClick={() => removeInternship(idx)}>Remove</button>
                    </div>
                  </>
                )}
                <hr />
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addInternship}>Add Internship/Job</button>
          </div>
          
          <div className="form-section">
            <h3>College Activities</h3>
            {profile.activities.map((activity, idx) => (
              <div key={idx} className="dynamic-entry">
                {activity.isEditing ? (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Activity Name</label>
                        <input
                          type="text"
                          name="name"
                          value={activity.name}
                          onChange={e => handleActivityChange(idx, e)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <input
                          type="text"
                          name="description"
                          value={activity.description}
                          onChange={e => handleActivityChange(idx, e)}
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={() => removeActivity(idx)}>Remove</button>
                      <button type="button" className="btn btn-primary" onClick={() => saveActivity(idx)}>Save</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Activity Name</label>
                        <div>{activity.name}</div>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <div>{activity.description}</div>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={() => toggleEditActivity(idx)}>Edit</button>
                      <button type="button" className="btn btn-outline" onClick={() => removeActivity(idx)}>Remove</button>
                    </div>
                  </>
                )}
                <hr />
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addActivity}>Add Activity</button>
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
          
          <div className="form-section">
            <h3>Documents</h3>
            
            <div className="form-group">
              <label htmlFor="cv">CV/Resume *</label>
              <div className="file-upload-container">
                {!profile.documents.cv ? (
                  <input
                    type="file"
                    id="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'cv')}
                    required
                  />
                ) : (
                  <div className="file-info">
                    <span>{profile.documents.cv.name}</span>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => setProfile(prev => ({
                        ...prev,
                        documents: { ...prev.documents, cv: null }
                      }))}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <div className="form-hint">Upload your CV/Resume (PDF or Word format, max 5MB)</div>
            </div>

            <div className="form-group">
              <label htmlFor="additionalDocuments">Additional Documents</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="additionalDocuments"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'additional')}
                />
                <div className="form-hint">Upload certificates, cover letters, or other relevant documents</div>
              </div>
              
              {profile.documents.additionalDocuments.length > 0 && (
                <div className="additional-documents-list">
                  {profile.documents.additionalDocuments.map((doc, index) => (
                    <div key={index} className="file-info">
                      <span>{doc.name}</span>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm"
                        onClick={() => removeDocument(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <div className="modal-content">
              <h2>Profile Updated Successfully!</h2>
              <p>Your profile has been updated. You can now view your updated information.</p>
              <div className="modal-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    setShowSuccessModal(false);
                    if (user?.role === 'admin') navigate('/admin');
                    else if (user?.role === 'employer') navigate('/employer');
                    else if (user?.role === 'student') navigate('/student');
                    else navigate('/');
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileSetup