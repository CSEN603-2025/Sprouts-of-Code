import { useStudent } from '../../context/StudentContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminStudents.css';

const AdminStudents = () => {
  const { students } = useStudent();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();
  const [internshipStatusFilter, setInternshipStatusFilter] = useState('All');

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };


  const closeModal = () => {
    setSelectedStudent(null);
  };

  const handleFilterChange = (e) => {
    setInternshipStatusFilter(e.target.value);
  };

  const filteredStudents = students.filter(student => {
    if (internshipStatusFilter === 'All') return true;

    return student.appliedInternships.some(internship =>
      internship.status.toLowerCase() === internshipStatusFilter.toLowerCase()
    );
  });

  return (
    <div className="admin-list-page">
      <h1>All Students</h1>
      <p>Total Students: <strong>{students.length}</strong></p>

      {/* Internship status filter dropdown */}
      <div className="filter-bar">
        <label htmlFor="statusFilter">Filter by Internship Status: </label>
        <select
          id="statusFilter"
          value={internshipStatusFilter}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="applied">Applied</option>
          <option value="undergoing">Undergoing</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="student-cards">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div key={student.id} className="student-card">
              <h3>{student.name}</h3>
              <p>{student.email}</p>
              <button className="btn btn-outline" onClick={() => handleViewDetails(student)}>View Details</button>
              <button className="btn btn-outline"  onClick={() => navigate(`/admin/students/${student.id}`)}>View Profile</button>
            </div>
          ))
        ) : (
          <p>No students found for the selected internship status.</p>
        )}
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
