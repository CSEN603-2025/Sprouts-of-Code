import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AssessmentResults.css';

const AssessmentResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);

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
    </div>
  );
};

export default AssessmentResults;
