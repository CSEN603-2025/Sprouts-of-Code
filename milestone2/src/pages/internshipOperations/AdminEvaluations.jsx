import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useCompany } from '../../context/CompanyContext';
import { useInternships } from '../../context/InternshipContext';
import { useStudent } from '../../context/StudentContext';
import './AdminEvaluations.css';

const EVAL_QUESTIONS = [
  'Technical Skills',
  'Communication',
  'Teamwork',
  'Problem Solving',
  'Punctuality'
];

const AdminEvaluations = () => {
  const { evaluations } = useEvaluation();
  const { companies } = useCompany();
  const { internships } = useInternships();
  const { students } = useStudent();
  const [expanded, setExpanded] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEval, setModalEval] = useState(null);
  const [search, setSearch] = useState('');

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
            {evaluations.filter(ev => {
              const companyName = getCompanyName(ev.companyId).toLowerCase();
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
              evaluations
                .filter(ev => {
                  const companyName = getCompanyName(ev.companyId).toLowerCase();
                  const student = getStudent(ev.studentId);
                  const studentName = (student?.name || '').toLowerCase();
                  const term = search.toLowerCase();
                  return (
                    companyName.includes(term) ||
                    studentName.includes(term)
                  );
                })
                .map(ev => {
                  const companyName = getCompanyName(ev.companyId);
                  const internship = getInternship(ev.internshipId);
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
                          <div><strong>Supervisor:</strong> {ev.supervisor}</div>
                          <button className="custom-view-eval-btn" onClick={() => handleViewEval(ev)}>
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
            <h2>Evaluation Answers</h2>
            <div className="evaluation-answers">
              <span>1 = Poor, 5 = Excellent</span>
            </div>
            {EVAL_QUESTIONS.map((q, qIdx) => (
              <div key={qIdx} className="evaluation-question">
                <label>{q}</label>
                <div className="radio-group">
                  {[1,2,3,4,5].map(val => (
                    <label key={val} className={modalEval.answers[qIdx] === val ? 'selected' : ''}>
                      <input
                        type="radio"
                        name={`q${qIdx}-readonly`}
                        value={val}
                        checked={modalEval.answers[qIdx] === val}
                        readOnly
                        disabled
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            ))}
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