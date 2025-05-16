import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipContext'
import { useCompany } from '../../context/CompanyContext'
import { usePendingCompany } from '../../context/PendingCompanyContext'
import React, { useState, useMemo } from 'react'
import './InternshipOperations.css'

const defaultForm = {
  position: '',
  description: '',
  requirements: [],
  startDate: '',
  endDate: '',
  location: '',
  isRemote: false,
  isPaid: false,
  salary: '',
  status: 'pending'
}

const InternshipOperations = () => {
  const { user } = useAuth()
  const { internships, updateInternship, deleteInternship, addInternship } = useInternships()
  const { companies } = useCompany()
  const { pendingCompanies } = usePendingCompany()
  const [expandedId, setExpandedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [editingInternship, setEditingInternship] = useState(null)
  const [editForm, setEditForm] = useState(defaultForm)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [paidFilter, setPaidFilter] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const currentCompanyId = user?.companyId;
  
  // Get company data
  const company = companies.find(c => c.email === user.email)
  const pendingCompany = pendingCompanies.find(c => c.email === user.email)
  
  // Handle status update
  const handleStatusUpdate = (internshipId, newStatus) => {
    updateInternship(internshipId, { status: newStatus })
  }
  
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
    setEditingInternship(null)
  }

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                  (end.getMonth() - start.getMonth())
    return `${months} month${months !== 1 ? 's' : ''}`
  }

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId)
    return company ? company.name : 'Unknown Company'
  }

  const isOwnInternship = (internship) => {
    return internship.companyId === company?.id
  }

  const handleEdit = (internship) => {
    setEditingInternship(internship)
    setEditForm({
      position: internship.position,
      description: internship.description,
      requirements: [...internship.requirements],
      startDate: internship.startDate,
      endDate: internship.endDate,
      location: internship.location,
      isRemote: internship.isRemote,
      salary: internship.salary,
      status: internship.status
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (editingInternship) {
      await updateInternship(editingInternship.id, editForm)
      setEditingInternship(null)
    }
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDelete = async (internshipId) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      await deleteInternship(internshipId)
    }
  }

  // CREATE INTERNSHIP HANDLERS
  const [createForm, setCreateForm] = useState(defaultForm)
  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target
    setCreateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (!company) return
    addInternship({
      ...createForm,
      requirements: typeof createForm.requirements === 'string' ? createForm.requirements.split('\n').filter(r => r.trim()) : createForm.requirements,
      companyId: company.id,
      salary: createForm.isPaid ? createForm.salary : '0 EGP/month'
    })
    setCreateForm(defaultForm)
    setShowCreateForm(false)
  }

  // Get unique industries from internships
  const industries = useMemo(() => {
    const allIndustries = internships.map((internship) => internship.industry).filter(Boolean);
    return ['All', ...Array.from(new Set(allIndustries))];
  }, [internships]);

  //Filter internships based on search query and company filter
  const filteredInternships = internships.filter(internship => {
    const companyName = getCompanyName(internship.companyId).toLowerCase()
    const position = internship.position.toLowerCase()
    const query = searchQuery.toLowerCase()
    
    const matchesSearch = companyName.includes(query) || position.includes(query)
    const matchesCompany = showAll || internship.companyId === company?.id

    // Calculate the duration in months
    const start = new Date(internship.startDate);
    const end = new Date(internship.endDate);
    const duration = (end.getFullYear() - start.getFullYear()) * 12 + 
                          (end.getMonth() - start.getMonth());

    // Paid/Unpaid logic: unpaid if salary is '0', '0 EGP/month', or similar
    const isUnpaid = !internship.salary || internship.salary.trim() === '0' || internship.salary.trim().toLowerCase() === '0 egp/month';
    const isPaid = !isUnpaid;
    const matchesPaid =
      paidFilter === 'All' ||
      (paidFilter === 'Paid' && isPaid) ||
      (paidFilter === 'Unpaid' && isUnpaid);

    // Duration filter
    const matchesDuration =
      durationFilter === 'All' ||
      (durationFilter === '1 month' && duration === 1) ||
      (durationFilter === '2 months' && duration === 2) ||
      (durationFilter === '3 months' && duration === 3) ||
      (durationFilter === 'More than 3 months' && duration > 3);

    // Industry filter
    const matchesIndustry = selectedIndustry === 'All' || internship.industry === selectedIndustry;

    // Return true if all conditions match
    return matchesSearch && matchesCompany && matchesPaid && matchesDuration && matchesIndustry;
  })

  // Handle industry selection
  // const handleIndustryChange = (e) => {
  //   const options = Array.from(e.target.selectedOptions, (option) => option.value);
  //   setSelectedIndustries(options);
  // };
  
  return (
    <div className="internship-operations">
      <div className="page-header">
        <h1>Internship Operations</h1>
      </div>
      
      <div className="operations-content">
        <div className="create-internship-top">
          <button className="btn btn-primary" onClick={() => setShowCreateForm(v => !v)}>
            {showCreateForm ? 'Cancel' : 'Create New Internship'}
          </button>
        </div>
        {showCreateForm && (
          <form onSubmit={handleCreateSubmit} className="edit-form">
            <div className="form-group">
              <label>Position</label>
              <input
                type="text"
                name="position"
                value={createForm.position}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={createForm.description}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Requirements</label>
              <textarea
                name="requirements"
                value={Array.isArray(createForm.requirements) ? createForm.requirements.join('\n') : createForm.requirements}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={createForm.startDate}
                  onChange={handleCreateChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={createForm.endDate}
                  onChange={handleCreateChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={createForm.location}
                  onChange={handleCreateChange}
                  required
                />
              </div>
              <div className="form-group paid-toggle-group">
                <label htmlFor="isPaidToggle" className="toggle-label">Paid Internship</label>
                <label className="toggle-switch">
                  <input
                    id="isPaidToggle"
                    type="checkbox"
                    name="isPaid"
                    checked={createForm.isPaid}
                    onChange={handleCreateChange}
                  />
                  <span className="slider"></span>
                </label>
                <span className="toggle-desc">Check if this internship is paid</span>
              </div>
            </div>
            {createForm.isPaid && (
              <div className="form-group">
                <label>Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={createForm.salary}
                  onChange={handleCreateChange}
                  required
                  placeholder="e.g., 5000 EGP/month"
                />
              </div>
            )}
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="isRemote"
                  checked={createForm.isRemote}
                  onChange={handleCreateChange}
                  Style="margin-right: 5px;"
                />
                Remote Position
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Create Internship</button>
            </div>
          </form>
        )}
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by company name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <select
              className="filter-select"
              value={showAll ? 'all' : 'company'}
              onChange={e => setShowAll(e.target.value === 'all')}
              style={{ marginRight: '1rem' }}
            >
              <option value="all">All Internships</option>
              <option value="company">My Company's Internships</option>
            </select>
            <div className="filters">
              {/* Paid/Unpaid Filter */}
              <select
                className="filter-select"
                value={paidFilter}
                onChange={(e) => setPaidFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>

              {/* Duration Filter */}
              <select
                className="filter-select"
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
              >
                <option value="All">All Durations</option>
                <option value="1 month">1 months</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="More than 3 months">More than 3 months</option>
              </select>

              {/* Industry Filter */}
              <select
                className="filter-select"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="internships-list">
          {filteredInternships.length > 0 ? (
            filteredInternships.map(internship => (
              <div key={internship.id} className="internship-card">
                <div className="internship-header">
                  <div className="internship-title">
                    <h2>{internship.position}</h2>
                    <span className={`status-badge ${internship.status}`}>
                      {internship.status}
                    </span>
                  </div>
                  <div className="internship-basic-info">
                    <p className="company-name">{getCompanyName(internship.companyId)}</p>
                    <p className="duration">
                      {new Date(internship.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {expandedId === internship.id && (
                  <div className="internship-expanded-details">
                    {editingInternship?.id === internship.id ? (
                      <form onSubmit={handleEditSubmit} className="edit-form">
                        <div className="form-group">
                          <label>Position</label>
                          <input
                            type="text"
                            name="position"
                            value={editForm.position}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Requirements</label>
                          <textarea
                            name="requirements"
                            value={editForm.requirements.join('\n')}
                            onChange={(e) => setEditForm(prev => ({
                              ...prev,
                              requirements: e.target.value.split('\n').filter(r => r.trim())
                            }))}
                            required
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Start Date</label>
                            <input
                              type="date"
                              name="startDate"
                              value={editForm.startDate}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>End Date</label>
                            <input
                              type="date"
                              name="endDate"
                              value={editForm.endDate}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Location</label>
                            <input
                              type="text"
                              name="location"
                              value={editForm.location}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Salary</label>
                            <input
                              type="text"
                              name="salary"
                              value={editForm.salary}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group checkbox">
                          <label>
                            <input
                              type="checkbox"
                              name="isRemote"
                              checked={editForm.isRemote}
                              onChange={handleEditChange}
                            />
                            Remote Position
                          </label>
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="btn btn-primary">Save Changes</button>
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => setEditingInternship(null)}
                          >
                            Cancel
                          </button>
                  </div>
                      </form>
                    ) : (
                      <>
                  <div className="detail-item">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">
                            {calculateDuration(internship.startDate, internship.endDate)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location</span>
                          <span className="detail-value">
                            {internship.isRemote ? 'Remote' : internship.location}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Salary</span>
                          <span className="detail-value">{internship.salary}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Description</span>
                          <span className="detail-value">{internship.description}</span>
                  </div>
                        <div className="detail-item">
                          <span className="detail-label">Requirements</span>
                          <span className="detail-value">
                            <ul className="requirements-list">
                              {internship.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </span>
                </div>
                <div className="internship-actions">
                  {internship.status === 'pending' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleStatusUpdate(internship.id, 'active')}
                    >
                      Activate
                    </button>
                  )}
                          {!showAll && isOwnInternship(internship) && (
                            <div className="action-buttons">
                              <button 
                                className="btn btn-danger"
                                onClick={() => handleEdit(internship)}
                              >
                                Edit
                              </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(internship.id)}
                  >
                    Delete
                  </button>
                </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                <button 
                  className="btn btn-primary view-more-btn"
                  onClick={() => toggleExpand(internship.id)}
                >
                  {expandedId === internship.id ? 'Show Less' : 'View More'}
                </button>
              </div>
            ))
          ) : (
            <div className="no-internships">
              <p>No internships found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InternshipOperations 