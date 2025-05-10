import { useCompany } from '../../context/CompanyContext';
import { useState } from 'react';
import './AdminEmployers.css';

const AdminEmployers = () => {
  const { companies } = useCompany();
  const approvedCompanies = companies.filter(c => c.isApproved);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  const handleViewDetails = (employer) => {
    setSelectedEmployer(employer);
  };

  const closeModal = () => {
    setSelectedEmployer(null);
  };

  return (
    <div className="admin-list-page">
      <h1>All Employers</h1>
      <p>Total Employers: <strong>{approvedCompanies.length}</strong></p>
      <div className="employer-cards">
        {approvedCompanies.map(company => (
          <div key={company.id} className="employer-card">
            <h3>{company.name}</h3>
            <p>{company.email}</p>
            <button className="btn btn-outline" onClick={() => handleViewDetails(company)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedEmployer && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedEmployer.name}</h2>
            <p>Email: {selectedEmployer.email}</p>
            <p>ID: {selectedEmployer.id}</p>
            <button className="btn btn-outline" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployers; 