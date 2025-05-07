import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubmissionSuccess.css';

const SubmissionSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h2>Submission Received!</h2>
        <p>Your company registration has been submitted successfully.</p>
        <p>Our team will review your application and get back to you soon.</p>
        <p className="redirect-message">Redirecting to login page in 5 seconds...</p>
        <button 
          className="login-now-btn"
          onClick={() => navigate('/login')}
        >
          Go to Login Now
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccess; 