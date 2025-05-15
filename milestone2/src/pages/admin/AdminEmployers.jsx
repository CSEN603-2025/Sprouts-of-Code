import { useCompany } from '../../context/CompanyContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminEmployers.css';

const AdminEmployers = () => {
  const { companies } = useCompany();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();
  const [industryFilter, setIndustryFilter] = useState('All');

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
  };

  const closeModal = () => {
    setSelectedCompany(null);
  };

  const handleFilterChange = (e) => {
    setIndustryFilter(e.target.value);
  };

  const filteredCompanies = companies.filter(company => {
    if (industryFilter === 'All') return true;
    return company.industry.toLowerCase() === industryFilter.toLowerCase();
  });

  return (
    <div className="admin-list-page">
      <div className="page-header">
        <h1>All Employers</h1>
        <p>Total Employers: <strong>{companies.length}</strong></p>
      </div>

      <div className="filter-bar">
        <label htmlFor="industryFilter">Filter by Industry: </label>
        <select
          id="industryFilter"
          value={industryFilter}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Retail">Retail</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="employer-cards">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <div key={company.id} className="employer-card">
              <h3>{company.name}</h3>
              <p>{company.email}</p>
              <p className="industry">{company.industry}</p>
              <button className="btn btn-outline" onClick={() => handleViewDetails(company)}>View Details</button>
              <button className="btn btn-outline" onClick={() => navigate(`/admin/employers/${company.id}`)}>View Profile</button>
            </div>
          ))
        ) : (
          <p>No employers found for the selected industry.</p>
        )}
      </div>

      {selectedCompany && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedCompany.name}</h2>
            <p>Email: {selectedCompany.email}</p>
            <p>Industry: {selectedCompany.industry}</p>
            <p>Location: {selectedCompany.location}</p>
            <button className="btn btn-outline" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployers;
