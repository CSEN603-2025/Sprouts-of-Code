// src/pages/studentOnboarding/MyApplications.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInternships } from '../../context/InternshipContext';
import { useStudent } from '../../context/StudentContext';
import { useCompany } from '../../context/CompanyContext';
import { useInternshipReport } from '../../context/InternshipReportContext';
import EvaluationForm from '../../components/internship/EvaluationForm';
import ReportForm from '../../components/internship/ReportForm';
import FilterBar from '../../components/shared/FilterBar';

import './MyApplications.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const { user } = useAuth();
  const { internships } = useInternships();
  const { students } = useStudent();
  const { companies } = useCompany();
  const { getEvaluation, getReport } = useInternshipReport();
  
  // Get the logged-in student using their email
  const loggedInStudent = students?.find(student => student.email === user?.email);

  // Transform the student's applications into the format we need
  const [applications, setApplications] = useState([]);
  const [expandedApplications, setExpandedApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showEvaluation, setShowEvaluation] = useState(null);
  const [showReport, setShowReport] = useState(null);

  useEffect(() => {
    if (loggedInStudent?.appliedInternships) {
      const transformedApplications = loggedInStudent.appliedInternships.map(app => {
        const internship = internships?.find(i => i.id === app.internshipId);
        const company = companies?.find(c => c.id === internship?.companyId);
        
        return {
          id: internship?.id,
          company: company?.name || 'Unknown Company',
          position: internship?.position || 'Unknown Position',
          status: app.status,
          date: internship?.startDate || 'No date',
          description: internship?.description || 'No description available',
          requirements: internship?.requirements?.join(', ') || 'No requirements listed',
          location: internship?.location || 'Location not specified',
          duration: internship?.duration || 'Duration not specified',
          salary: internship?.salary || 'Salary not specified',
          type: internship?.isRemote ? 'Remote' : 'On-site',
          startDate: internship?.startDate || 'Start date not specified'
        };
      }).filter(Boolean); // Filter out any null values

      setApplications(transformedApplications);
    }
  }, [loggedInStudent, internships, companies]);

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'undergoing', label: 'Accepted' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];
  const [expandedCompleted, setExpandedCompleted] = useState([]);

  // Get completed internships
  const completedInternships = applications.filter(app => app.status === 'completed');

  const toggleCompletedExpand = (id) => {
    setExpandedCompleted(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = (app.company?.toLowerCase() || '').includes(search.toLowerCase()) ||
                         (app.position?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = filter === 'all' || app.status === filter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id) => {
    setExpandedApplications(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  return (
    <div className="my-applications">
      <div className="page-header">
        <h1>My Applications</h1>
        <FilterBar
          searchPlaceholder="Search by company or position..."
          searchValue={search}
          onSearchChange={setSearch}
          filterOptions={filterOptions}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="applications-container">
        {filteredApplications.length > 0 ? (
          <div className="applications-list">
            {filteredApplications.map(app => (
              <div key={app.id} className="application-card">
                <div className="application-summary">
                  <span className="application-position">{app.position}</span>
                  <span className="application-company">{app.company}</span>
                  <span className={`status-badge ${app.status}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  <button 
                    className="view-more-btn" 
                    onClick={() => toggleExpand(app.id)}
                  >
                    {expandedApplications.includes(app.id) ? 'Hide Details' : 'View More'}
                  </button>
                </div>
                {expandedApplications.includes(app.id) && (
                  <>
                    <div className="application-details">
                      <div><strong>Location:</strong> {app.location}</div>
                      <div><strong>Duration:</strong> {app.duration}</div>
                      <div><strong>Type:</strong> {app.type}</div>
                      <div><strong>Start Date:</strong> {app.startDate}</div>
                      <div><strong>Salary:</strong> {app.salary}</div>
                      <div><strong>Requirements:</strong> {app.requirements}</div>
                      <div><strong>Description:</strong> {app.description}</div>
                    </div>
                    {(app.status === 'completed' || app.status === 'finalized') && (
                      <div className="action-buttons">
                        <button 
                          className="action-btn evaluation-btn"
                          onClick={() => setShowEvaluation(app.id)}
                        >
                          <i className="fas fa-star"></i>
                          {getEvaluation(user?.id, app.id) ? 'View/Edit Evaluation' : 'Create Evaluation'}
                        </button>
                        <button 
                          className="action-btn report-btn"
                          onClick={() => setShowReport(app.id)}
                        >
                          <i className="fas fa-file-alt"></i>
                          {getReport(user?.id, app.id) ? 'View/Edit Report' : 'Create Report'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No applications found matching your filters.</p>
        )}
      </div>

      {/* Evaluation Modal */}
      {showEvaluation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EvaluationForm
              internshipId={showEvaluation}
              onClose={() => setShowEvaluation(null)}
            />
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ReportForm
              internshipId={showReport}
              onClose={() => setShowReport(null)}
            />
          </div>
        </div>
      )}
      
      {/* Completed Internships Section
      {completedInternships.length > 0 && (
        <div className="completed-internships-section">
          <h2>Completed Internships</h2>
          <div className="completed-internships-list">
            {completedInternships.map(intern => (
              <div key={intern.id} className="completed-internship-card">
                <div className="completed-summary">
                  <span className="completed-position">{intern.position}</span>
                  <span className="completed-company">{intern.company}</span>
                  <button 
                    className="view-more-btn" 
                    onClick={() => toggleCompletedExpand(intern.id)}
                  >
                    {expandedCompleted.includes(intern.id) ? 'Hide Details' : 'View More'}
                  </button>
                </div>
                {expandedCompleted.includes(intern.id) && (
                  <>
                    <div className="completed-details">
                      <div><strong>Location:</strong> {intern.location}</div>
                      <div><strong>Duration:</strong> {intern.duration}</div>
                      <div><strong>Type:</strong> {intern.type}</div>
                      <div><strong>Start Date:</strong> {intern.startDate}</div>
                      <div><strong>Salary:</strong> {intern.salary}</div>
                      <div><strong>Requirements:</strong> {intern.requirements}</div>
                      <div><strong>Description:</strong> {intern.description}</div>
                    </div>
                    <div className="action-buttons">
                      <button 
                        className="action-btn evaluation-btn"
                        onClick={() => setShowEvaluation(intern.id)}
                      >
                        <i className="fas fa-star"></i>
                        {getEvaluation(user?.id, intern.id) ? 'View/Edit Evaluation' : 'Create Evaluation'}
                      </button>
                      <button 
                        className="action-btn report-btn"
                        onClick={() => setShowReport(intern.id)}
                      >
                        <i className="fas fa-file-alt"></i>
                        {getReport(user?.id, intern.id) ? 'View/Edit Report' : 'Create Report'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Evaluation Modal */}
      {showEvaluation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EvaluationForm
              internshipId={showEvaluation}
              onClose={() => setShowEvaluation(null)}
            />
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ReportForm
              internshipId={showReport}
              onClose={() => setShowReport(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;