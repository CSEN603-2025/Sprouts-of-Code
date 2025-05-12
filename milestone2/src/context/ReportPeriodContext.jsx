import React, { createContext, useContext, useState, useEffect } from 'react';

const ReportPeriodContext = createContext();

export const useReportPeriod = () => useContext(ReportPeriodContext);

export const ReportPeriodProvider = ({ children }) => {
  // Optionally, load from localStorage or backend
  const [startDate, setStartDate] = useState(localStorage.getItem('reportStartDate') || '');
  const [endDate, setEndDate] = useState(localStorage.getItem('reportEndDate') || '');

  useEffect(() => {
    localStorage.setItem('reportStartDate', startDate);
    localStorage.setItem('reportEndDate', endDate);
  }, [startDate, endDate]);

  return (
    <ReportPeriodContext.Provider value={{ startDate, endDate, setStartDate, setEndDate }}>
      {children}
    </ReportPeriodContext.Provider>
  );
}; 