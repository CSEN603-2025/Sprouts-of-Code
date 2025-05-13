import { createContext, useContext, useState, useEffect } from 'react';

const InternshipReportContext = createContext();

export const useInternshipReport = () => {
  const context = useContext(InternshipReportContext);
  if (!context) {
    throw new Error('useInternshipReport must be used within an InternshipReportProvider');
  }
  return context;
};

export const InternshipReportProvider = ({ children }) => {
  const [evaluations, setEvaluations] = useState({});
  const [reports, setReports] = useState({});
  const [selectedCourses, setSelectedCourses] = useState({});

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const storedEvaluations = JSON.parse(localStorage.getItem('internship_evaluations') || '{}');
      const storedReports = JSON.parse(localStorage.getItem('internship_reports') || '{}');
      const storedSelectedCourses = JSON.parse(localStorage.getItem('selected_courses') || '{}');
      
      setEvaluations(storedEvaluations);
      setReports(storedReports);
      setSelectedCourses(storedSelectedCourses);
    };
    
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('internship_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('internship_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('selected_courses', JSON.stringify(selectedCourses));
  }, [selectedCourses]);

  // Helper function to get user's data
  const getUserData = (userId) => {
    if (!evaluations[userId]) evaluations[userId] = {};
    if (!reports[userId]) reports[userId] = {};
    if (!selectedCourses[userId]) selectedCourses[userId] = {};
    return {
      userEvaluations: evaluations[userId],
      userReports: reports[userId],
      userSelectedCourses: selectedCourses[userId]
    };
  };

  // Evaluation functions
  const createEvaluation = (userId, internshipId, evaluation) => {
    const { userEvaluations } = getUserData(userId);
    setEvaluations(prev => ({
      ...prev,
      [userId]: {
        ...userEvaluations,
        [internshipId]: {
          ...evaluation,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    }));
  };

  const updateEvaluation = (userId, internshipId, evaluation) => {
    const { userEvaluations } = getUserData(userId);
    setEvaluations(prev => ({
      ...prev,
      [userId]: {
        ...userEvaluations,
        [internshipId]: {
          ...userEvaluations[internshipId],
          ...evaluation,
          updatedAt: new Date().toISOString()
        }
      }
    }));
  };

  const deleteEvaluation = (userId, internshipId) => {
    const { userEvaluations } = getUserData(userId);
    setEvaluations(prev => {
      const newUserEvaluations = { ...userEvaluations };
      delete newUserEvaluations[internshipId];
      return {
        ...prev,
        [userId]: newUserEvaluations
      };
    });
  };

  const getEvaluation = (userId, internshipId) => {
    const { userEvaluations } = getUserData(userId);
    return userEvaluations[internshipId];
  };

  // Report functions
  const createReport = (userId, internshipId, report) => {
    const { userReports } = getUserData(userId);
    setReports(prev => ({
      ...prev,
      [userId]: {
        ...userReports,
        [internshipId]: {
          ...report,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'draft'
        }
      }
    }));
  };

  const updateReport = (userId, internshipId, report) => {
    const { userReports } = getUserData(userId);
    setReports(prev => ({
      ...prev,
      [userId]: {
        ...userReports,
        [internshipId]: {
          ...userReports[internshipId],
          ...report,
          updatedAt: new Date().toISOString()
        }
      }
    }));
  };

  const deleteReport = (userId, internshipId) => {
    const { userReports } = getUserData(userId);
    setReports(prev => {
      const newUserReports = { ...userReports };
      delete newUserReports[internshipId];
      return {
        ...prev,
        [userId]: newUserReports
      };
    });
  };

  const getReport = (userId, internshipId) => {
    const { userReports } = getUserData(userId);
    return userReports[internshipId];
  };

  const submitReport = (userId, internshipId) => {
    const { userReports } = getUserData(userId);
    setReports(prev => ({
      ...prev,
      [userId]: {
        ...userReports,
        [internshipId]: {
          ...userReports[internshipId],
          status: 'submitted',
          submittedAt: new Date().toISOString()
        }
      }
    }));
  };

  // Course selection functions
  const toggleCourseSelection = (userId, internshipId, courseId) => {
    const { userSelectedCourses } = getUserData(userId);
    setSelectedCourses(prev => ({
      ...prev,
      [userId]: {
        ...userSelectedCourses,
        [internshipId]: userSelectedCourses[internshipId]?.includes(courseId)
          ? userSelectedCourses[internshipId].filter(id => id !== courseId)
          : [...(userSelectedCourses[internshipId] || []), courseId]
      }
    }));
  };

  const getSelectedCourses = (userId, internshipId) => {
    const { userSelectedCourses } = getUserData(userId);
    return userSelectedCourses[internshipId] || [];
  };

  const value = {
    evaluations,
    reports,
    selectedCourses,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    getEvaluation,
    createReport,
    updateReport,
    deleteReport,
    getReport,
    submitReport,
    toggleCourseSelection,
    getSelectedCourses
  };

  return (
    <InternshipReportContext.Provider value={value}>
      {children}
    </InternshipReportContext.Provider>
  );
}; 