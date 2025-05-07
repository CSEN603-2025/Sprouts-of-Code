import { createContext, useContext, useState } from 'react';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [pendingCompanies, setPendingCompanies] = useState([]);

  const addCompany = (company) => {
    setPendingCompanies(prev => [...prev, { ...company, id: Date.now(), status: 'pending' }]);
  };

  const removeCompany = (companyId) => {
    setPendingCompanies(prev => prev.filter(company => company.id !== companyId));
  };

  const approveCompany = (companyId) => {
    setPendingCompanies(prev => prev.filter(company => company.id !== companyId));
  };

  const rejectCompany = (companyId) => {
    setPendingCompanies(prev => prev.filter(company => company.id !== companyId));
  };

  return (
    <CompanyContext.Provider value={{
      pendingCompanies,
      addCompany,
      removeCompany,
      approveCompany,
      rejectCompany
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}; 