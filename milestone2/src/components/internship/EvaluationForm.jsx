import { useState, useEffect } from 'react';
import { useInternshipReport } from '../../context/InternshipReportContext';
import { useAuth } from '../../context/AuthContext';
import { useInternships } from '../../context/InternshipContext';
import { useCompany } from '../../context/CompanyContext';
import './EvaluationForm.css';
import { jsPDF } from 'jspdf';

const EvaluationForm = ({ internshipId, onClose }) => {
  const { user } = useAuth();
  const { internships } = useInternships();
  const { companies } = useCompany();
  const { getEvaluation, createEvaluation, updateEvaluation, deleteEvaluation } = useInternshipReport();
  const [evaluation, setEvaluation] = useState({
    rating: 0,
    pros: '',
    cons: '',
    recommendation: false,
    comments: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const existingEvaluation = getEvaluation(user?.id, internshipId);
    if (existingEvaluation) {
      setEvaluation(existingEvaluation);
    }
  }, [internshipId, getEvaluation, user?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingEvaluation = getEvaluation(user?.id, internshipId);
    const internship = internships?.find(i => i.id === internshipId);
    const company = companies?.find(c => c.id === internship?.companyId);
    
    if (existingEvaluation) {
      updateEvaluation(user?.id, internshipId, {
        ...evaluation,
        companyId: internship?.companyId
      });
    } else {
      createEvaluation(user?.id, internshipId, {
        ...evaluation,
        companyId: internship?.companyId
      });
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 3000);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      deleteEvaluation(user?.id, internshipId);
      onClose();
    }
  };
  
  const handleDownloadPDF = () => {
    const internship = internships?.find(i => i.id === internshipId);
    const company = companies?.find(c => c.id === internship?.companyId);
    const companyName = company?.name || 'Unknown_Company';

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Company Evaluation', 10, 10);
  
    doc.setFontSize(12);
    doc.text(`Rating: ${evaluation.rating} / 5`, 10, 20);
  
    doc.text('Pros:', 10, 30);
    doc.text(doc.splitTextToSize(evaluation.pros, 180), 10, 40);
  
    const prosHeight = doc.splitTextToSize(evaluation.pros, 180).length * 10 + 40;
    doc.text('Cons:', 10, prosHeight);
    doc.text(doc.splitTextToSize(evaluation.cons, 180), 10, prosHeight + 10);
  
    const consHeight = prosHeight + doc.splitTextToSize(evaluation.cons, 180).length * 10 + 10;
    doc.text(
      `Would recommend: ${evaluation.recommendation ? 'Yes' : 'No'}`,
      10,
      consHeight + 10
    );
  
    const commentStart = consHeight + 20;
    doc.text('Additional Comments:', 10, commentStart);
    doc.text(doc.splitTextToSize(evaluation.comments, 180), 10, commentStart + 10);
  
    doc.save(`${companyName}_Evaluation.pdf`);
  };

  return (
    <div className="evaluation-form">
      {showSuccess && (
        <div className="success-notification">
          Your evaluation for {companies?.find(c => c.id === internships?.find(i => i.id === internshipId)?.companyId)?.name || 'the company'} has been successfully submitted
        </div>
      )}
      <h3>Company Evaluation</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating (1-5):</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`star ${star <= evaluation.rating ? 'active' : ''}`}
                onClick={() => setEvaluation(prev => ({ ...prev, rating: star }))}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Pros:</label>
          <textarea
            value={evaluation.pros}
            onChange={(e) => setEvaluation(prev => ({ ...prev, pros: e.target.value }))}
            placeholder="What did you like about the company?"
            required
          />
        </div>

        <div className="form-group">
          <label>Cons:</label>
          <textarea
            value={evaluation.cons}
            onChange={(e) => setEvaluation(prev => ({ ...prev, cons: e.target.value }))}
            placeholder="What could be improved?"
            required
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={evaluation.recommendation}
              onChange={(e) => setEvaluation(prev => ({ ...prev, recommendation: e.target.checked }))}
            />
            Would you recommend this company to other students?
          </label>
        </div>

        <div className="form-group">
          <label>Additional Comments:</label>
          <textarea
            value={evaluation.comments}
            onChange={(e) => setEvaluation(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="Any other thoughts about your experience?"
          />
        </div>

        <div className="form-actions">
          <div className="button-group">
            <button type="submit" className="btn-primary">
              {getEvaluation(user?.id, internshipId) ? 'Update Evaluation' : 'Submit Evaluation'}
            </button>
            {getEvaluation(user?.id, internshipId) && (
              <>
                <button type="button" className="btn-danger" onClick={handleDelete}>
                  Delete Evaluation
                </button>
                <button type="button" className="btn-info" onClick={handleDownloadPDF}>
                  Download PDF
                </button>
              </>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm; 