import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyInternships, dummyCompanies, applyForInternship } from '../../data/dummyData';
import FilterBar from '../../components/shared/FilterBar';
import { useAuth } from '../../context/AuthContext';
import { useStudent } from '../../context/StudentContext';
import './AllInternships.css';

const AllInternships = () => {
  const { user } = useAuth();
  const { students } = useStudent();
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [search, setSearch] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const navigate = useNavigate();

  // Get the logged-in student using their email
  const loggedInStudent = students?.find(student => student.email === user?.email);
  const studentId = loggedInStudent?.id;

  const salaryFilterOptions = [
    { value: 'all', label: 'All Salaries' },
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' }
  ];

  const durationFilterOptions = [
    { value: 'all', label: 'All Durations' },
    { value: '1-month', label: '1 Month' },
    { value: '2-months', label: '2 Months' },
    { value: '3-months', label: '3 Months' },
    { value: 'more-than-3', label: 'More than 3 Months' }
  ];

  const industryFilterOptions = [
    { value: 'all', label: 'All Industries' },
    { value: 'Software Development', label: 'Software Development' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Design', label: 'Design' },
    { value: 'Quality Assurance', label: 'Quality Assurance' },
    { value: 'Backend Development', label: 'Backend Development' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Full Stack Development', label: 'Full Stack Development' },
    { value: 'Product Management', label: 'Product Management' },
    { value: 'FinTech Development', label: 'FinTech Development' },
    { value: 'Healthcare Technology', label: 'Healthcare Technology' },
    { value: 'E-commerce Development', label: 'E-commerce Development' },
    { value: 'Logistics Technology', label: 'Logistics Technology' }
  ];

  // Filter internships based on search and filters
  const filteredInternships = dummyInternships.filter((internship) => {
    const matchesSearch = internship.position.toLowerCase().includes(search.toLowerCase()) ||
                         dummyCompanies.find(c => c.id === internship.companyId)?.name.toLowerCase().includes(search.toLowerCase());

    // Paid/Unpaid filter
    const isUnpaid = !internship.salary || internship.salary.trim() === '0' || internship.salary.trim().toLowerCase() === '0 egp/month';
    const matchesSalary = salaryFilter === 'all' ||
                         (salaryFilter === 'paid' && !isUnpaid) ||
                         (salaryFilter === 'unpaid' && isUnpaid);

    // Duration filter
    const durationMatch = internship.duration.match(/^(\d+)/);
    const durationMonths = durationMatch ? parseInt(durationMatch[1], 10) : 0;
    const matchesDuration = durationFilter === 'all' ||
                           (durationFilter === '1-month' && durationMonths === 1) ||
                           (durationFilter === '2-months' && durationMonths === 2) ||
                           (durationFilter === '3-months' && durationMonths === 3) ||
                           (durationFilter === 'more-than-3' && durationMonths > 3);

    // Industry filter
    const matchesIndustry = industryFilter === 'all' || internship.industry === industryFilter;

    return matchesSearch && matchesSalary && matchesDuration && matchesIndustry;
  });

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
    setShowModal(true);
  };

  const handleApply = (internshipId) => {
    if (!studentId) {
      // Handle case where user is not logged in
      navigate('/login');
      return;
    }

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
      <div className="page-header">
        <h1>Available Internships</h1>
        <div className="filters-section">
          <label className="filters-label">Filter by</label>
        <div className="filters-container">
          <FilterBar
            searchPlaceholder="Search internships..."
            searchValue={search}
            onSearchChange={setSearch}
            filterOptions={salaryFilterOptions}
            activeFilter={salaryFilter}
            onFilterChange={setSalaryFilter}
          />
          <FilterBar
            showSearch={false}
            filterOptions={durationFilterOptions}
            activeFilter={durationFilter}
            onFilterChange={setDurationFilter}
          />
            <FilterBar
              showSearch={false}
              filterOptions={industryFilterOptions}
              activeFilter={industryFilter}
              onFilterChange={setIndustryFilter}
            />
          </div>
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
                aria-label="Apply Now"
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