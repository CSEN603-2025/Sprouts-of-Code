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

  // Load workshops from localStorage on mount
  useEffect(() => {
    const loadWorkshops = () => {
      try {
        const storedWorkshops = localStorage.getItem('workshops');
        if (storedWorkshops) {
          setWorkshops(JSON.parse(storedWorkshops));
        } else {
          setWorkshops(dummyData.workshops);
          localStorage.setItem('workshops', JSON.stringify(dummyData.workshops));
        }
      } catch (error) {
        console.error('Error loading workshops:', error);
        setWorkshops(dummyData.workshops);
      } finally {
        setLoading(false);
      }
    };
    
    loadWorkshops();
  }, []);

  // Save workshops to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('workshops', JSON.stringify(workshops));
    }
  }, [workshops, loading]);

  const createWorkshop = (workshopData) => {
    try {
      const newWorkshop = {
        id: Date.now(),
        ...workshopData,
        isProOnly: true
      };
      setWorkshops(prev => [...prev, newWorkshop]);
      return newWorkshop;
    } catch (error) {
      console.error('Error creating workshop:', error);
      return null;
    }
  };

  const updateWorkshop = (id, workshopData) => {
    try {
      setWorkshops(prev => 
        prev.map(workshop => 
          workshop.id === id ? { ...workshop, ...workshopData } : workshop
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating workshop:', error);
      return false;
    }
  };

  const deleteWorkshop = (id) => {
    try {
      setWorkshops(prev => prev.filter(workshop => workshop.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting workshop:', error);
      return false;
    }
  };

  const getWorkshopById = (id) => {
    return workshops.find(workshop => workshop.id === id);
  };

  const getWorkshopsByType = (type) => {
    return workshops.filter(workshop => workshop.type === type);
  };

  const validateWorkshopDates = (workshopData) => {
    try {
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
    } catch (error) {
      console.error('Error validating workshop dates:', error);
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