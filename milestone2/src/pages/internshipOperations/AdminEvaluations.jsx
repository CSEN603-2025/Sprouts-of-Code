import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useCompany } from '../../context/CompanyContext';
import { useInternships } from '../../context/InternshipContext';
import { useStudent } from '../../context/StudentContext';
import './AdminDashboard.css';

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
          <div className="evaluations-list">
            {evaluations.length === 0 ? (
              <p style={{textAlign:'center', color:'#888'}}>No evaluations found.</p>
            ) : (
              evaluations.map(ev => {
                const companyName = getCompanyName(ev.companyId);
                const internship = getInternship(ev.internshipId);
                const student = getStudent(ev.studentId);
                return (
                  <div key={ev.id} className="evaluation-item" style={{borderBottom:'1px solid #eee', padding:'1.2rem 0'}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                      <div style={{textAlign:'left'}}>
                        <div style={{fontWeight:700}}><strong>Company:</strong> {companyName}</div>
                        <div style={{fontWeight:700, marginTop:'0.2rem'}}><strong>Student:</strong> {student?.name || 'Unknown'}</div>
                        <div style={{fontWeight:700, marginTop:'0.2rem'}}><strong>Internship:</strong> {internship?.position || 'Unknown'}</div>
                      </div>
                      <button className="btn btn-outline" onClick={() => handleViewAll(ev.id)}>
                        {expanded === ev.id ? 'Hide' : 'View All'}
                      </button>
                    </div>
                    {expanded === ev.id && (
                      <div style={{marginTop:'1rem', background:'#f8f9fa', borderRadius:8, padding:'1rem'}}>
                        <div style={{marginBottom:'0.5rem'}}><strong>Email:</strong> {student?.email}</div>
                        <div style={{marginBottom:'0.5rem'}}><strong>University:</strong> {student?.university}</div>
                        <div style={{marginBottom:'0.5rem'}}><strong>Major:</strong> {student?.major}</div>
                        <div style={{marginBottom:'0.5rem'}}><strong>Graduation Year:</strong> {student?.graduationYear}</div>
                        <div style={{marginBottom:'0.5rem'}}><strong>Internship Start:</strong> {internship?.startDate}</div>
                        <div style={{marginBottom:'0.5rem'}}><strong>Internship End:</strong> {internship?.endDate}</div>
                        <div style={{marginBottom:'0.5rem'}}><strong>Supervisor:</strong> {ev.supervisor}</div>
                        <button className="btn btn-primary" style={{marginTop:'1rem', background:'#e53935', border:'none'}} onClick={() => handleViewEval(ev)}>
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
          <div className="modal-content" style={{maxWidth: 480}}>
            <h2 style={{marginBottom: '1rem'}}>Evaluation Answers</h2>
            <div style={{marginBottom:'1.5rem', textAlign:'center', color:'#444', fontSize:'1rem'}}>
              <span>1 = Poor, 5 = Excellent</span>
            </div>
            {EVAL_QUESTIONS.map((q, qIdx) => (
              <div key={qIdx} style={{marginBottom: '1.2rem'}}>
                <label style={{fontWeight: 500, display:'block', textAlign:'center', marginBottom:'0.5rem'}}>{q}</label>
                <div style={{display:'flex', gap:'1.5rem', justifyContent:'center', marginTop:'0.5rem'}}>
                  {[1,2,3,4,5].map(val => (
                    <label key={val} style={{
                      cursor:'not-allowed',
                      display:'flex',
                      flexDirection:'column',
                      alignItems:'center',
                      opacity: modalEval.answers[qIdx] === val ? 1 : 0.6,
                      fontWeight: modalEval.answers[qIdx] === val ? 700 : 400,
                      color: modalEval.answers[qIdx] === val ? '#1976d2' : '#222',
                      background: modalEval.answers[qIdx] === val ? '#e3f2fd' : 'transparent',
                      borderRadius: '6px',
                      padding: modalEval.answers[qIdx] === val ? '0.2rem 0.6rem' : '0',
                      transition: 'all 0.2s'
                    }}>
                      <input
                        type="radio"
                        name={`q${qIdx}-readonly`}
                        value={val}
                        checked={modalEval.answers[qIdx] === val}
                        readOnly
                        disabled
                        style={{marginBottom: 2}}
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div style={{display:'flex', justifyContent:'flex-end', marginTop:'2rem'}}>
              <button type="button" className="finalize-btn" style={{background:'#888'}} onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvaluations; 