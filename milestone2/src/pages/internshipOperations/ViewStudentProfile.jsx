// src/pages/internshipOperations/ViewStudentProfile.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../../context/StudentContext';
import './ViewStudentProfile.css';

const STATUS_LABELS = {
  applied: 'Applied',
  completed: 'Completed',
  undergoing: 'Undergoing',
};

const ViewStudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { getStudentById } = useStudent();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

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

  // Gather all internships with their status
  const allInternships = [
    ...(student.appliedInternships?.map(i => ({ ...i, status: i.status?.toLowerCase() || 'applied' })) || []),
    ...(student.completedInternships?.map(id => ({ internshipId: id, status: 'completed' })) || []),
  ];
  // Remove duplicates (if any)
  const uniqueInternships = Object.values(
    allInternships.reduce((acc, curr) => {
      acc[curr.internshipId] = curr;
      return acc;
    }, {})
  );
  // Only show applied, completed, undergoing
  const filteredByStatus = uniqueInternships.filter(i => ['applied', 'completed', 'undergoing'].includes(i.status));
  // Apply filter
  const displayedInternships =
    filter === 'all' ? filteredByStatus : filteredByStatus.filter(i => i.status === filter);

  return (
    <div className="view-student-profile single-col-layout">
      <div className="profile-header">
        <button
          className="btn btn-outline"
          style={{ position: "absolute", left: 0, top: 0 }}
          onClick={() => navigate('/admin/students')}
        >
          ← Back
        </button>
        <h1>{student.name || 'Unnamed Student'}</h1>
      </div>

      {/* Student Info Card */}
      <div className="student-info-card full-width">
        <div className="student-info-list">
          <p><strong>Email:</strong> {student.email || 'N/A'}</p>
          <p><strong>University:</strong> {student.university || 'N/A'}</p>
          <p><strong>Major:</strong> {student.major || 'N/A'}</p>
          <p><strong>Graduation Year:</strong> {student.graduationYear || 'N/A'}</p>
          {student.isPro && <div className="pro-badge">Pro Student</div>}
        </div>
      </div>

      {/* Overview Section */}
      <div className="profile-details full-width">
        <div className="overview-section">
          <p style={{ textAlign: 'center', fontWeight: 500, fontSize: '1.1rem' }}>
            This student is a {student.isPro ? 'Pro' : 'Standard'} user.
          </p>
        </div>
        <div className="internship-filter-bar">
          <button
            className={`internship-filter-btn${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`internship-filter-btn${filter === 'applied' ? ' active' : ''}`}
            onClick={() => setFilter('applied')}
          >
            Applied
          </button>
          <button
            className={`internship-filter-btn${filter === 'undergoing' ? ' active' : ''}`}
            onClick={() => setFilter('undergoing')}
          >
            Undergoing
          </button>
          <button
            className={`internship-filter-btn${filter === 'completed' ? ' active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <div className="internship-cards-grid single-col">
          {displayedInternships.length ? (
            displayedInternships.map(({ internshipId, status }) => (
              <div key={internshipId} className="internship-card">
                <div className="internship-card-header">
                  <span className="internship-id">Internship ID: {internshipId}</span>
                  <span className={`status-badge ${status}`}>{STATUS_LABELS[status] || status}</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '24px' }}>No internships found for this filter.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentProfile;