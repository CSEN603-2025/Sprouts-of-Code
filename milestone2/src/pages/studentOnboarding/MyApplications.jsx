// src/pages/studentOnboarding/MyApplications.jsx

import { useState } from 'react';
import './MyApplications.css';

const MyApplications = () => {
  // Dummy data for applications with more examples
  const [applications] = useState([
    {
      id: 1,
      company: 'TechCorp',
      position: 'Frontend Developer',
      status: 'pending',
      date: '2023-05-15',
      description: 'Developing user interfaces using React and Redux',
      requirements: 'React, JavaScript, HTML/CSS',
      location: 'Cairo, Egypt',
      duration: '3 months',
      salary: 'Paid',
      type: 'Full-time',
      startDate: '2023-06-01'
    },
    {
      id: 2,
      company: 'TechNova',
      position: 'Backend Developer',
      status: 'pending',
      date: '2023-05-12',
      description: 'Building scalable backend services using Node.js',
      requirements: 'Node.js, Express, MongoDB',
      location: 'Remote',
      duration: '6 months',
      salary: 'Paid',
      type: 'Part-time',
      startDate: '2023-06-15'
    },
    {
      id: 3,
      company: 'DataSystems',
      position: 'Data Analyst',
      status: 'approved',
      date: '2023-05-10',
      description: 'Analyzing data and creating reports',
      requirements: 'Python, SQL, Data Analysis',
      location: 'Remote',
      duration: '6 months',
      salary: 'Paid',
      type: 'Full-time',
      startDate: '2023-06-01'
    },
    {
      id: 4,
      company: 'DataFlow',
      position: 'Data Engineer',
      status: 'approved',
      date: '2023-05-08',
      description: 'Building data pipelines and ETL processes',
      requirements: 'Python, Apache Spark, AWS',
      location: 'Alexandria, Egypt',
      duration: '4 months',
      salary: 'Paid',
      type: 'Full-time',
      startDate: '2023-06-01'
    },
    {
      id: 5,
      company: 'InnovateTech',
      position: 'Mobile Developer',
      status: 'rejected',
      date: '2023-05-05',
      description: 'Developing mobile applications using React Native',
      requirements: 'React Native, JavaScript, Mobile Development',
      location: 'Alexandria, Egypt',
      duration: '4 months',
      salary: 'Unpaid',
      type: 'Part-time',
      startDate: '2023-06-01'
    },
    {
      id: 6,
      company: 'InnovateSoft',
      position: 'UI/UX Designer',
      status: 'rejected',
      date: '2023-05-03',
      description: 'Creating user interfaces and experiences',
      requirements: 'Figma, Adobe XD, UI/UX Design',
      location: 'Cairo, Egypt',
      duration: '3 months',
      salary: 'Unpaid',
      type: 'Part-time',
      startDate: '2023-06-15'
    }
  ]);

  const [search, setSearch] = useState('');

  // Filter applications based on search
  const filteredApplications = applications.filter(app => 
    app.company.toLowerCase().includes(search.toLowerCase()) ||
    app.position.toLowerCase().includes(search.toLowerCase())
  );

  // Group applications by status
  const groupedApplications = {
    pending: filteredApplications.filter(app => app.status === 'pending'),
    approved: filteredApplications.filter(app => app.status === 'approved'),
    rejected: filteredApplications.filter(app => app.status === 'rejected')
  };

  return (
    <div className="my-applications">
      <div className="page-header">
        <h1>My Applications</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by company or position..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="applications-container">
        {/* Pending Applications */}
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

        {/* Approved Applications */}
        <div className="application-group">
          <h2 className="group-title approved">
            Approved Applications ({groupedApplications.approved.length})
          </h2>
          <div className="applications-grid">
            {groupedApplications.approved.map(app => (
              <div key={app.id} className="application-card approved">
                <div className="card-header">
                  <div className="header-main">
                    <h3>{app.position}</h3>
                    <div className="status-badge approved">Approved</div>
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

        {/* Rejected Applications */}
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
      </div>
    </div>
  );
};

export default MyApplications;