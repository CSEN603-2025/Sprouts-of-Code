import { createContext, useContext, useState } from 'react';
import { dummyCompanies } from '../data/dummyData';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState(dummyCompanies);

  const addApprovedCompany = (company) => {
    setCompanies(prev => [...prev, company]);
  };

  const removeCompany = (companyId) => {
    setCompanies(prev => prev.filter(company => company.id !== companyId));
  };

  const getCompanyById = (companyId) => {
    return companies.find(company => company.id === companyId);
  };

  return (
    <CompanyContext.Provider value={{
      companies,
      addApprovedCompany,
      removeCompany,
      getCompanyById
    }}>
      {children}
    </CompanyContext.Provider>
  );
}; 