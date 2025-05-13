import { useCompany } from '../../context/CompanyContext';
import { useState, useMemo } from 'react';
import './AdminEmployers.css';

const AdminEmployers = () => {
  const { companies } = useCompany();
  const approvedCompanies = companies.filter(c => c.isApproved);

  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Get unique industries
  const industries = useMemo(() => {
    const unique = new Set(approvedCompanies.map(c => c.industry));
    return ['All', ...Array.from(unique)];
  }, [approvedCompanies]);

  // Handle filtering
  const filteredCompanies = approvedCompanies.filter(company => {
    const matchesSearch = (company.name || '').toLowerCase().includes(searchText.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || (company.industry || '') === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const handleViewDetails = (employer) => {
    setSelectedEmployer(employer);
  };

  const closeModal = () => {
    setSelectedEmployer(null);
  };

  return (
    <div className="admin-list-page">
      <h1>All Employers</h1>
      <p>
        Total Employers: <strong>{filteredCompanies.length}</strong>
      </p>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by company name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="industry-filter"
        >
          {industries.map((industry, idx) => (
            <option key={idx} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      <div className="employer-cards">
        {filteredCompanies.map(company => (
          <div key={company.id} className="employer-card">
            <div className="employer-header">
              {company.logo && (
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="company-logo"
                />
              )}
              <h3>{company.name}</h3>
            </div>
            <div className="employer-info">
              <p><strong>Industry:</strong> {company.industry}</p>
              <p><strong>Size:</strong> {company.size}</p>
              <p><strong>Email:</strong> {company.email}</p>
            </div>
            <button className="btn btn-outline" onClick={() => handleViewDetails(company)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedEmployer && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedEmployer.name}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {selectedEmployer.logo && (
                <div className="modal-logo">
                  <img
                    src={selectedEmployer.logo}
                    alt={`${selectedEmployer.name} logo`}
                  />
                </div>
              )}
              <div className="modal-details">
                <div className="detail-group">
                  <label>Industry:</label>
                  <span>{selectedEmployer.industry}</span>
                </div>
                <div className="detail-group">
                  <label>Company Size:</label>
                  <span>{selectedEmployer.size}</span>
                </div>
                <div className="detail-group">
                  <label>Email:</label>
                  <span>{selectedEmployer.email}</span>
                </div>
                {selectedEmployer.documents && selectedEmployer.documents.length > 0 && (
                  <div className="detail-group">
                    <label>Submitted Documents:</label>
                    <ul className="documents-list">
                      {selectedEmployer.documents.map((doc, index) => (
                        <li key={index}>{doc.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployers;
