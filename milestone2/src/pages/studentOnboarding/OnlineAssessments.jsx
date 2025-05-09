import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnlineAssessments.css';

const OnlineAssessments = () => {
  const navigate = useNavigate();

  // Dummy data for available assessments
  const [assessments] = useState([
    {
      id: 1,
      title: 'Frontend Development Assessment',
      description: 'Test your knowledge of HTML, CSS, and JavaScript',
      duration: 60, // in minutes
      questions: 30,
      difficulty: 'Intermediate',
      category: 'Web Development',
      status: 'available' // available, completed, in-progress
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      description: 'Test your understanding of common data structures and algorithms',
      duration: 90,
      questions: 40,
      difficulty: 'Advanced',
      category: 'Computer Science',
      status: 'available'
    },
    {
      id: 3,
      title: 'Database Management',
      description: 'SQL queries, database design, and optimization',
      duration: 45,
      questions: 25,
      difficulty: 'Beginner',
      category: 'Database',
      status: 'completed',
      score: 85
    }
  ]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, available, completed

  // Filter assessments based on search and status
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(search.toLowerCase()) ||
                         assessment.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || assessment.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleStartAssessment = (assessmentId) => {
    navigate(`/student/assessments/${assessmentId}`);
  };

  return (
    <div className="online-assessments">
      <div className="page-header">
        <h1>Online Assessments</h1>
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search assessments..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
              onClick={() => setFilter('available')}
            >
              Available
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      <div className="assessments-container">
        <div className="assessments-grid">
          {filteredAssessments.map(assessment => (
            <div key={assessment.id} className="assessment-card">
              <div className="card-header">
                <div className="header-main">
                  <h3>{assessment.title}</h3>
                  <div className={`status-badge ${assessment.status}`}>
                    {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                  </div>
                </div>
                <div className="header-details">
                  <div className="category-info">
                    <i className="fas fa-tag"></i>
                    <p className="category">{assessment.category}</p>
                  </div>
                  <div className="difficulty-info">
                    <i className="fas fa-signal"></i>
                    <p className="difficulty">{assessment.difficulty}</p>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <p className="description">{assessment.description}</p>
                <div className="assessment-meta">
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <span>{assessment.duration} minutes</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-list-ol"></i>
                    <span>{assessment.questions} questions</span>
                  </div>
                </div>
                {assessment.status === 'completed' ? (
                  <div className="completion-info">
                    <div className="score">
                      <span className="score-label">Your Score:</span>
                      <span className="score-value">{assessment.score}%</span>
                    </div>
                    <button 
                      className="btn btn-outline"
                      onClick={() => navigate(`/student/assessment-results/${assessment.id}`)}
                    >
                      View Results
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStartAssessment(assessment.id)}
                  >
                    Start Assessment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnlineAssessments;
