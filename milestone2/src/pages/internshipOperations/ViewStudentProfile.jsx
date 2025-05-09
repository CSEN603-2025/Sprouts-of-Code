// src/pages/internshipOperations/ViewStudentProfile.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewStudentProfile.css';

const ViewStudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Dummy data for student profile
  useEffect(() => {
    // In a real application, this would be an API call
    setStudent({
      id: studentId,
      name: 'John Student',
      email: 'john.student@example.com',
      major: 'Computer Science',
      semester: '6',
      gpa: '3.8',
      profileCompletion: 85,
      status: 'Active',
      joinDate: '2022-09-01',
      profilePicture: 'https://via.placeholder.com/150',
      contactInfo: {
        phone: '+20 123 456 7890',
        address: 'Cairo, Egypt',
        linkedin: 'linkedin.com/in/johnstudent'
      },
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
      languages: ['English', 'Arabic'],
      certifications: [
        {
          id: 1,
          name: 'Frontend Development',
          issuer: 'Tech Academy',
          date: '2023-12-15',
          score: 92
        },
        {
          id: 2,
          name: 'Data Structures & Algorithms',
          issuer: 'Code Institute',
          date: '2023-10-20',
          score: 88
        }
      ],
      applications: [
        {
          id: 1,
          company: 'TechCorp',
          position: 'Frontend Developer',
          status: 'pending',
          date: '2024-03-15'
        },
        {
          id: 2,
          company: 'DataSystems',
          position: 'Backend Developer',
          status: 'accepted',
          date: '2024-03-10'
        }
      ],
      internships: [
        {
          id: 1,
          company: 'InnovateTech',
          position: 'Software Developer Intern',
          startDate: '2024-01-15',
          endDate: '2024-04-15',
          status: 'active'
        }
      ]
    });
  }, [studentId]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-student-profile">
      <div className="profile-header">
        <button 
          className="btn btn-outline"
          onClick={() => navigate('/admin/students')}
        >
          <i className="fas fa-arrow-left"></i> Back to Students
        </button>
        <h1>Student Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="student-card">
            <div className="profile-picture">
              <img src={student.profilePicture} alt={student.name} />
            </div>
            <h2>{student.name}</h2>
            <p className="student-id">ID: {student.id}</p>
            <div className="status-badge">{student.status}</div>
            
            <div className="student-info">
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <span>{student.email}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-graduation-cap"></i>
                <span>{student.major}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-book"></i>
                <span>Semester {student.semester}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-star"></i>
                <span>GPA: {student.gpa}</span>
              </div>
            </div>
          </div>

          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              Applications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'internships' ? 'active' : ''}`}
              onClick={() => setActiveTab('internships')}
            >
              Internships
            </button>
            <button 
              className={`tab-btn ${activeTab === 'certifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('certifications')}
            >
              Certifications
            </button>
          </div>
        </div>

        <div className="profile-details">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="section-card">
                <h3>Contact Information</h3>
                <div className="contact-info">
                  <div className="info-item">
                    <i className="fas fa-phone"></i>
                    <span>{student.contactInfo.phone}</span>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{student.contactInfo.address}</span>
                  </div>
                  <div className="info-item">
                    <i className="fab fa-linkedin"></i>
                    <a href={student.contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3>Skills</h3>
                <div className="skills-list">
                  {student.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="section-card">
                <h3>Languages</h3>
                <div className="languages-list">
                  {student.languages.map((language, index) => (
                    <span key={index} className="language-tag">{language}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="applications-section">
              <h3>Application History</h3>
              <div className="applications-list">
                {student.applications.map(app => (
                  <div key={app.id} className="application-card">
                    <div className="app-header">
                      <h4>{app.position}</h4>
                      <span className={`status-badge ${app.status}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="app-details">
                      <p className="company">{app.company}</p>
                      <p className="date">Applied: {app.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'internships' && (
            <div className="internships-section">
              <h3>Internship History</h3>
              <div className="internships-list">
                {student.internships.map(internship => (
                  <div key={internship.id} className="internship-card">
                    <div className="internship-header">
                      <h4>{internship.position}</h4>
                      <span className={`status-badge ${internship.status}`}>
                        {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                      </span>
                    </div>
                    <div className="internship-details">
                      <p className="company">{internship.company}</p>
                      <p className="date">
                        {internship.startDate} - {internship.endDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="certifications-section">
              <h3>Certifications & Assessments</h3>
              <div className="certifications-list">
                {student.certifications.map(cert => (
                  <div key={cert.id} className="certification-card">
                    <div className="cert-header">
                      <h4>{cert.name}</h4>
                      <span className="score-badge">Score: {cert.score}%</span>
                    </div>
                    <div className="cert-details">
                      <p className="issuer">Issued by: {cert.issuer}</p>
                      <p className="date">Date: {cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentProfile;