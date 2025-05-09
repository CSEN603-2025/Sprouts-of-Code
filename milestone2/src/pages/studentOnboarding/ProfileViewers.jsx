import { useState } from 'react';
import './ProfileViewers.css';

const ProfileViewers = () => {
  // Dummy data for companies that viewed the profile
  const [viewers] = useState([
    {
      id: 1,
      company: 'TechCorp',
      industry: 'Technology',
      viewedDate: '2024-03-15',
      viewedTime: '14:30',
      location: 'Cairo, Egypt',
      companySize: '100-500',
      website: 'www.techcorp.com',
      lastActive: '2 days ago'
    },
    {
      id: 2,
      company: 'DataSystems',
      industry: 'Data Analytics',
      viewedDate: '2024-03-14',
      viewedTime: '10:15',
      location: 'Alexandria, Egypt',
      companySize: '50-200',
      website: 'www.datasystems.com',
      lastActive: '3 days ago'
    },
    {
      id: 3,
      company: 'InnovateTech',
      industry: 'Software Development',
      viewedDate: '2024-03-13',
      viewedTime: '16:45',
      location: 'Remote',
      companySize: '200-1000',
      website: 'www.innovatetech.com',
      lastActive: '1 day ago'
    }
  ]);

  const [search, setSearch] = useState('');

  // Filter viewers based on search
  const filteredViewers = viewers.filter(viewer => 
    viewer.company.toLowerCase().includes(search.toLowerCase()) ||
    viewer.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="profile-viewers">
      <div className="page-header">
        <h1>Profile Viewers</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by company or industry..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="viewers-container">
        <div className="viewers-grid">
          {filteredViewers.map(viewer => (
            <div key={viewer.id} className="viewer-card">
              <div className="card-header">
                <div className="header-main">
                  <h3>{viewer.company}</h3>
                  <div className="viewed-badge">
                    Viewed {viewer.viewedDate}
                  </div>
                </div>
                <div className="header-details">
                  <div className="industry-info">
                    <i className="fas fa-industry"></i>
                    <p className="industry">{viewer.industry}</p>
                  </div>
                  <div className="time-info">
                    <i className="fas fa-clock"></i>
                    <p className="time">{viewer.viewedTime}</p>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="info-section">
                  <h4>Company Details</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Location</span>
                      <span className="value">{viewer.location}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Company Size</span>
                      <span className="value">{viewer.companySize}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Website</span>
                      <span className="value">{viewer.website}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Last Active</span>
                      <span className="value">{viewer.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileViewers;
