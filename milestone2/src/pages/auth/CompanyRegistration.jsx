import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import './CompanyRegistration.css';

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const { addCompany } = useCompany();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    companyEmail: '',
    companyLogo: null,
    documents: []
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === 'documents') {
        // Add new files to the documents array
        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, files[0]]
        }));
      } else {
        // Handle single file uploads (like company logo)
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRemoveFile = (fieldName, index) => {
    if (fieldName === 'documents') {
      // Remove specific document from the array
      setFormData(prev => ({
        ...prev,
        documents: prev.documents.filter((_, i) => i !== index)
      }));
    } else {
      // Handle single file removal (like company logo)
      setFormData(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add the company to the pending list
    addCompany(formData);
    // Navigate to success page
    navigate('/submission-success');
  };

  return (
    <div className="company-registration">
      <div className="registration-container">
        <h2>Register Your Company</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="companySize">Company Size</label>
            <select
              id="companySize"
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              required
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="companyEmail">Official Company Email</label>
            <input
              type="email"
              id="companyEmail"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyLogo">Company Logo</label>
            <input
              type="file"
              id="companyLogo"
              name="companyLogo"
              onChange={handleChange}
              accept="image/*"
              required={!formData.companyLogo}
            />
            {formData.companyLogo && (
              <div className="file-preview">
                <div className="file-info">
                  <span className="file-name">{formData.companyLogo.name}</span>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={() => handleRemoveFile('companyLogo')}
                    title="Remove file"
                  >
                    🗑️
                  </button>
                </div>
                {formData.companyLogo.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(formData.companyLogo)}
                    alt="Logo preview"
                    className="logo-preview"
                  />
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="documents">Company Documents (Tax documents, etc.)</label>
            <input
              type="file"
              id="documents"
              name="documents"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              required={!formData.documents}
            />
            {formData.documents.length > 0 && (
              formData.documents.map((document, index) => (
                <div className="file-preview" key={index}>
                <div className="file-info">
                  <span className="file-name">{document.name}</span>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={() => handleRemoveFile('documents', index)}
                    title="Remove file"
                  >
                    🗑️
                  </button>
                </div>
              </div>    
            )))}
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">Register Company</button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/login')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyRegistration; 