import React from 'react';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  return (
    <div>
      <div className="faculty-dashboard-content">
        <Link to="/faculty/reports" className="faculty-reports-link">
          <button className="faculty-reports-btn">View Student Reports</button>
        </Link>
        {/* Faculty Academic dashboard content goes here */}
      </div>
    </div>
  );
};

export default FacultyDashboard; 