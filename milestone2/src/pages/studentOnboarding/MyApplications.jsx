// src/pages/studentOnboarding/MyApplications.jsx

import { useState, useEffect } from 'react';
import { dummyStudents, dummyInternships, dummyCompanies } from '../../data/dummyData';
import { useAuth } from '../../context/AuthContext';
import './MyApplications.css';

const MyApplications = () => {
  const { user } = useAuth();
  
  // Get the logged-in student using their email
  const loggedInStudent = dummyStudents.find(student => student.email === user.email);

  // Transform the student's applications into the format we need
  const [applications] = useState(() => {
    return loggedInStudent.appliedInternships.map(app => {
      const internship = dummyInternships.find(i => i.id === app.internshipId);
      const company = dummyCompanies.find(c => c.id === internship.companyId);
      
      return {
        id: internship.id,
        company: company.name,
        position: internship.position,
        status: app.status,
        date: internship.startDate, // Using start date as application date for demo
        description: internship.description,
        requirements: internship.requirements.join(', '),
        location: internship.location,
        duration: internship.duration,
        salary: internship.salary,
        type: internship.isRemote ? 'Remote' : 'On-site',
        startDate: internship.startDate
      };
    });
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCompleted, setExpandedCompleted] = useState([]);

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(search.toLowerCase()) ||
                         app.position.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group applications by status
  const groupedApplications = {
    pending: filteredApplications.filter(app => app.status === 'applied'),
    finalized: filteredApplications.filter(app => app.status === 'undergoing'),
    accepted: filteredApplications.filter(app => app.status === 'completed'),
    rejected: filteredApplications.filter(app => app.status === 'rejected')
  };

   // Completed internships for this user
   const completedInternships = applications.filter(app => app.status === 'completed');

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
        

        {groupedApplications.finalized.length > 0 && (
          <div className="application-group">
            <h2 className="group-title finalized">
              Finalized Applications ({groupedApplications.finalized.length})
            </h2>
            <div className="applications-grid">
              {groupedApplications.finalized.map(app => (
                <div key={app.id} className="application-card finalized">
                  <div className="card-header">
                    <div className="header-main">
                      <h3>{app.position}</h3>
                      <div className="status-badge finalized">Finalized</div>
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
      
      {/* Completed Internships Section at the end of the page */}
      {completedInternships.length > 0 && (
        <div className="completed-internships-section">
          <h2>Completed Internships</h2>
          <div className="completed-internships-list">
            {completedInternships.map(intern => (
              <div key={intern.id} className="completed-internship-card">
                <div className="completed-summary">
                  <span className="completed-position">{intern.position}</span>
                  <span className="completed-company">{intern.company}</span>
                  <button className="view-more-btn" onClick={() => toggleCompletedExpand(intern.id)}>
                    {expandedCompleted.includes(intern.id) ? 'Hide Details' : 'View More'}
                  </button>
                </div>
                {expandedCompleted.includes(intern.id) && (
                  <div className="completed-details">
                    <div><strong>Location:</strong> {intern.location}</div>
                    <div><strong>Duration:</strong> {intern.duration}</div>
                    <div><strong>Type:</strong> {intern.type}</div>
                    <div><strong>Start Date:</strong> {intern.startDate}</div>
                    <div><strong>Salary:</strong> {intern.salary}</div>
                    <div><strong>Requirements:</strong> {intern.requirements}</div>
                    <div><strong>Description:</strong> {intern.description}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* <div className="card">
          <div className="card-header">
            <h2 className="card-title">Completed Internships</h2>
          </div>
          <div className="applications-list">
            {completedInternships.length > 0 ? (
              completedInternships.map(internship => (
                <div key={internship.id} className="application-item">
                  <div className="application-info">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' , width: '100%'}}>
                      <h3 style={{ margin: 0 }}>{internship.position}</h3>
                      <span className="status-badge completed">Completed</span>
                    </div>
                    <p className="company">{getCompanyName(internship.companyId)}</p>
                    <p className="date">Duration: {internship.duration}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="application-item">
                <p>No completed internships.</p>
              </div>
            )}
          </div>
        </div> */}
    </div>
    
  );
};

export default MyApplications;