import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInternships } from '../../context/InternshipContext';
import { useStudent } from '../../context/StudentContext';
import { useCompany } from '../../context/CompanyContext'
import './EmployerApplications.css';

const statusOptions = [
  { value: 'completed', label: 'Finalized' },
  { value: 'undergoing', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' }
];

const EmployerApplications = () => {
  const { user } = useAuth();
  const { internships, updateInternship } = useInternships();
  const { students, updateStudent } = useStudent();
  const { companies } = useCompany();
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Get company data
  const company = companies.find(c => c.email === user.email);

  // Get all internships for the current employer
  const companyInternships = internships.filter(
    internship => internship.companyId === company.id
  );

  //console.log(companyInternships.filter(internship => internship.applicants.filter(applicant => applicant.status === "applied")));

  // Get all applications for the selected internship
  const getApplicationsForInternship = (internshipId) => {
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return [];

    return internship.applicants
      .filter(applicant => applicant.status === "applied")
      .map(applicant => {
        const student = students.find(s => s.id === applicant.studentId);
        return {
          ...applicant,
          studentName: student?.name,
          studentEmail: student?.email,
          studentUniversity: student?.university,
          studentMajor: student?.major,
          graduationYear: student?.graduationYear
        };
      });
  };

  // Handle status change
  const handleStatusChange = (studentId, internshipId, newStatus) => {
    const internship = internships.find(i => i.id === internshipId);
    if (internship) {
      const newApplicants = internship.applicants.map(app =>
        app.studentId === studentId ? { ...app, status: newStatus } : app
      );
      updateInternship(internshipId, { applicants: newApplicants });
    }
    // Update in StudentContext
    const student = students.find(s => s.id === studentId);
    if (student) {
      const newAppliedInternships = student.appliedInternships.map(app =>
        app.internshipId === internshipId ? { ...app, status: newStatus } : app
      );
      updateStudent(studentId, { appliedInternships: newAppliedInternships });
    }
    //console.log(internships[0].applicants);
  };

  const undergoingInterns = [];
  if (company) {
    companyInternships.forEach(internship => {
      if (internship.companyId === company.id && Array.isArray(internship.applicants)) {
        internship.applicants.forEach(applicant => {
          if (applicant.status === 'undergoing') {
            const student = students.find(s => s.id === applicant.studentId);
            if (student) {
              undergoingInterns.push({
                ...student,
                internshipPosition: internship.position
              });
            }
          }
        });
      }
    });
  }

  return (
    <div className="employer-applications">
      <h1>Student Applications</h1>
      
      <div className="internships-grid">
        {companyInternships.map(internship => (
          <div key={internship.id} className="internship-card">
            <h2>{internship.position}</h2>
            <p className="applicant-count">
              {internship.applicants.filter(applicant => applicant.status === "applied").length} {internship.applicants.filter(applicant => applicant.status === "applied").length === 1 ? 'applicant' : 'applicants'}
            </p>
            
            {getApplicationsForInternship(internship.id).length === 0 ? (
              <p className="no-applications">No applications yet</p>
            ) : (
              <div className="applications-list">
                {getApplicationsForInternship(internship.id).map((application, index) => (
                  <div key={index} className="application-card">
                    <h3>{application.studentName}</h3>
                    <div className="student-details">
                      <p><strong>Email:</strong> {application.studentEmail}</p>
                      <p><strong>University:</strong> {application.studentUniversity}</p>
                      <p><strong>Major:</strong> {application.studentMajor}</p>
                      <p><strong>Graduation Year:</strong> {application.graduationYear}</p>
                      <div style={{ marginTop: '0.5rem' }}>
                        <label htmlFor={`status-select-${internship.id}-${application.studentName}`}>Change Status: </label>
                        <select
                          id={`status-select-${internship.id}-${application.studentName}`}
                          onChange={e => handleStatusChange(
                            parseInt(application.studentId),
                            internship.id,
                            e.target.value
                          )}
                          defaultValue=""
                        >
                          <option value="" disabled>Select status</option>
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerApplications; 