import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TakeAssessment.css';

const TakeAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Dummy assessment data
  const assessment = {
    id: 1,
    title: 'Frontend Development Assessment',
    questions: [
      {
        id: 1,
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: [
          'var x = 5;',
          'variable x = 5;',
          'v x = 5;',
          'let x = 5;'
        ],
        correctAnswer: 0
      },
      // Add more questions here
    ]
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    // Calculate score
    const score = calculateScore();
    
    // Show confirmation dialog
    setShowConfirmSubmit(true);
  };

  const calculateScore = () => {
    let correct = 0;
    assessment.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / assessment.questions.length) * 100);
  };

  const confirmSubmit = () => {
    const score = calculateScore();
    // Save score to backend
    // Navigate to results page
    navigate(`/student/assessment-results/${id}?score=${score}`);
  };

  return (
    <div className="take-assessment">
      <div className="assessment-header">
        <h1>{assessment.title}</h1>
        <div className="timer">
          Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="assessment-content">
        <div className="question-card">
          <div className="question-header">
            <span className="question-number">Question {currentQuestion + 1}</span>
            <span className="question-count">of {assessment.questions.length}</span>
          </div>
          
          <div className="question-content">
            <p className="question-text">
              {assessment.questions[currentQuestion].question}
            </p>
            
            <div className="options-list">
              {assessment.questions[currentQuestion].options.map((option, index) => (
                <label key={index} className="option-item">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswer(currentQuestion, index)}
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="navigation-buttons">
          <button
            className="btn btn-outline"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(prev => prev - 1)}
          >
            Previous
          </button>
          
          {currentQuestion === assessment.questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit Assessment
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>

      {showConfirmSubmit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Submission</h2>
            <p>Are you sure you want to submit your assessment? This action cannot be undone.</p>
            <div className="modal-actions"> 
              <button
                className="btn btn-primary custom-submit-btn"
                onClick={confirmSubmit}
              >
                Submit
              </button>
              <button
                className="btn btn-outline custom-cancel-btn"
                onClick={() => setShowConfirmSubmit(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeAssessment;
