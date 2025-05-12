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

      <div className="profile-sidebar">
        <p><strong>Email:</strong> {student.email || 'N/A'}</p>
        <p><strong>University:</strong> {student.university || 'N/A'}</p>
        <p><strong>Major:</strong> {student.major || 'N/A'}</p>
        <p><strong>Graduation Year:</strong> {student.graduationYear || 'N/A'}</p>
        {student.isPro && <div className="pro-badge">Pro Student</div>}

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'applied' ? 'active' : ''}`}
            onClick={() => setActiveTab('applied')}
          >
            Applied
          </button>
          <button
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="profile-details">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <p>This student is a {student.isPro ? 'Pro' : 'Standard'} user.</p>
          </div>
        )}

        {activeTab === 'applied' && (
          <div className="applications-section">
            <h3>Applied Internships</h3>
            {student.appliedInternships?.length ? (
              student.appliedInternships.map(({ internshipId, status }) => (
                <div key={internshipId} className="application-card">
                  <p>ID: {internshipId}</p>
                  <p>Status: {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}</p>
                </div>
              ))
            ) : (
              <p>No applications yet.</p>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="completed-section">
            <h3>Completed Internships</h3>
            {student.completedInternships?.length ? (
              <ul>
                {student.completedInternships.map(id => (
                  <li key={id}>Internship ID: {id}</li>
                ))}
              </ul>
            ) : (
              <p>None completed yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudentProfile;
