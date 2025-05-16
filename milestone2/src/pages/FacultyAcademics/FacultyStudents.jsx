import { useStudent } from '../../context/StudentContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/shared/FilterBar';
import './FacultyStudents.css';

const FacultyStudents = () => {
  const { students } = useStudent();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'applied', label: 'Applied' },
    { value: 'undergoing', label: 'Undergoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const filteredStudents = students.filter(student => {
    if (filter === 'all') return true;
    return student.appliedInternships?.some(internship =>
      internship.status.toLowerCase() === filter.toLowerCase()
    );
  });

  return (
    <div className="admin-list-page">
      <div className="page-header">
        <h1>All Students</h1>
        <p>Total Students: <strong>{students.length}</strong></p>
      </div>

      <FilterBar
        filterOptions={filterOptions}
        activeFilter={filter}
        onFilterChange={setFilter}
        showSearch={false}
      />

      <div className="student-cards">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div key={student.id} className="student-card">
              <h3>{student.name}</h3>   
              <p>{student.email}</p>
              <button className="btn btn-outline" onClick={() => handleViewDetails(student)}>View Details</button>
              <button className="btn btn-outline" onClick={() => navigate(`/faculty-academic/students/${student.id}`)}>View Profile</button>
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

export default FacultyStudents; 