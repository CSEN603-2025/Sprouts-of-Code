import { useCompany } from '../../context/CompanyContext';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminEmployers.css';

const AdminEmployers = () => {
  const { companies } = useCompany();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Get unique industries
  const industries = useMemo(() => {
    const unique = new Set(companies.map(c => c.industry));
    return ['All', ...Array.from(unique)];
  }, [companies]);

  // Handle filtering
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = (company.name || '').toLowerCase().includes(searchText.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || (company.industry || '').toLowerCase() === selectedIndustry.toLowerCase();
    return matchesSearch && matchesIndustry;
  });

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
  };

  const closeModal = () => {
    setSelectedCompany(null);
  };

  const handleFilterChange = (e) => {
    setSelectedIndustry(e.target.value);
  };

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
          value={selectedIndustry}
          onChange={handleFilterChange}
        >
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
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
