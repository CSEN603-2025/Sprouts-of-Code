import { usePendingCompany } from '../../context/PendingCompanyContext';
import { useCompany } from '../../context/CompanyContext';
import './PendingCompanies.css';

const PendingCompanies = () => {
  const { pendingCompanies, approveCompany, rejectCompany } = usePendingCompany();
  const { addApprovedCompany } = useCompany();

  const handleApprove = (companyId) => {
    const approvedCompany = approveCompany(companyId);
    if (approvedCompany) {
      addApprovedCompany(approvedCompany);
    }
  };

  if (pendingCompanies.length === 0) {
    return (
      <div className="pending-companies">
        <div className="no-companies">
          <h2>No Pending Companies</h2>
          <p>There are no company registrations waiting for review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-companies">
      <h2>Pending Company Registrations</h2>
      <div className="companies-list">
        {pendingCompanies.map(company => (
          <div key={company.id} className="company-card">
            <div className="company-header">
              <h3>{company.companyName}</h3>
              <div className="company-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(company.id)}
                  title="Approve Company"
                >
                  ✓
                </button>
                <button
                  className="reject-btn"
                  onClick={() => rejectCompany(company.id)}
                  title="Reject Company"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="company-details">
              <div className="detail-group">
                <label>Industry:</label>
                <span>{company.industry}</span>
              </div>
              <div className="detail-group">
                <label>Company Size:</label>
                <span>{company.companySize}</span>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <span>{company.companyEmail}</span>
              </div>
            </div>

            {company.companyLogo && (
              <div className="company-logo">
                <label className="company-logo-label">Company Logo:</label>
                <img
                  src={URL.createObjectURL(company.companyLogo)}
                  alt="Company Logo"
                />
              </div>
            )}

            {company.documents && company.documents.length > 0 && (
              <div className="company-documents">
                <label>Submitted Documents:</label>
                <ul>
                  {company.documents.map((doc, index) => (
                    <li key={index}>{doc.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingCompanies; 