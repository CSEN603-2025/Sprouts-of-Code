import { createContext, useContext, useState, useEffect } from 'react'
import { dummyStudents } from '../data/dummyData'

const StudentContext = createContext()

export const useStudent = () => {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider')
  }
  return context
}

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(dummyStudents)

  // Load workshop registrations and certificates from localStorage on mount
  useEffect(() => {
    const loadStudentData = () => {
      const storedRegistrations = localStorage.getItem('workshop_registrations')
      const storedCertificates = localStorage.getItem('workshop_certificates')
      
      if (storedRegistrations) {
        const registrations = JSON.parse(storedRegistrations)
        setStudents(prev => prev.map(student => ({
          ...student,
          registeredWorkshops: registrations[student.id] || []
        })))
      }
      
      if (storedCertificates) {
        const certificates = JSON.parse(storedCertificates)
        setStudents(prev => prev.map(student => ({
          ...student,
          certificates: certificates[student.id] || []
        })))
      }
    }
    
    loadStudentData()
  }, [])

  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now().toString(),
      ...studentData,
      registeredWorkshops: [],
      certificates: []
    }
    setStudents(prev => [...prev, newStudent])
    return newStudent
  }

  const updateStudent = (id, updates) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === id ? { ...student, ...updates } : student
      )
    )
  }

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id))
  }

  const getStudentById = (id) => {
    return students.find(s => String(s.id) === id)
  }

  const getStudentByEmail = (email) => {
    return students.find(student => student.email === email)
  }

  // Add notification helper function with improved logging and error handling
  const addNotification = (studentId, message) => {
    if (!studentId) {
      console.error('Cannot add notification: No student ID provided');
      return;
    }

    console.log('Adding notification:', { studentId, message });
    
    // Ensure studentId is a string
    const stringStudentId = studentId.toString();
    
    const newNotification = {
      id: Date.now(),
      message,
      time: new Date().toISOString(),
      read: false
    };

    try {
      // Get current notifications from localStorage
      const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${stringStudentId}`) || '[]');
      console.log('Current stored notifications:', storedNotifications);
      
      const updatedNotifications = [newNotification, ...storedNotifications];
      console.log('Updated notifications to store:', updatedNotifications);
      
      // Save to localStorage
      localStorage.setItem(`notifications_${stringStudentId}`, JSON.stringify(updatedNotifications));
      console.log('Saved notifications to localStorage for student:', stringStudentId);

      // Dispatch custom event to notify about the update
      window.dispatchEvent(new Event('notificationUpdate'));
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  // Check for new internship cycle and send notifications
  const checkInternshipCycle = () => {
    const reportStartDate = localStorage.getItem('reportStartDate');
    console.log('Checking internship cycle. Start date:', reportStartDate);
    
    if (!reportStartDate) {
      console.log('No start date found in localStorage');
      return;
    }

    const startDate = new Date(reportStartDate);
    const now = new Date();
    const diffTime = startDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log('Date calculations:', {
      startDate: startDate.toISOString(),
      now: now.toISOString(),
      diffDays
    });

    // Notify all students if a new cycle is about to begin
    students.forEach(student => {
      if (!student || !student.id) {
        console.log('Invalid student data:', student);
        return;
      }

      // Ensure student.id is a string
      const stringStudentId = student.id.toString();
      console.log('Processing student:', { id: stringStudentId, email: student.email });

      // Check if we already notified about this cycle
      const cycleNotificationKey = `cycle_notification_${stringStudentId}_${reportStartDate}`;
      const hasNotified = localStorage.getItem(cycleNotificationKey);

      if (!hasNotified) {
        if (diffDays === 0) {
          console.log('Adding notification for cycle start today');
          addNotification(stringStudentId, 'A new internship cycle begins today! Check the available internships.');
          localStorage.setItem(cycleNotificationKey, 'true');
        } else if (diffDays > 0 && diffDays <= 7) {
          console.log('Adding notification for upcoming cycle');
          addNotification(stringStudentId, `A new internship cycle will begin in ${diffDays} days. Start preparing your applications!`);
          localStorage.setItem(cycleNotificationKey, 'true');
        }
      }
    });
  };

  // New function to check cycle for a specific student
  const checkCycleForStudent = (studentId) => {
    const reportStartDate = localStorage.getItem('reportStartDate');
    if (!reportStartDate) return;

    const startDate = new Date(reportStartDate);
    const now = new Date();
    const diffTime = startDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const stringStudentId = studentId.toString();
    const cycleNotificationKey = `cycle_notification_${stringStudentId}_${reportStartDate}`;
    const hasNotified = localStorage.getItem(cycleNotificationKey);

    if (!hasNotified) {
      if (diffDays === 0) {
        addNotification(stringStudentId, 'A new internship cycle begins today! Check the available internships.');
        localStorage.setItem(cycleNotificationKey, 'true');
      } else if (diffDays > 0 && diffDays <= 7) {
        addNotification(stringStudentId, `A new internship cycle will begin in ${diffDays} days. Start preparing your applications!`);
        localStorage.setItem(cycleNotificationKey, 'true');
      }
    }
  };

  // Initialize notifications for existing data
  useEffect(() => {
    console.log('Initializing notifications for existing data');
    
    // Check internship cycle
    checkInternshipCycle();
    
    // Add event listener for reportStartDate changes
    const handleStorageChange = (e) => {
      if (e.key === 'reportStartDate') {
        console.log('Report start date changed, checking cycle');
        checkInternshipCycle();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check periodically
    const interval = setInterval(checkInternshipCycle, 60 * 60 * 1000); // Check every hour
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [students]);

  // Workshop registration functions
  const registerForWorkshop = async (studentId, workshopId, workshopTitle) => {
    try {
      // First update localStorage
      const storedRegistrations = JSON.parse(localStorage.getItem('workshop_registrations') || '{}')
      const studentRegistrations = storedRegistrations[studentId] || []
      
      if (!studentRegistrations.includes(workshopId)) {
        // Update registrations in localStorage
        storedRegistrations[studentId] = [...studentRegistrations, workshopId]
        localStorage.setItem('workshop_registrations', JSON.stringify(storedRegistrations))

        // Update state in a single operation
        setStudents(prev => {
          const updatedStudents = prev.map(student => {
            if (student.id === studentId) {
              return {
                ...student,
                registeredWorkshops: [...(student.registeredWorkshops || []), workshopId]
              }
            }
            return student
          })
          return updatedStudents
        })

        // Add notification using the addNotification function
        addNotification(studentId, `Successfully registered for "${workshopTitle}". You will receive a reminder before the workshop.`);
      }
    } catch (error) {
      console.error('Error registering for workshop:', error)
      throw error
    }
  }

  const unregisterFromWorkshop = async (studentId, workshopId, workshopTitle) => {
    try {
      // First update localStorage
      const storedRegistrations = JSON.parse(localStorage.getItem('workshop_registrations') || '{}')
      const studentRegistrations = storedRegistrations[studentId] || []
      
      if (studentRegistrations.includes(workshopId)) {
        // Update registrations in localStorage
        storedRegistrations[studentId] = studentRegistrations.filter(id => id !== workshopId)
        localStorage.setItem('workshop_registrations', JSON.stringify(storedRegistrations))

        // Update state in a single operation
        setStudents(prev => {
          const updatedStudents = prev.map(student => {
            if (student.id === studentId) {
              return {
                ...student,
                registeredWorkshops: (student.registeredWorkshops || []).filter(id => id !== workshopId)
              }
            }
            return student
          })
          return updatedStudents
        })

        // Add notification using the addNotification function
        addNotification(studentId, `Successfully unregistered from "${workshopTitle}".`);
      }
    } catch (error) {
      console.error('Error unregistering from workshop:', error)
      throw error
    }
  }

  const isRegisteredForWorkshop = (studentId, workshopId) => {
    try {
      // Only check localStorage - don't update state here
      const storedRegistrations = JSON.parse(localStorage.getItem('workshop_registrations') || '{}')
      const studentRegistrations = storedRegistrations[studentId] || []
      return studentRegistrations.includes(workshopId)
    } catch (error) {
      console.error('Error checking workshop registration:', error)
      return false
    }
  }

  // Certificate functions
  const addCertificate = (studentId, workshopData) => {
    // First update localStorage
    const storedCertificates = JSON.parse(localStorage.getItem('workshop_certificates') || '{}')
    const studentCertificates = storedCertificates[studentId] || []
    
    const newCertificate = {
      id: Date.now(),
      workshopId: workshopData.id,
      title: workshopData.title,
      date: new Date().toISOString(),
      ...workshopData
    }

    storedCertificates[studentId] = [...studentCertificates, newCertificate]
    localStorage.setItem('workshop_certificates', JSON.stringify(storedCertificates))

    // Then update state
    setStudents(prev => 
      prev.map(student => {
        if (student.id === studentId) {
          const updatedCertificates = [...(student.certificates || []), newCertificate]
          return { ...student, certificates: updatedCertificates }
        }
        return student
      })
    )

    // Add notification
    addNotification(studentId, `Congratulations! You have completed "${workshopData.title}" and earned a certificate.`)
  }

  const getStudentCertificates = (studentId) => {
    // Check both state and localStorage to ensure consistency
    const student = getStudentById(studentId)
    const storedCertificates = JSON.parse(localStorage.getItem('workshop_certificates') || '{}')
    const studentCertificates = storedCertificates[studentId] || []
    
    return student?.certificates || studentCertificates
  }

  const value = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentByEmail,
    registerForWorkshop,
    unregisterFromWorkshop,
    isRegisteredForWorkshop,
    addCertificate,
    getStudentCertificates,
    addNotification,
    checkInternshipCycle,
    checkCycleForStudent
  }

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  )
} 
 