import { useState } from 'react'
import { useInternships } from '../../context/InternshipContext'
import { useCompany } from '../../context/CompanyContext'
import './InternshipManagement.css'

const defaultForm = {
  employer: '',
  position: '',
  duration: '',
  paid: false,
  expectedSalary: '',
  skills: '',
  jobDescription: '',
}

const InternshipManagement = () => {
  const { internships, addInternship, updateInternship, deleteInternship } = useInternships()
  const { pendingCompanies } = useCompany()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(defaultForm)

  // Filter internships based on search and filter
  const filteredInternships = internships.filter(internship => {
    if (filter !== 'all' && internship.status !== filter) return false
    if (search &&
      !internship.employer.toLowerCase().includes(search.toLowerCase()) &&
      !internship.position.toLowerCase().includes(search.toLowerCase()) &&
      !internship.skills.toLowerCase().includes(search.toLowerCase())
    ) return false
    return true
  })

  const openCreate = () => {
    setForm(defaultForm)
    setEditId(null)
    setShowForm(true)
  }

  const openEdit = (internship) => {
    setForm({
      employer: internship.employer,
      position: internship.position,
      duration: internship.duration,
      paid: internship.paid,
      expectedSalary: internship.expectedSalary,
      skills: internship.skills,
      jobDescription: internship.jobDescription,
    })
    setEditId(internship.id)
    setShowForm(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editId) {
      updateInternship(editId, form)
    } else {
      addInternship({ ...form, status: 'active' })
    }
    setShowForm(false)
    setForm(defaultForm)
    setEditId(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      deleteInternship(id)
    }
  }

  return (
    <div className="internship-management">
      <div className="page-header">
        <h1>Internship Management</h1>
        <button className="btn btn-primary" onClick={openCreate}>Create Internship</button>
      </div>
      <div className="filter-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search internships..."
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-options">
          <button className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-button ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
          <button className={`filter-button ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
          <button className={`filter-button ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>
      </div>
      <div className="internships-table-container">
        <table className="internships-table">
          <thead>
            <tr>
              <th>Employer</th>
              <th>Position</th>
              <th>Duration</th>
              <th>Paid</th>
              <th>Expected Salary</th>
              <th>Skills Required</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInternships.map(internship => (
              <tr key={internship.id}>
                <td>{internship.employer}</td>
                <td>{internship.position}</td>
                <td>{internship.duration}</td>
                <td>{internship.paid ? 'Paid' : 'Unpaid'}</td>
                <td>{internship.paid ? internship.expectedSalary : '-'}</td>
                <td>{internship.skills}</td>
                <td>{internship.jobDescription}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-button" onClick={() => openEdit(internship)}>Edit</button>
                    <button className="action-button danger" onClick={() => handleDelete(internship.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInternships.length === 0 && (
          <div className="no-results">
            <p>No internships found matching your criteria.</p>
          </div>
        )}
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editId ? 'Edit Internship' : 'Create Internship'}</h2>
              <button className="close-button" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form className="internship-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employer</label>
                <select name="employer" value={form.employer} onChange={handleChange} required>
                  <option value="">Select a company</option>
                  {pendingCompanies.map(company => (
                    <option key={company.id} value={company.companyName}>{company.companyName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Position</label>
                <input type="text" name="position" value={form.position} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 months" required />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" name="paid" checked={form.paid} onChange={handleChange} /> Paid Internship
                </label>
              </div>
              {form.paid && (
                <div className="form-group">
                  <label>Expected Salary</label>
                  <input type="number" name="expectedSalary" value={form.expectedSalary} onChange={handleChange} min="0" placeholder="USD per month" required={form.paid} />
                </div>
              )}
              <div className="form-group">
                <label>Skills Required</label>
                <input type="text" name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. React, Python" required />
              </div>
              <div className="form-group">
                <label>Job Description</label>
                <textarea name="jobDescription" value={form.jobDescription} onChange={handleChange} required />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Create'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InternshipManagement