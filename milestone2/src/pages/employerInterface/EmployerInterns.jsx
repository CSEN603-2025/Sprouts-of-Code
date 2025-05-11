import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInternships } from '../../context/InternshipContext';
import { useStudent } from '../../context/StudentContext';
import { useCompany } from '../../context/CompanyContext';
import { useEvaluation } from '../../context/EvaluationContext';
import './EmployerApplications.css';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'current', label: 'Current Interns' },
  { value: 'completed', label: 'Completed Interns' }
];

const EVAL_QUESTIONS = [
  'Technical Skills',
  'Communication',
  'Teamwork',
  'Problem Solving',
  'Punctuality'
];

const EmployerInterns = () => {
  const { user } = useAuth();
  const { internships, updateInternship } = useInternships();
  const { students, updateStudent } = useStudent();
  const { companies } = useCompany();
  const { evaluations, addEvaluation, updateEvaluation, deleteEvaluation, getEvaluation } = useEvaluation();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [modalEvalId, setModalEvalId] = useState(null);
  const [modalIntern, setModalIntern] = useState(null);
  const [answers, setAnswers] = useState(Array(EVAL_QUESTIONS.length).fill(0));
  const [showIncompleteMsg, setShowIncompleteMsg] = useState(false);
  const [supervisor, setSupervisor] = useState('');
  const [expandedCardId, setExpandedCardId] = useState(null);

  // Get company data
  const company = companies.find(c => c.email === user.email);

  // Get all internships for the current employer
  const companyInternships = company
    ? internships.filter(internship => internship.companyId === company.id)
    : [];

  // Collect all students with 'undergoing' or 'completed' status in any of the company's internships
  const currentInterns = [];
  const completedInterns = [];
  if (company) {
    companyInternships.forEach(internship => {
      if (internship.companyId === company.id && Array.isArray(internship.applicants)) {
        internship.applicants.forEach(applicant => {
          const student = students.find(s => s.id === applicant.studentId);
          if (student) {
            if (applicant.status === 'undergoing') {
              currentInterns.push({
                ...student,
                internshipPosition: internship.position,
                internshipId: internship.id
              });
            } else if (applicant.status === 'completed') {
              completedInterns.push({
                ...student,
                internshipPosition: internship.position,
                internshipId: internship.id
              });
            }
          }
        });
      }
    });
  }

  // Filter by search
  const filterBySearch = intern => {
    const searchLower = search.toLowerCase();
    return (
      intern.name.toLowerCase().includes(searchLower) ||
      intern.internshipPosition.toLowerCase().includes(searchLower)
    );
  };

  // Finalize handler
  const handleFinalize = (studentId, internshipId) => {
    if (window.confirm('Are you sure you want to finalize this intern? This will mark their internship as completed.')) {
      // Update in InternshipContext
      const internship = internships.find(i => i.id === internshipId);
      if (internship) {
        const newApplicants = internship.applicants.map(app =>
          app.studentId === studentId ? { ...app, status: 'completed' } : app
        );
        updateInternship(internshipId, { applicants: newApplicants });
      }
      // Update in StudentContext
      const student = students.find(s => s.id === studentId);
      if (student) {
        const newAppliedInternships = student.appliedInternships.map(app =>
          app.internshipId === internshipId ? { ...app, status: 'completed' } : app
        );
        updateStudent(studentId, { appliedInternships: newAppliedInternships });
      }
    }
  };

  // Evaluation logic
  const openEvalModal = (intern, mode = 'create', evalId = null, existingAnswers = null, existingSupervisor = '') => {
    setModalIntern(intern);
    setModalMode(mode);
    setModalEvalId(evalId);
    setAnswers(existingAnswers || Array(EVAL_QUESTIONS.length).fill(0));
    setSupervisor(existingSupervisor || '');
    setModalOpen(true);
  };

  const closeEvalModal = () => {
    setModalOpen(false);
    setModalIntern(null);
    setModalEvalId(null);
    setAnswers(Array(EVAL_QUESTIONS.length).fill(0));
    setSupervisor('');
  };

  const handleEvalChange = (qIdx, value) => {
    setAnswers(prev => prev.map((a, i) => (i === qIdx ? value : a)));
  };

  const handleEvalSubmit = (e) => {
    e.preventDefault();
    if (!modalIntern) return;
    if (answers.some(a => a === 0) || !supervisor.trim()) {
      setShowIncompleteMsg(true);
      return;
    }
    setShowIncompleteMsg(false);
    const payload = {
      studentId: modalIntern.id,
      internshipId: modalIntern.internshipId,
      companyId: company.id,
      answers: [...answers],
      supervisor: supervisor.trim()
    };
    if (modalMode === 'create') {
      addEvaluation(payload);
    } else if (modalMode === 'edit' && modalEvalId) {
      updateEvaluation(modalEvalId, { answers: [...answers], supervisor: supervisor.trim() });
    }
    closeEvalModal();
  };

  const handleEvalDelete = (evalId) => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      deleteEvaluation(evalId);
    }
  };

  // Hide error message if all questions are answered
  useEffect(() => {
    if (showIncompleteMsg && answers.every(a => a !== 0)) {
      setShowIncompleteMsg(false);
    }
  }, [answers, showIncompleteMsg]);

  const toggleCardExpansion = (internId) => {
    setExpandedCardId(prevId => prevId === internId ? null : internId);
  };

  return (
    <div className="employer-applications">
      <h1>Interns</h1>
      <div className="interns-filter-bar">
        <input
          type="text"
          className="intern-search-bar"
          placeholder="Search by name or job title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="interns-dropdown"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {(filter === 'all' || filter === 'current') && (
        <>
          <h2 style={{ marginTop: 0 }}>Current Interns</h2>
          {currentInterns.filter(filterBySearch).length === 0 ? (
            <p>No current interns with 'undergoing' status.</p>
          ) : (
            <div className="applications-list">
              {currentInterns.filter(filterBySearch).map((intern, idx) => (
                <div key={idx} className="application-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{intern.name}</h3>
                    <button 
                      className="finalize-btn" 
                      style={{ background: '#1976d2', marginRight: '0.5rem' }}
                      onClick={() => toggleCardExpansion(intern.id)}
                    >
                      {expandedCardId === intern.id ? 'Hide Details' : 'View Details'}
                    </button>
                    <button className="finalize-btn" onClick={() => handleFinalize(intern.id, intern.internshipId)}>
                      Finalize
                    </button>
                  </div>
                  {expandedCardId === intern.id && (
                    <div className="student-details">
                      <p><strong>Email:</strong> {intern.email}</p>
                      <p><strong>University:</strong> {intern.university}</p>
                      <p><strong>Major:</strong> {intern.major}</p>
                      <p><strong>Internship Position:</strong> {intern.internshipPosition}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {(filter === 'all' || filter === 'completed') && (
        <>
          <h2 style={{ marginTop: '2rem' }}>Completed Interns</h2>
          {completedInterns.filter(filterBySearch).length === 0 ? (
            <p>No completed interns.</p>
          ) : (
            <div className="applications-list">
              {completedInterns.filter(filterBySearch).map((intern, idx) => {
                const evaluation = getEvaluation(intern.id, intern.internshipId, company.id);
                return (
                  <div key={idx} className="application-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3>{intern.name}</h3>
                      <div>
                        <button 
                          className="finalize-btn" 
                          style={{ background: '#1976d2', marginRight: '0.5rem' }}
                          onClick={() => toggleCardExpansion(intern.id)}
                        >
                          {expandedCardId === intern.id ? 'Hide Details' : 'View Details'}
                        </button>
                        {!evaluation ? (
                          <button className="finalize-btn" style={{background:'#1976d2'}} onClick={() => openEvalModal(intern, 'create')}>
                            Create Evaluation
                          </button>
                        ) : (
                          <>
                            <button className="finalize-btn" style={{background:'#fbc02d', color:'#222'}} onClick={() => openEvalModal(intern, 'edit', evaluation.id, evaluation.answers, evaluation.supervisor)}>
                              View/Edit Evaluation
                            </button>
                            <button className="finalize-btn" style={{background:'#c62828', marginLeft:'0.5rem'}} onClick={() => handleEvalDelete(evaluation.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {expandedCardId === intern.id && (
                      <div className="student-details">
                        <p><strong>Email:</strong> {intern.email}</p>
                        <p><strong>University:</strong> {intern.university}</p>
                        <p><strong>Major:</strong> {intern.major}</p>
                        <p><strong>Internship Position:</strong> {intern.internshipPosition}</p>
                        {evaluation && evaluation.supervisor && (
                          <p><strong>Supervisor:</strong> {evaluation.supervisor}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: 480}}>
            <h2 style={{marginBottom: '1rem'}}>{modalMode === 'create' ? 'Create' : 'Edit'} Evaluation</h2>
            <div style={{textAlign:'center', marginBottom:'1.5rem', color:'#444', fontSize:'1rem'}}>
              <span>1 = Poor, 5 = Excellent</span>
            </div>
            <form onSubmit={handleEvalSubmit}>
              <div style={{marginBottom:'1.5rem', textAlign:'center'}}>
                <label style={{fontWeight:500, marginBottom:8, display:'block'}}>Supervisor Name <span style={{color:'#c62828'}}>*</span></label>
                <input
                  type="text"
                  value={supervisor}
                  onChange={e => setSupervisor(e.target.value)}
                  placeholder="Enter supervisor's name"
                  style={{width:'80%', padding:'0.6rem', borderRadius:4, border:'1px solid #ccc', fontSize:'1rem'}}
                />
              </div>
              {EVAL_QUESTIONS.map((q, qIdx) => (
                <div key={qIdx} style={{marginBottom: '1.2rem'}}>
                  <label style={{
                    fontWeight: 500,
                    display:'block',
                    textAlign:'center',
                    marginBottom:'0.5rem',
                    color: answers[qIdx] === 0 && showIncompleteMsg ? '#c62828' : undefined
                  }}>
                    {q}
                    {answers[qIdx] === 0 && showIncompleteMsg && (
                      <span style={{fontSize:'0.95em', marginLeft:8, color:'#c62828'}}>
                        (Required)
                      </span>
                    )}
                  </label>
                  <div style={{display:'flex', gap:'1.5rem', justifyContent:'center', marginTop:'0.5rem'}}>
                    {[1,2,3,4,5].map(val => (
                      <label key={val} style={{cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <input
                          type="radio"
                          name={`q${qIdx}`}
                          value={val}
                          checked={answers[qIdx] === val}
                          onChange={() => handleEvalChange(qIdx, val)}
                          style={{marginBottom: 2}}
                        />
                        {val}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{display:'flex', justifyContent:'flex-end', gap:'1rem', marginTop:'2rem'}}>
                <button type="button" className="finalize-btn" style={{background:'#888'}} onClick={closeEvalModal}>Cancel</button>
                <button type="submit" className="finalize-btn" style={{background:'#1976d2'}}>
                  Save
                </button>
              </div>
              {showIncompleteMsg && (
                <div style={{color:'#c62828', textAlign:'center', marginTop:'1rem', fontWeight:500}}>
                  Please answer all questions and enter the supervisor's name before saving.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerInterns; 