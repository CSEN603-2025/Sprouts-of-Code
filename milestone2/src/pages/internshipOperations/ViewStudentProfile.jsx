// src/pages/internshipOperations/ViewStudentProfile.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../../context/StudentContext';
import './ViewStudentProfile.css';

const ViewStudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { getStudentById } = useStudent();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!studentId) {
          throw new Error('No student ID provided');
        }
    
        const studentData = await getStudentById(studentId);
        if (!studentData) {
          throw new Error('Student not found');
        }
        
        setStudent(studentData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, getStudentById]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!student) return <div className="error">Student not found</div>;

  return (
    <div className="view-student-profile">
      <div className="profile-header">
        <button className="btn btn-outline" onClick={() => navigate('/admin/students')}>
          ← Back
        </button>
        <h1>{student.name || 'Unnamed Student'}</h1>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p>{student.fullName || student.name || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{student.email || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{student.phone || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Major</label>
              <p>{student.major || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Semester</label>
              <p>{student.semester || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Graduation Year</label>
              <p>{student.graduationYear || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Professional Information</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>Bio</label>
              <p>{student.bio || 'No bio provided'}</p>
            </div>
            <div className="info-item">
              <label>Skills</label>
              <p>{student.skills || 'No skills listed'}</p>
            </div>
            <div className="info-item">
              <label>Job Interests</label>
              <p>{student.jobInterests || 'No job interests specified'}</p>
            </div>
            <div className="info-item">
              <label>LinkedIn</label>
              <p>{student.linkedin ? <a href={student.linkedin} target="_blank" rel="noopener noreferrer">{student.linkedin}</a> : 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>GitHub</label>
              <p>{student.github ? <a href={student.github} target="_blank" rel="noopener noreferrer">{student.github}</a> : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Previous Internships</h2>
          {student.internships?.length > 0 ? (
            <div className="internships-list">
              {student.internships.map((internship, index) => (
                <div key={index} className="internship-card">
                  <h3>{internship.company}</h3>
                  <p className="role">{internship.role}</p>
                  <p className="duration">{internship.duration}</p>
                  <p className="responsibilities">{internship.responsibilities}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No previous internships recorded</p>
          )}
        </div>

        <div className="profile-section">
          <h2>College Activities</h2>
          {student.activities?.length > 0 ? (
            <div className="activities-list">
              {student.activities.map((activity, index) => (
                <div key={index} className="activity-card">
                  <h3>{activity.name}</h3>
                  <p>{activity.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No college activities recorded</p>
          )}
        </div>

        <div className="profile-section">
          <h2>Documents</h2>
          <div className="documents-section">
            {student.documents?.cv ? (
              <div className="document-item">
                <span>CV</span>
                <a href={URL.createObjectURL(student.documents.cv)} target="_blank" rel="noopener noreferrer">View CV</a>
              </div>
            ) : (
              <p>No CV uploaded</p>
            )}
            
            {student.documents?.additionalDocuments?.length > 0 ? (
              <div className="additional-documents">
                <h3>Additional Documents</h3>
                {student.documents.additionalDocuments.map((doc, index) => (
                  <div key={index} className="document-item">
                    <span>{doc.name}</span>
                    <a href={URL.createObjectURL(doc)} target="_blank" rel="noopener noreferrer">View Document</a>
                  </div>
                ))}
              </div>
            ) : (
              <p>No additional documents uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentProfile;
