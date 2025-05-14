import { useState, useEffect } from 'react';
import { useInternshipReport } from '../../context/InternshipReportContext';
import { useStudent } from '../../context/StudentContext';
import { useInternships } from '../../context/InternshipContext';
import { useCompany } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import { jsPDF } from 'jspdf';
import './SubmittedReports.css';

const SubmittedReports = () => {
  const { reports, updateReport } = useInternshipReport();
  const { students } = useStudent();
  const { internships } = useInternships();
  const { companies } = useCompany();
  const { user } = useAuth();

  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    student: '',
    company: '',
    major: 'all'
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [comment, setComment] = useState('');

  // Get unique majors from students
  const uniqueMajors = ['all', ...new Set(students.map(student => student.major))];

  useEffect(() => {
    // Transform reports to include student and company names
    const transformedReports = Object.entries(reports).flatMap(([userId, userReports]) => 
      Object.entries(userReports).map(([internshipId, report]) => {
        const student = students.find(s => s.id === parseInt(userId));
        const internship = internships.find(i => i.id === parseInt(internshipId));
        const company = companies.find(c => c.id === internship?.companyId);

        return {
          ...report,
          studentName: student?.name || 'Unknown Student',
          companyName: company?.name || 'Unknown Company',
          internshipTitle: internship?.position || 'Unknown Internship',
          major: student?.major || 'Unknown Major'
        };
      })
    );

    // Apply filters
    let filtered = transformedReports;
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }
    if (filters.student) {
      filtered = filtered.filter(report => 
        report.studentName.toLowerCase().includes(filters.student.toLowerCase())
      );
    }
    if (filters.company) {
      filtered = filtered.filter(report => 
        report.companyName.toLowerCase().includes(filters.company.toLowerCase())
      );
    }
    if (filters.major !== 'all') {
      filtered = filtered.filter(report => report.major === filters.major);
    }

    setFilteredReports(filtered);
  }, [reports, students, internships, companies, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (userId, internshipId, newStatus) => {
    const report = reports[userId]?.[internshipId];
    if (!report) return;

    if (newStatus === 'rejected' || newStatus === 'flagged') {
      setSelectedReport({
        ...report,
        studentId: userId,
        internshipId: internshipId,
        status: newStatus
      });
      setComment('');
      return;
    }

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
      if (!comment.trim()) {
        alert('Please provide a comment for rejected or flagged reports.');
        return;
      }

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

    // Add admin comment if exists
    if (report.adminComment) {
      // Check if we need a new page
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      doc.setFontSize(14);
      doc.text('Admin Comment', margin, y);
      y += lineHeight;
      doc.setFontSize(12);
      const commentLines = doc.splitTextToSize(report.adminComment, 170);
      doc.text(commentLines, margin, y);
    }

    // Save the PDF
    doc.save(`report_${report.studentName}_${report.internshipTitle}.pdf`);
  };

  return (
    <div className="submitted-reports-page">
      <div className="page-header">
        <h1>Submitted Reports</h1>
      </div>

      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="student">Student Name:</label>
            <input
              type="text"
              id="student"
              name="student"
              value={filters.student}
              onChange={handleFilterChange}
              placeholder="Search by student name"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="company">Company:</label>
            <input
              type="text"
              id="company"
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              placeholder="Search by company name"
            />
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="major">Major:</label>
            <select
              id="major"
              name="major"
              value={filters.major}
              onChange={handleFilterChange}
            >
              {uniqueMajors.map(major => (
                <option key={major} value={major}>
                  {major === 'all' ? 'All Majors' : major}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="reports-section">
        <div className="section-header">
          <h2>Reports List</h2>
        </div>

        <div className="reports-table-wrapper">
          {filteredReports.length > 0 ? (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Major</th>
                  <th>Company</th>
                  <th>Internship</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report.id}>
                    <td>{report.studentName}</td>
                    <td>{report.major}</td>
                    <td>{report.companyName}</td>
                    <td>{report.internshipTitle}</td>
                    <td>{new Date(report.submissionDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${report.status}`}>
                        {report.status}
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
                    <label htmlFor="comment">
                      {selectedReport.status === 'rejected' ? 'Rejection' : 'Flag'} Comment (Required):
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Enter a comment explaining why this report is being rejected or flagged..."
                      rows="4"
                      required
                    />
                  </div>
                  <button type="submit" className="submit-button">
                    Submit Comment
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedReports; 