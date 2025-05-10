import { createContext, useContext, useState, useEffect } from 'react';
import { dummyInternships } from '../data/dummyData';

const InternshipContext = createContext();

export const InternshipProvider = ({ children }) => {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    // Initialize with dummy data
    setInternships(dummyInternships);
  }, []);

  // Create
  const addInternship = (internship) => {
    setInternships(prev => [
      ...prev,
      { ...internship, id: Date.now() }
    ]);
  };

  // Read: just use internships

  // Update
  const updateInternship = (id, updatedFields) => {
    setInternships(prev =>
      prev.map(internship =>
        internship.id === id ? { ...internship, ...updatedFields } : internship
      )
    );
  };

  // Delete
  const deleteInternship = (id) => {
    setInternships(prev => prev.filter(internship => internship.id !== id));
  };

  return (
    <InternshipContext.Provider value={{
      internships,
      addInternship,
      updateInternship,
      deleteInternship
    }}>
      {children}
    </InternshipContext.Provider>
  );
};

export const useInternships = () => {
  const context = useContext(InternshipContext);
  if (!context) {
    throw new Error('useInternships must be used within an InternshipProvider');
  }
  return context;
}; 