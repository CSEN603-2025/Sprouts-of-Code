import { useStudent } from '../../context/StudentContext';
import { useState } from 'react';
import './AdminStudents.css';

const AdminStudents = () => {
  const { students } = useStudent();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="admin-list-page">
      <h1>All Students</h1>
      <p>Total Students: <strong>{students.length}</strong></p>
      <div className="student-cards">
        {students.map(student => (
          <div key={student.id} className="student-card">
            <h3>{student.name}</h3>
            <p>{student.email}</p>
            <button className="btn btn-outline" onClick={() => handleViewDetails(student)}>View Details</button>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedStudent.name}</h2>
            <p>Email: {selectedStudent.email}</p>
            <p>ID: {selectedStudent.id}</p>
            <button className="btn btn-outline" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents; 