import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyInternships, dummyCompanies, applyForInternship } from '../../data/dummyData';
import './AllInternships.css';

const AllInternships = () => {
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
    setShowModal(true);
  };

  const handleApply = (internshipId) => {
    // Get the current student ID from localStorage or context
    const studentId = 1; // This should be replaced with actual student ID from auth context
    
    const success = applyForInternship(studentId, internshipId);
    
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowModal(false);
      }, 2000);
    }
  };

  return (
    <div className="all-internships">
      <h1>Available Internships</h1>
      
      <div className="internships-grid">
        {dummyInternships.map((internship) => {
          const company = dummyCompanies.find(c => c.id === internship.companyId);
          return (
            <div key={internship.id} className="internship-card">
              <h3>{internship.position}</h3>
              <p className="company-name">{company?.name}</p>
              <p className="duration">{internship.duration}</p>
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(internship)}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {showModal && selectedInternship && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            <h2>{selectedInternship.position}</h2>
            <div className="internship-details">
              <p><strong>Company:</strong> {dummyCompanies.find(c => c.id === selectedInternship.companyId)?.name}</p>
              <p><strong>Duration:</strong> {selectedInternship.duration}</p>
              <p><strong>Location:</strong> {selectedInternship.location}</p>
              <p><strong>Start Date:</strong> {selectedInternship.startDate}</p>
              <p><strong>End Date:</strong> {selectedInternship.endDate}</p>
              <p><strong>Salary:</strong> {selectedInternship.salary}</p>
              <p><strong>Remote:</strong> {selectedInternship.isRemote ? 'Yes' : 'No'}</p>
              <div className="requirements">
                <h3>Requirements:</h3>
                <ul>
                  {selectedInternship.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <p className="description">{selectedInternship.description}</p>
              <button 
                className="apply-btn"
                onClick={() => handleApply(selectedInternship.id)}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="success-message">
          Successfully applied to the internship!
        </div>
      )}
    </div>
  );
};

export default AllInternships; 