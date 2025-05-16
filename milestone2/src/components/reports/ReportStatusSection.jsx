import { useState, useEffect } from 'react';
import { useInternshipReport } from '../../context/InternshipReportContext';
import './ReportStatusSection.css';

const ReportStatusSection = () => {
  const { reports } = useInternshipReport();
  const [reportStatus, setReportStatus] = useState({
    accepted: 0,
    rejected: 0,
    flagged: 0
  });

  useEffect(() => {
    // Calculate report status counts
    const statusCounts = {
      accepted: 0,
      rejected: 0,
      flagged: 0
    };

    // Iterate through all reports
    Object.values(reports).forEach(userReports => {
      Object.values(userReports).forEach(report => {
        switch (report.status) {
          case 'accepted':
            statusCounts.accepted++;
            break;
          case 'rejected':
            statusCounts.rejected++;
            break;
          case 'flagged':
            statusCounts.flagged++;
            break;
          default:
            break;
        }
      });
    });

    setReportStatus(statusCounts);
  }, [reports]);

  return (
    <div className="stats-section">
      <h2>Report Status per Cycle</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Accepted Reports</h3>
          <div className="stat-number">{reportStatus.accepted}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <h3>Rejected Reports</h3>
          <div className="stat-number">{reportStatus.rejected}</div>
          <div className="stat-label">Not Approved</div>
        </div>
        <div className="stat-card">
          <h3>Flagged Reports</h3>
          <div className="stat-number">{reportStatus.flagged}</div>
          <div className="stat-label">Under Review</div>
        </div>
      </div>
    </div>
  );
};

export default ReportStatusSection; 