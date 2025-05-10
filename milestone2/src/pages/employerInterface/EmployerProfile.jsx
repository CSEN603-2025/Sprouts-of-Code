import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import './EmployerDashboard.css';

const EmployerProfile = () => {
  const { user } = useAuth();
  const { companies } = useCompany();

  // Find the logged-in company by email
  const company = companies.find(c => c.email === user.email);

  if (!company) {
    return <div className="card">Company profile not found.</div>;
  }

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        {company.logo && (
          <img src={company.logo} alt={company.name} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'contain', background: '#f5f5f5', border: '1px solid #eee' }} />
        )}
        <div>
          <h2 style={{ margin: 0 }}>{company.name}</h2>
          <div style={{ color: '#666', fontSize: 16 }}>{company.industry}</div>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}><strong>Email:</strong> {company.email}</div>
      <div style={{ marginBottom: 12 }}><strong>Location:</strong> {company.location}</div>
      <div style={{ marginBottom: 12 }}><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></div>
      <div style={{ marginBottom: 12 }}><strong>Description:</strong> {company.description}</div>
      <div style={{ marginBottom: 12 }}><strong>Status:</strong> {company.isApproved ? 'Approved' : 'Pending'}</div>
    </div>
  );
};

export default EmployerProfile; 