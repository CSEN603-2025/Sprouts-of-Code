import React, { useState, useEffect } from 'react';
import { useInternshipReport } from '../../context/InternshipReportContext';
import { useStudent } from '../../context/StudentContext';
import { useInternships } from '../../context/InternshipContext';
import { useCompany } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import { jsPDF } from 'jspdf';
import './FacultyReports.css';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'rejected', label: 'Rejected' }
];

const FacultyReports = () => {
  const { reports, updateReport } = useInternshipReport();
  const { students } = useStudent();
  const { internships } = useInternships();
  const { companies } = useCompany();
  const { user } = useAuth();
  const [transformedReports, setTransformedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Transform reports to include student and company names
    const transformed = Object.entries(reports).flatMap(([userId, userReports]) => 
      Object.entries(userReports).map(([internshipId, report]) => {
        const student = students.find(s => s.id === parseInt(userId));
        const internship = internships.find(i => i.id === parseInt(internshipId));
        const company = companies.find(c => c.id === internship?.companyId);

        return {
          ...report,
          studentName: student?.name || 'Unknown Student',
          companyName: company?.name || 'Unknown Company',
          internshipTitle: internship?.position || 'Unknown Internship',
          studentId: parseInt(userId),
          internshipId: parseInt(internshipId)
        };
      })
    );

    setTransformedReports(transformed);
  }, [reports, students, internships, companies]);

  const handleStatusChange = (userId, internshipId, newStatus) => {
    const report = reports[userId]?.[internshipId];
    if (!report) return;

    const updatedReport = {
      ...report,
      status: newStatus
    };

    updateReport(userId, internshipId, updatedReport);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setComment(report.adminComment || '');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (selectedReport && (selectedReport.status === 'flagged' || selectedReport.status === 'rejected')) {
      const updatedReport = {
        ...selectedReport,
        adminComment: comment
      };

      updateReport(selectedReport.studentId, selectedReport.internshipId, updatedReport);
      setSelectedReport(null);
      setComment('');
    }
  };

  const handleDownloadReport = (report) => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;

    // Add title
    doc.setFontSize(16);
    doc.text(report.title, margin, y);
    y += lineHeight * 2;

    // Add student and company info
    doc.setFontSize(12);
    doc.text(`Student: ${report.studentName}`, margin, y);
    y += lineHeight;
    doc.text(`Company: ${report.companyName}`, margin, y);
    y += lineHeight;
    doc.text(`Internship: ${report.internshipTitle}`, margin, y);
    y += lineHeight;
    doc.text(`Submission Date: ${new Date(report.submissionDate).toLocaleDateString()}`, margin, y);
    y += lineHeight;
    doc.text(`Status: ${report.status}`, margin, y);
    y += lineHeight * 2;

    // Add introduction
    doc.setFontSize(14);
    doc.text('Introduction', margin, y);
    y += lineHeight;
    doc.setFontSize(12);
    const introLines = doc.splitTextToSize(report.introduction, 170);
    doc.text(introLines, margin, y);
    y += lineHeight * (introLines.length + 1);

    // Check if we need a new page
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    // Add main content
    doc.setFontSize(14);
    doc.text('Main Content', margin, y);
    y += lineHeight;
    doc.setFontSize(12);
    const bodyLines = doc.splitTextToSize(report.body, 170);
    doc.text(bodyLines, margin, y);
    y += lineHeight * (bodyLines.length + 1);

    // Check if we need a new page
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    // Add conclusion
    doc.setFontSize(14);
    doc.text('Conclusion', margin, y);
    y += lineHeight;
    doc.setFontSize(12);
    const conclusionLines = doc.splitTextToSize(report.conclusion, 170);
    doc.text(conclusionLines, margin, y);
    y += lineHeight * (conclusionLines.length + 1);

    // Add faculty comment if exists
    if (report.adminComment) {
      // Check if we need a new page
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.setFontSize(14);
      doc.text('Faculty Comment', margin, y);
      y += lineHeight;
      doc.setFontSize(12);
      const commentLines = doc.splitTextToSize(report.adminComment, 170);
      doc.text(commentLines, margin, y);
    }

    // Save the PDF
    doc.save(`report_${report.studentName}_${report.internshipTitle}.pdf`);
  };

  return (
    <div className="faculty-reports-page">
      <h1>Student Report Submissions</h1>
      <div className="reports-table-wrapper">
        {transformedReports.length > 0 ? (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Internship</th>
                <th>Company</th>
                <th>Submission Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transformedReports.map(report => (
                <tr key={report.id}>
                  <td>{report.studentName}</td>
                  <td>{report.internshipTitle}</td>
                  <td>{report.companyName}</td>
                  <td>{new Date(report.submissionDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${report.status}`}>
                      {statusOptions.find(opt => opt.value === report.status)?.label}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewReport(report)}
                    >
                      View
                    </button>
                    <button
                      className="btn-download"
                      onClick={() => handleDownloadReport(report)}
                    >
                      Download
                    </button>
                    <select
                      value={report.status}
                      onChange={e => handleStatusChange(report.studentId, report.internshipId, e.target.value)}
                      className="status-select"
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-reports">
            <p>No reports found.</p>
          </div>
        )}
      </div>

      {selectedReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Report Details</h2>
              <button className="close-button" onClick={() => setSelectedReport(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="report-details">
                <h3>{selectedReport.title}</h3>
                <div className="report-section">
                  <h4>Introduction</h4>
                  <p>{selectedReport.introduction}</p>
                </div>
                <div className="report-section">
                  <h4>Main Content</h4>
                  <p>{selectedReport.body}</p>
                </div>
                <div className="report-section">
                  <h4>Conclusion</h4>
                  <p>{selectedReport.conclusion}</p>
                </div>
              </div>
              {(selectedReport.status === 'flagged' || selectedReport.status === 'rejected') && (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <div className="form-group">
                    <label htmlFor="comment">Faculty Comment:</label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Enter your comment here..."
                      rows="4"
                      required
                    />
                  </div>
                  <button type="submit" className="submit-button">Submit Comment</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyReports; 