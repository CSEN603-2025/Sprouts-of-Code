import { useState, useEffect } from 'react';
import { useInternshipReport } from '../../context/InternshipReportContext';
import { useAuth } from '../../context/AuthContext';
import './SubmitReport.css';

const SubmitReport = ({ internshipId }) => {
  const { submitReport, getReport, updateReport, reports } = useInternshipReport();
  const { user } = useAuth();
  
  const [reportData, setReportData] = useState({
    title: '',
    introduction: '',
    body: '',
    conclusion: ''
  });
  const [existingReport, setExistingReport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if a report already exists for this internship
    const report = getReport(user.id, internshipId);
    if (report) {
      setExistingReport(report);
      setReportData({
        title: report.title || '',
        introduction: report.introduction || '',
        body: report.body || '',
        conclusion: report.conclusion || ''
      });
    } else {
      setExistingReport(null);
      setReportData({
        title: '',
        introduction: '',
        body: '',
        conclusion: ''
      });
    }
  }, [user.id, internshipId, getReport, reports]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingReport) {
      updateReport(user.id, internshipId, reportData);
      setIsEditing(false);
      alert('Report updated successfully!');
    } else {
      submitReport(user.id, internshipId, reportData);
      alert('Report submitted successfully!');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (existingReport && !isEditing) {
    return (
      <div className="submit-report-page">
        <div className="page-header">
          <h1>View Internship Report</h1>
        </div>

        <div className="report-form-section">
          <div className="report-view">
            <div className="report-section">
              <h3>Title</h3>
              <p>{existingReport.title}</p>
            </div>

            <div className="report-section">
              <h3>Introduction</h3>
              <p>{existingReport.introduction}</p>
            </div>

            <div className="report-section">
              <h3>Main Content</h3>
              <p>{existingReport.body}</p>
            </div>

            <div className="report-section">
              <h3>Conclusion</h3>
              <p>{existingReport.conclusion}</p>
            </div>

            <div className="report-status">
              <span className={`status-badge ${existingReport.status}`}>
                {existingReport.status}
              </span>
            </div>

            <button onClick={handleEdit} className="edit-button">
              Edit Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-report-page">
      <div className="page-header">
        <h1>{existingReport ? 'Edit Internship Report' : 'Submit Internship Report'}</h1>
      </div>

      <div className="report-form-section">
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="title">Report Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={reportData.title}
              onChange={handleChange}
              required
              placeholder="Enter report title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="introduction">Introduction</label>
            <textarea
              id="introduction"
              name="introduction"
              value={reportData.introduction}
              onChange={handleChange}
              required
              placeholder="Write your introduction..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Main Content</label>
            <textarea
              id="body"
              name="body"
              value={reportData.body}
              onChange={handleChange}
              required
              placeholder="Write your report content..."
              rows="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="conclusion">Conclusion</label>
            <textarea
              id="conclusion"
              name="conclusion"
              value={reportData.conclusion}
              onChange={handleChange}
              required
              placeholder="Write your conclusion..."
              rows="4"
            />
          </div>

          <button type="submit" className="submit-button">
            {existingReport ? 'Update Report' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport; 