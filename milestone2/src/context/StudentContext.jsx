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

  // Add notification helper function
  const addNotification = (studentId, message) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: new Date().toISOString(),
      read: false
    }

    // Get current notifications from localStorage
    const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${studentId}`) || '[]')
    const updatedNotifications = [newNotification, ...storedNotifications]
    
    // Save to localStorage
    localStorage.setItem(`notifications_${studentId}`, JSON.stringify(updatedNotifications))
  }

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

        // Add notification in a single operation
        const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${studentId}`) || '[]')
        const newNotification = {
          id: Date.now(),
          message: `Successfully registered for "${workshopTitle}". You will receive a reminder before the workshop.`,
          read: false,
          time: new Date().toISOString()
        }
        
        const updatedNotifications = [newNotification, ...storedNotifications]
        localStorage.setItem(`notifications_${studentId}`, JSON.stringify(updatedNotifications))
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

        // Add notification in a single operation
        const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${studentId}`) || '[]')
        const newNotification = {
          id: Date.now(),
          message: `Successfully unregistered from "${workshopTitle}".`,
          read: false,
          time: new Date().toISOString()
        }
        
        const updatedNotifications = [newNotification, ...storedNotifications]
        localStorage.setItem(`notifications_${studentId}`, JSON.stringify(updatedNotifications))
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
    addNotification
  }

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  )
} 