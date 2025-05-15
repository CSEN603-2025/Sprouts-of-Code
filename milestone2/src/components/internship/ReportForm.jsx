import { useState, useEffect } from 'react';
import { useInternshipReport } from '../../context/InternshipReportContext';
import { useStudent } from '../../context/StudentContext';
import { useAuth } from '../../context/AuthContext';
import { useInternships } from '../../context/InternshipContext';
import { useCompany } from '../../context/CompanyContext';
import './ReportForm.css';
import { jsPDF } from 'jspdf';

const ReportForm = ({ internshipId, onClose }) => {
  const { user } = useAuth();
  const { internships } = useInternships();
  const { companies } = useCompany();
  const { getReport, createReport, updateReport, deleteReport, toggleCourseSelection, getSelectedCourses } = useInternshipReport();
  const { students } = useStudent();
  const [report, setReport] = useState({
    title: '',
    introduction: '',
    body: '',
    conclusion: ''
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const existingReport = getReport(user?.id, internshipId);
    console.log('ReportForm - Existing report:', {
      userId: user?.id,
      internshipId,
      report: existingReport
    });
    if (existingReport) {
      setReport(existingReport);
    } else {
      // Set default title for new reports
      const internship = internships?.find(i => i.id === internshipId);
      const company = companies?.find(c => c.id === internship?.companyId);
      const student = students?.find(s => s.email === user?.email);
      
      const defaultTitle = `${student?.name || ''} – ${internship?.position || 'Internship'} at ${company?.name || 'Company'}`;
      
      setReport(prev => ({
        ...prev,
        title: defaultTitle
      }));
    }

    // For now, we'll use dummy data
    setAvailableCourses([
      { id: 1, code: 'CSEN102', name: 'Introduction to Computer Science' },
      { id: 2, code: 'CSEN301', name: 'Data Structures and Algorithms' },
      { id: 3, code: 'CSEN501', name: 'Database I' },
      { id: 4, code: 'CSEN603', name: 'Database II' },
      { id: 5, code: 'DMET502', name: 'Computer Networks' },
      { id: 6, code: 'CSEN602', name: 'Operating Systems' } ,
      { id: 7, code: 'CSEN601', name: 'Software Engineering' },
      { id: 8, code: 'DMET701', name: 'Computer Graphics' }
    ]);
  }, [internshipId, getReport, user?.id, user?.email, internships, companies, students]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingReport = getReport(user?.id, internshipId);
    const internship = internships?.find(i => i.id === internshipId);
    const company = companies?.find(c => c.id === internship?.companyId);
    
    if (existingReport) {
      updateReport(user?.id, internshipId, report);
    } else {
      createReport(user?.id, internshipId, report);
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 3000);
  };

  const handleDelete = () => {
    deleteReport(user?.id, internshipId);
    onClose();
  };

  const handleDownloadPDF = () => {
    const internship = internships?.find(i => i.id === internshipId);
    const company = companies?.find(c => c.id === internship?.companyId);
    const internshipName = internship?.position || 'Unknown_Internship';
    const companyName = company?.name || 'Unknown_Company';
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 20;
    const lineHeight = 6;
    let cursorY = 20;
  
    doc.setFontSize(18);
    doc.setFont("Helvetica", "bold");
  
    // Centered main title
    const mainTitle = "Internship Report";
    const titleWidth = doc.getTextWidth(mainTitle);
    doc.text(mainTitle, (pageWidth - titleWidth) / 2, cursorY);
    cursorY += 8;
  
    // Centered report title
    doc.setFontSize(14);
    const reportTitle = report.title || "Untitled Report";
    const reportTitleWidth = doc.getTextWidth(reportTitle);
    doc.text(reportTitle, (pageWidth - reportTitleWidth) / 2, cursorY);
    cursorY += 10;
  
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
  
    const addParagraph = (text) => {
      const indent = '    '; // 5 spaces
      const paragraph = indent + (text || 'N/A');
      const lines = doc.splitTextToSize(paragraph, pageWidth - 2 * marginLeft);
      
      if (cursorY + lines.length * lineHeight > 280) {
        doc.addPage();
        cursorY = 20;
      }
  
      doc.text(lines, marginLeft, cursorY);
      cursorY += lines.length * lineHeight + 2;
    };
  
    // Add paragraphs (intro, body, conclusion)
    addParagraph(report.introduction);
    addParagraph(report.body);
    addParagraph(report.conclusion);
  
    // Add courses section
    const selected = availableCourses
      .filter(course => selectedCourses.includes(course.id))
      .map(course => `${course.code} - ${course.name}`)
      .join(', ');
  
    if (cursorY + 30 > 280) {
      doc.addPage();
      cursorY = 20;
    }
  
    doc.setFont("Helvetica", "bold");
    doc.text("Courses That Helped During the Internship", marginLeft, cursorY);
    cursorY += 8;
    doc.setFont("Helvetica", "normal");
  
    const courseLines = doc.splitTextToSize(selected || "N/A", pageWidth - 2 * marginLeft);
    doc.text(courseLines, marginLeft, cursorY);
    cursorY += courseLines.length * lineHeight;
  
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("The German University in Cairo", marginLeft, 290);
  
    // Save the file
    doc.save(`${companyName}_${internshipName}_Report.pdf`);
  };
  

  

  const selectedCourses = getSelectedCourses(user?.id, internshipId);

  return (
    <div className="report-form">
      {showSuccess && (
        <div className="success-notification">
          Your report for {companies?.find(c => c.id === internships?.find(i => i.id === internshipId)?.companyId)?.name || 'the company'} has been successfully submitted
        </div>
      )}
      <h3>Internship Report</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={report.title}
            onChange={(e) => setReport(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter report title"
            required
          />
        </div>

        <div className="form-group">
          <label>Introduction:</label>
          <textarea
            value={report.introduction}
            onChange={(e) => setReport(prev => ({ ...prev, introduction: e.target.value }))}
            placeholder="Write your introduction..."
            required
          />
        </div>

        <div className="form-group">
          <label>Body:</label>
          <textarea
            value={report.body}
            onChange={(e) => setReport(prev => ({ ...prev, body: e.target.value }))}
            placeholder="Write the main content of your report..."
            required
          />
        </div>

        <div className="form-group">
          <label>Conclusion:</label>
          <textarea
            value={report.conclusion}
            onChange={(e) => setReport(prev => ({ ...prev, conclusion: e.target.value }))}
            placeholder="Write your conclusion..."
            required
          />
        </div>

        <div className="course-selection">
          <h4>Select courses that helped during your internship:</h4>
          <div className="course-list">
            {availableCourses.map(course => (
              <label key={course.id} className="course-item">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => toggleCourseSelection(user?.id, internshipId, course.id)}
                />
                {course.code} - {course.name}
              </label>
            ))}
          </div>
        </div>

        {(getReport(user?.id, internshipId)?.status === 'flagged' || getReport(user?.id, internshipId)?.status === 'rejected') && 
         getReport(user?.id, internshipId)?.adminComment && (
          <div className="form-group admin-comment">
            <label>Faculty/Admin Comments</label>
            <div className={`comment-box ${getReport(user?.id, internshipId).status}`}>
              <p>{getReport(user?.id, internshipId).adminComment}</p>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {getReport(user?.id, internshipId) ? 'Update Report' : 'Submit Report'}
          </button>
          {getReport(user?.id, internshipId) && (
            <>
              <button type="button" className="btn-danger" onClick={handleDelete}>
                Delete Report
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
      </form>
    </div>
  );
};

export default ReportForm; 