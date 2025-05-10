import { createContext, useContext, useState } from 'react'
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

  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now().toString(),
      ...studentData
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
    return students.find(student => student.id === id)
  }

  const getStudentByEmail = (email) => {
    return students.find(student => student.email === email)
  }

  const value = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentByEmail
  }

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  )
} 