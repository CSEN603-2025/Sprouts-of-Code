import { useInternships } from '../../context/InternshipContext';
import { useState } from 'react';
import './AdminInternships.css';

const AdminInternships = () => {
  const { internships } = useInternships();
  const activeInternships = internships.filter(i => i.status === 'active');
  const [selectedInternship, setSelectedInternship] = useState(null);

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  return (
    <div className="admin-list-page">
      <h1>Active Internships</h1>
      <p>Total Active Internships: <strong>{activeInternships.length}</strong></p>
      <div className="internship-cards">
        {activeInternships.map(internship => (
          <div key={internship.id} className="internship-card">
            <h3>{internship.position}</h3>
            <p>Company ID: {internship.companyId}</p>
            <button className="btn btn-outline" onClick={() => handleViewDetails(internship)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedInternship && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedInternship.position}</h2>
            <p>Company ID: {selectedInternship.companyId}</p>
            <p>ID: {selectedInternship.id}</p>
            <button className="btn btn-outline" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInternships; 