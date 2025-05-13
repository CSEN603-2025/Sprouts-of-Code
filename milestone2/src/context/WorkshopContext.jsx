import { createContext, useContext, useState, useEffect } from 'react';
import { dummyData } from '../data/dummyData';

const WorkshopContext = createContext();

export const useWorkshops = () => {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshops must be used within a WorkshopProvider');
  }
  return context;
};

export const WorkshopProvider = ({ children }) => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with dummy data
    setWorkshops(dummyData.workshops);
    setLoading(false);
  }, []);

  const createWorkshop = (workshopData) => {
    const newWorkshop = {
      id: Math.max(...workshops.map(w => w.id)) + 1,
      ...workshopData,
      isProOnly: true
    };
    setWorkshops(prev => [...prev, newWorkshop]);
    return newWorkshop;
  };

  const updateWorkshop = (id, workshopData) => {
    setWorkshops(prev => 
      prev.map(workshop => 
        workshop.id === id ? { ...workshop, ...workshopData } : workshop
      )
    );
  };

  const deleteWorkshop = (id) => {
    setWorkshops(prev => prev.filter(workshop => workshop.id !== id));
  };

  const getWorkshopById = (id) => {
    return workshops.find(workshop => workshop.id === id);
  };

  const getWorkshopsByType = (type) => {
    return workshops.filter(workshop => workshop.type === type);
  };

  const validateWorkshopDates = (workshopData) => {
    const now = new Date();
    const startDate = new Date(`${workshopData.startDate}T${workshopData.startTime}`);
    const endDate = new Date(`${workshopData.endDate}T${workshopData.endTime}`);

    switch (workshopData.type) {
      case 'upcoming':
        return startDate > now;
      case 'live':
        return startDate <= now && endDate >= now;
      case 'pre-recorded':
        return endDate < now;
      default:
        return false;
    }
  };

  const value = {
    workshops,
    loading,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    getWorkshopById,
    getWorkshopsByType,
    validateWorkshopDates
  };

  return (
    <WorkshopContext.Provider value={value}>
      {children}
    </WorkshopContext.Provider>
  );
}; 