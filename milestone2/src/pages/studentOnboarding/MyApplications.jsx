// src/pages/studentOnboarding/MyApplications.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInternships } from '../../context/InternshipContext';
import { useStudent } from '../../context/StudentContext';
import { useCompany } from '../../context/CompanyContext';
import { useInternshipReport } from '../../context/InternshipReportContext';
import EvaluationForm from '../../components/internship/EvaluationForm';
import ReportForm from '../../components/internship/ReportForm';
import './MyApplications.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCompleted, setExpandedCompleted] = useState([]);
  const [showEvaluation, setShowEvaluation] = useState(null);
  const [showReport, setShowReport] = useState(null);

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = (app.company?.toLowerCase() || '').includes(search.toLowerCase()) ||
                         (app.position?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group applications by status
  const groupedApplications = {
    pending: filteredApplications.filter(app => app.status === 'applied'),
    accepted: filteredApplications.filter(app => app.status === 'undergoing'),
    rejected: filteredApplications.filter(app => app.status === 'rejected')
  };

  // Completed internships for this user (including both finalized and completed status)
  const completedInternships = applications.filter(app => 
    app.status === 'completed' || app.status === 'finalized'
  );

  const toggleCompletedExpand = (id) => {
    setExpandedCompleted(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  return (
    <div className="my-applications">
      <div className="page-header">
        <h1>My Applications</h1>
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by company or position..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="status-filters">
            <button 
              className={`status-filter ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button 
              className={`status-filter ${statusFilter === 'applied' ? 'active' : ''}`}
              onClick={() => setStatusFilter('applied')}
            >
              Pending
            </button>
            <button 
              className={`status-filter ${statusFilter === 'undergoing' ? 'active' : ''}`}
              onClick={() => setStatusFilter('undergoing')}
            >
              Finalized
            </button>
            <button 
              className={`status-filter ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Accepted
            </button>
            <button 
              className={`status-filter ${statusFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      <div className="applications-container">
        {/* Only show groups that have applications after filtering */}
        {groupedApplications.pending.length > 0 && (
          <div className="application-group">
            <h2 className="group-title pending">
              Pending Applications ({groupedApplications.pending.length})
            </h2>
            <div className="applications-grid">
              {groupedApplications.pending.map(app => (
                <div key={app.id} className="application-card pending">
                  <div className="card-header">
                    <div className="header-main">
                      <h3>{app.position}</h3>
                      <div className="status-badge pending">Pending</div>
                    </div>
                    <div className="header-details">
                      <div className="company-info">
                        <i className="fas fa-building"></i>
                        <p className="company">{app.company}</p>
                      </div>
                      <div className="date-info">
                        <i className="fas fa-calendar"></i>
                        <p className="date">Applied: {app.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-section">
                      <h4>Job Details</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Location</span>
                          <span className="value">{app.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Duration</span>
                          <span className="value">{app.duration}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type</span>
                          <span className="value">{app.type}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Start Date</span>
                          <span className="value">{app.startDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Requirements</h4>
                      <p className="requirements">{app.requirements}</p>
                    </div>

                    <div className="info-section">
                      <h4>Description</h4>
                      <p className="description">{app.description}</p>
                    </div>

                    <div className="card-footer">
                      <span className="salary">{app.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {groupedApplications.accepted.length > 0 && (
          <div className="application-group">
            <h2 className="group-title accepted">
              Accepted Applications ({groupedApplications.accepted.length})
            </h2>
            <div className="applications-grid">
              {groupedApplications.accepted.map(app => (
                <div key={app.id} className="application-card accepted">
                  <div className="card-header">
                    <div className="header-main">
                      <h3>{app.position}</h3>
                      <div className="status-badge accepted">Accepted</div>
                    </div>
                    <div className="header-details">
                      <div className="company-info">
                        <i className="fas fa-building"></i>
                        <p className="company">{app.company}</p>
                      </div>
                      <div className="date-info">
                        <i className="fas fa-calendar"></i>
                        <p className="date">Applied: {app.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-section">
                      <h4>Job Details</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Location</span>
                          <span className="value">{app.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Duration</span>
                          <span className="value">{app.duration}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type</span>
                          <span className="value">{app.type}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Start Date</span>
                          <span className="value">{app.startDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Requirements</h4>
                      <p className="requirements">{app.requirements}</p>
                    </div>

                    <div className="info-section">
                      <h4>Description</h4>
                      <p className="description">{app.description}</p>
                    </div>

                    <div className="card-footer">
                      <span className="salary">{app.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {groupedApplications.rejected.length > 0 && (
          <div className="application-group">
            <h2 className="group-title rejected">
              Rejected Applications ({groupedApplications.rejected.length})
            </h2>
            <div className="applications-grid">
              {groupedApplications.rejected.map(app => (
                <div key={app.id} className="application-card rejected">
                  <div className="card-header">
                    <div className="header-main">
                      <h3>{app.position}</h3>
                      <div className="status-badge rejected">Rejected</div>
                    </div>
                    <div className="header-details">
                      <div className="company-info">
                        <i className="fas fa-building"></i>
                        <p className="company">{app.company}</p>
                      </div>
                      <div className="date-info">
                        <i className="fas fa-calendar"></i>
                        <p className="date">Applied: {app.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="info-section">
                      <h4>Job Details</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Location</span>
                          <span className="value">{app.location}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Duration</span>
                          <span className="value">{app.duration}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type</span>
                          <span className="value">{app.type}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Start Date</span>
                          <span className="value">{app.startDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>Requirements</h4>
                      <p className="requirements">{app.requirements}</p>
                    </div>

                    <div className="info-section">
                      <h4>Description</h4>
                      <p className="description">{app.description}</p>
                    </div>

                    <div className="card-footer">
                      <span className="salary">{app.salary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Completed Internships Section */}
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
      )}

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