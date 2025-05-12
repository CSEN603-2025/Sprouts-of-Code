import React, { useState } from 'react';
import './FacultyReports.css';

// Dummy data for student report submissions
const initialReports = [
  {
    id: 2,
    studentName: 'Omar Khaled',
    internshipTitle: 'Data Analyst Intern',
    company: 'Fawry',
    submissionDate: '2024-06-03',
    status: 'accepted',
    fileUrl: '#',
  },
  {
    id: 3,
    studentName: 'Mona Samir',
    internshipTitle: 'Marketing Intern',
    company: 'Orange Egypt',
    submissionDate: '2024-06-02',
    status: 'flagged',
    fileUrl: '#',
  },
  {
    id: 4,
    studentName: 'Youssef Adel',
    internshipTitle: 'QA Tester',
    company: 'Instabug',
    submissionDate: '2024-06-04',
    status: 'rejected',
    fileUrl: '#',
  },
];

const statusOptions = [
  { value: 'accepted', label: 'Accepted' },
  { value: 'flagged', label: 'Flagged' },
  { value: 'rejected', label: 'Rejected' },
];

const FacultyReports = () => {
  const [reports, setReports] = useState(initialReports);

  const handleStatusChange = (id, newStatus) => {
    setReports(reports =>
      reports.map(report =>
        report.id === id ? { ...report, status: newStatus } : report
      )
    );
  };

  return (
    <div className="faculty-reports-page">
      <h1>Student Report Submissions</h1>
      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Internship</th>
              <th>Company</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.studentName}</td>
                <td>{report.internshipTitle}</td>
                <td>{report.company}</td>
                <td>{report.submissionDate}</td>
                <td>
                  <span className={`status-badge ${report.status}`}>
                    {statusOptions.find(opt => opt.value === report.status)?.label}
                  </span>
                </td>
                <td>
                  <select
                    value={report.status}
                    onChange={e => handleStatusChange(report.id, e.target.value)}
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
      </div>
    </div>
  );
};

export default FacultyReports; 