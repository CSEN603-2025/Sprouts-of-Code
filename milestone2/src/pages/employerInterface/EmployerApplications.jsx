import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInternships } from '../../context/InternshipContext';
import { useStudent } from '../../context/StudentContext';
import { useCompany } from '../../context/CompanyContext'
import './EmployerApplications.css';

const EmployerApplications = () => {
  const { user } = useAuth();
  const { internships } = useInternships();
  const { students } = useStudent();
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
                      <p><strong>Status:</strong> <span className={`status ${application.status}`}>{application.status}</span></p>
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