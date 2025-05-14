import React, { useState, useEffect } from 'react';
import { useInternshipReport } from '../../context/InternshipReportContext';
import { useCompany } from '../../context/CompanyContext';
import { useInternships } from '../../context/InternshipContext';
import { useStudent } from '../../context/StudentContext';
import './AdminEvaluations.css';

const AdminEvaluations = () => {
  const { evaluations } = useInternshipReport();
  const { companies } = useCompany();
  const { internships } = useInternships();
  const { students } = useStudent();
  const [expanded, setExpanded] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEval, setModalEval] = useState(null);
  const [search, setSearch] = useState('');
  const [transformedEvaluations, setTransformedEvaluations] = useState([]);

  useEffect(() => {
    // Transform evaluations from the nested structure to a flat array
    const transformed = Object.entries(evaluations).flatMap(([userId, userEvaluations]) => 
      Object.entries(userEvaluations).map(([internshipId, evaluation]) => ({
        ...evaluation,
        studentId: parseInt(userId),
        internshipId: parseInt(internshipId)
      }))
    );
    setTransformedEvaluations(transformed);
  }, [evaluations]);

  const getCompanyName = (companyId) => companies.find(c => c.id === companyId)?.name || 'Unknown Company';
  const getInternship = (internshipId) => internships.find(i => i.id === internshipId);
  const getStudent = (studentId) => students.find(s => s.id === studentId);

  const handleViewAll = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleViewEval = (evalObj) => {
    setModalEval(evalObj);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalEval(null);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>All Evaluations</h1>
      </div>
      <div className="dashboard-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Evaluations List</h2>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by student or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="evaluations-list">
            {transformedEvaluations.filter(ev => {
              const internship = getInternship(ev.internshipId);
              const companyName = internship ? getCompanyName(internship.companyId).toLowerCase() : '';
              const student = getStudent(ev.studentId);
              const studentName = (student?.name || '').toLowerCase();
              const term = search.toLowerCase();
              return (
                companyName.includes(term) ||
                studentName.includes(term)
              );
            }).length === 0 ? (
              <p style={{textAlign:'center', color:'#888'}}>No evaluations found.</p>
            ) : (
              transformedEvaluations
                .filter(ev => {
                  const internship = getInternship(ev.internshipId);
                  const companyName = internship ? getCompanyName(internship.companyId).toLowerCase() : '';
                  const student = getStudent(ev.studentId);
                  const studentName = (student?.name || '').toLowerCase();
                  const term = search.toLowerCase();
                  return (
                    companyName.includes(term) ||
                    studentName.includes(term)
                  );
                })
                .map(ev => {
                  const internship = getInternship(ev.internshipId);
                  const companyName = internship ? getCompanyName(internship.companyId) : 'Unknown Company';
                  const student = getStudent(ev.studentId);
                  return (
                    <div key={ev.id} className="evaluation-item">
                      <div className="evaluation-item-header">
                        <div className="evaluation-item-info">
                          <div><strong>Company:</strong> {companyName}</div>
                          <div><strong>Student:</strong> {student?.name || 'Unknown'}</div>
                          <div><strong>Internship:</strong> {internship?.position || 'Unknown'}</div>
                        </div>
                        <button className="btn btn-outline" onClick={() => handleViewAll(ev.id)}>
                          {expanded === ev.id ? 'Hide' : 'View All'}
                        </button>
                      </div>
                      {expanded === ev.id && (
                        <div className="evaluation-item-details">
                          <div><strong>Email:</strong> {student?.email}</div>
                          <div><strong>University:</strong> {student?.university}</div>
                          <div><strong>Major:</strong> {student?.major}</div>
                          <div><strong>Graduation Year:</strong> {student?.graduationYear}</div>
                          <div><strong>Internship Start:</strong> {internship?.startDate}</div>
                          <div><strong>Internship End:</strong> {internship?.endDate}</div>
                          <button className="btn btn-primary" onClick={() => handleViewEval(ev)}>
                            View Evaluation
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
      {modalOpen && modalEval && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Evaluation Details</h2>
            <div className="evaluation-details">
              <div className="rating-section">
                <h3>Rating: {modalEval.rating}/5</h3>
              </div>
              <div className="pros-section">
                <h3>Pros:</h3>
                <p>{modalEval.pros}</p>
              </div>
              <div className="cons-section">
                <h3>Cons:</h3>
                <p>{modalEval.cons}</p>
              </div>
              <div className="recommendation-section">
                <h3>Would Recommend: {modalEval.recommendation ? 'Yes' : 'No'}</h3>
              </div>
              {modalEval.comments && (
                <div className="comments-section">
                  <h3>Additional Comments:</h3>
                  <p>{modalEval.comments}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="finalize-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvaluations; 