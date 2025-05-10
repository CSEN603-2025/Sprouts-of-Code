import React, { createContext, useContext, useState } from 'react';

const EvaluationContext = createContext();

export const EvaluationProvider = ({ children }) => {
  const [evaluations, setEvaluations] = useState([]);

  // Add a new evaluation
  const addEvaluation = (evaluation) => {
    setEvaluations(prev => [
      ...prev,
      { ...evaluation, id: Date.now() }
    ]);
  };

  // Update an existing evaluation by id
  const updateEvaluation = (id, updatedFields) => {
    setEvaluations(prev =>
      prev.map(ev => (ev.id === id ? { ...ev, ...updatedFields } : ev))
    );
  };

  // Delete an evaluation by id
  const deleteEvaluation = (id) => {
    setEvaluations(prev => prev.filter(ev => ev.id !== id));
  };

  // Get evaluation for a student, internship, and company
  const getEvaluation = (studentId, internshipId, companyId) => {
    return evaluations.find(ev =>
      ev.studentId === studentId &&
      ev.internshipId === internshipId &&
      ev.companyId === companyId
    );
  };

  return (
    <EvaluationContext.Provider value={{
      evaluations,
      addEvaluation,
      updateEvaluation,
      deleteEvaluation,
      getEvaluation
    }}>
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
}; 