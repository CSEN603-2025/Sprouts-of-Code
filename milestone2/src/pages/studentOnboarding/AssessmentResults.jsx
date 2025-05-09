import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AssessmentResults.css';

const AssessmentResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Dummy data for assessment results
  useEffect(() => {
    // In a real application, this would be an API call
    setAssessment({
      id: parseInt(id),
      title: 'Frontend Development Assessment',
      score: 85,
      totalQuestions: 30,
      correctAnswers: 25,
      incorrectAnswers: 5,
      timeTaken: '45 minutes',
      completedDate: '2024-03-15',
      isPosted: false, // Add this field to track if score is posted
      questions: [
        {
          id: 1,
          question: 'What is the correct way to declare a variable in JavaScript?',
          yourAnswer: 'var x = 5;',
          correctAnswer: 'let x = 5;',
          isCorrect: false
        },
        // Add more questions as needed
      ]
    });
  }, [id]);

  const handlePostScore = async () => {
    setIsPosting(true);
    try {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Update the assessment's posted status
      setAssessment(prev => ({
        ...prev,
        isPosted: true
      }));
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error posting score:', error);
    } finally {
      setIsPosting(false);
    }
  };

  if (!assessment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="assessment-results">
      <div className="results-header">
        <h1>{assessment.title}</h1>
        <button 
          className="btn btn-outline"
          onClick={() => navigate('/student/assessments')}
        >
          Back to Assessments
        </button>
      </div>

      <div className="results-summary">
        <div className="score-card">
          <div className="score-circle">
            <span className="score-value">{assessment.score}%</span>
          </div>
          <div className="score-details">
            <div className="detail-item">
              <span className="label">Correct Answers:</span>
              <span className="value">{assessment.correctAnswers}</span>
            </div>
            <div className="detail-item">
              <span className="label">Incorrect Answers:</span>
              <span className="value">{assessment.incorrectAnswers}</span>
            </div>
            <div className="detail-item">
              <span className="label">Time Taken:</span>
              <span className="value">{assessment.timeTaken}</span>
            </div>
            <div className="detail-item">
              <span className="label">Completed Date:</span>
              <span className="value">{assessment.completedDate}</span>
            </div>
          </div>
        </div>

        {/* Add the post score section */}
        <div className="post-score-section">
          {assessment.isPosted ? (
            <div className="posted-badge">
              <i className="fas fa-check-circle"></i>
              <span>Score Posted on Profile</span>
            </div>
          ) : (
            <button 
              className={`btn btn-primary ${isPosting ? 'loading' : ''}`}
              onClick={handlePostScore}
              disabled={isPosting}
            >
              {isPosting ? 'Posting...' : 'Post Score on Profile'}
            </button>
          )}
        </div>
      </div>

      <div className="questions-review">
        <h2>Question Review</h2>
        <div className="questions-list">
          {assessment.questions.map((question, index) => (
            <div 
              key={question.id} 
              className={`question-item ${question.isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                <span className={`status-badge ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                  {question.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <p className="question-text">{question.question}</p>
              <div className="answer-details">
                <div className="answer-item">
                  <span className="label">Your Answer:</span>
                  <span className="value">{question.yourAnswer}</span>
                </div>
                <div className="answer-item">
                  <span className="label">Correct Answer:</span>
                  <span className="value">{question.correctAnswer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Score Posted Successfully!</h2>
            <p>Your assessment score has been added to your profile.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentResults;
