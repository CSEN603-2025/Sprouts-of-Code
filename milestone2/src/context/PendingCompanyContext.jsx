import { createContext, useContext, useState } from 'react';

const PendingCompanyContext = createContext();

export const PendingCompanyProvider = ({ children }) => {
  const [pendingCompanies, setPendingCompanies] = useState([]);

  const addCompany = (company) => {
    setPendingCompanies(prev => [...prev, { ...company, id: Date.now(), status: 'pending' }]);
  };

  const removeCompany = (companyId) => {
    setPendingCompanies(prev => prev.filter(company => company.id !== companyId));
  };

  const approveCompany = (companyId) => {
    const companyToApprove = pendingCompanies.find(company => company.id === companyId);
    if (companyToApprove) {
      // Remove from pending companies
      setPendingCompanies(prev => prev.filter(company => company.id !== companyId));
      // Return the approved company data to be added to the main companies list
      return {
        ...companyToApprove,
        isApproved: true,
        status: 'approved'
      };
    }
    return null;
  };

  const rejectCompany = (companyId) => {
    setPendingCompanies(prev => prev.filter(company => company.id !== companyId));
  };

  return (
    <PendingCompanyContext.Provider value={{
      pendingCompanies,
      addCompany,
      removeCompany,
      approveCompany,
      rejectCompany
    }}>
      {children}
    </PendingCompanyContext.Provider>
  );
};

export const usePendingCompany = () => {
  const context = useContext(PendingCompanyContext);
  if (!context) {
    throw new Error('usePendingCompany must be used within a PendingCompanyProvider');
  }
  return context;
}; 