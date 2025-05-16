import { useState } from 'react';
import { useInternshipReport } from '../../context/InternshipReportContext';
import { useAuth } from '../../context/AuthContext';
import './AppealModal.css';

const AppealModal = ({ internshipId, onClose }) => {
  const { user } = useAuth();
  const { getReport, submitAppeal } = useInternshipReport();
  const [appealMessage, setAppealMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const report = getReport(user?.id, internshipId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!appealMessage.trim()) {
      setError('Please enter your appeal message');
      return;
    }

    const success = submitAppeal(user?.id, internshipId, appealMessage);
    if (success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError('Failed to submit appeal. Please try again.');
    }
  };

  return (
    <div className="appeal-modal">
      <div className="appeal-modal-content">
        <div className="appeal-modal-header">
          <h2>Appeal Report Decision</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="appeal-modal-body">
          {report?.adminComment && (
            <div className="admin-comment-section">
              <h3>Faculty/Admin Comments</h3>
              <div className={`comment-box ${report.status}`}>
                <p>{report.adminComment}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="appealMessage">Your Appeal Message:</label>
              <textarea
                id="appealMessage"
                value={appealMessage}
                onChange={(e) => setAppealMessage(e.target.value)}
                placeholder="Please explain why you believe the report should be reconsidered..."
                rows="6"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Appeal submitted successfully!</div>}

            <div className="form-actions">
              <button type="submit" className="custom-submit-btn">
                Submit Appeal
              </button>
              <button type="button" className="custom-cancel-btn-yellow" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppealModal; 