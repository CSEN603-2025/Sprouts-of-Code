import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyInternships, dummyCompanies, applyForInternship } from '../../data/dummyData';
import './AllInternships.css';

const AllInternships = () => {
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [salaryFilter, setSalaryFilter] = useState('All'); // Filter by paid/unpaid
  const [durationFilter, setDurationFilter] = useState('All'); // Filter by duration
  const navigate = useNavigate();

  // Assuming studentId and studentCompanyId are stored in localStorage or context
  const studentId = 1; // Replace with actual student ID from auth context
  const studentCompanyId = 1; // Replace with actual company ID from the student context or localStorage

  // Filter internships based on the salary and duration filters
const filteredInternships = dummyInternships.filter((internship) => {
  // Salary filter
  const matchesPaid =
    salaryFilter === 'All' ||
    (salaryFilter === 'Paid' && internship.salary) ||
    (salaryFilter === 'Unpaid' && !internship.salary);

  // Extract numeric duration from the string (e.g. "2 months" → 2)
  const durationMatch = internship.duration.match(/^(\d+)/);
  const durationMonths = durationMatch ? parseInt(durationMatch[1], 10) : 0;

  // Duration filter
  const matchesDuration =
    durationFilter === 'All' ||
    (durationFilter === '1 month' && durationMonths === 1) ||
    (durationFilter === '2 months' && durationMonths === 2) ||
    (durationFilter === '3 months' && durationMonths === 3) ||
    (durationFilter === 'More than 3' && durationMonths > 3);

  return matchesPaid && matchesDuration;
});

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
    setShowModal(true);
  };

  const handleApply = (internshipId) => {
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

      {/* Dropdown for Paid/Unpaid Filter */}
     <div className="filters">
  <div className="dropdown">
    <label htmlFor="salaryFilter">Filter by Salary:</label>
    <select
      id="salaryFilter"
      value={salaryFilter}
      onChange={(e) => setSalaryFilter(e.target.value)}
    >
      <option value="All">All</option>
      <option value="Paid">Paid</option>
      <option value="Unpaid">Unpaid</option>
    </select>
  </div>

  <div className="dropdown">
    <label htmlFor="durationFilter">Filter by Duration:</label>
    <select
      id="durationFilter"
      value={durationFilter}
      onChange={(e) => setDurationFilter(e.target.value)}
    >
      <option value="All">All</option>
      <option value="1 month">1 Month</option>
      <option value="2 months">2 Months</option>
      <option value="3 months">3 Months</option>
      <option value="More than 3">More than 3 Months</option>
    </select>
  </div>
</div>

      <div className="internships-grid">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((internship) => {
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
          })
        ) : (
          <p>No internships found matching your filters.</p>
        )}
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
