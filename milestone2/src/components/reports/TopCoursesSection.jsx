import { useState, useEffect } from 'react';
import { useInternshipReport } from '../../context/InternshipReportContext';
import './TopCoursesSection.css';

const TopCoursesSection = () => {
  const { reports } = useInternshipReport();
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    // Calculate course frequencies
    const courseFrequency = {};
    
    // Iterate through all reports
    Object.values(reports).forEach(userReports => {
      Object.values(userReports).forEach(report => {
        if (report.courses && Array.isArray(report.courses)) {
          report.courses.forEach(courseId => {
            courseFrequency[courseId] = (courseFrequency[courseId] || 0) + 1;
          });
        }
      });
    });

    // Convert to array and sort by frequency
    const sortedCourses = Object.entries(courseFrequency)
      .map(([courseId, count]) => ({ courseId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Get top 5 courses

    // Map course IDs to course names
    const courseNames = {
      1: 'CSEN102 - Introduction to Computer Science',
      2: 'CSEN301 - Data Structures and Algorithms',
      3: 'CSEN501 - Database I',
      4: 'CSEN603 - Database II',
      5: 'DMET502 - Computer Networks',
      6: 'CSEN602 - Operating Systems',
      7: 'CSEN601 - Software Engineering',
      8: 'DMET701 - Computer Graphics'
    };

    const coursesWithNames = sortedCourses.map(({ courseId, count }) => ({
      course: courseNames[courseId] || `Course ${courseId}`,
      count
    }));

    setTopCourses(coursesWithNames);
  }, [reports]);

  return (
    <div className="stats-section">
      <h2>Top Courses in Internships</h2>
      <div className="stats-grid">
        {topCourses.map(({ course, count }, index) => (
          <div key={course} className="stat-card">
            <h3>#{index + 1} {course}</h3>
            <div className="stat-number">{count}</div>
            <div className="stat-label">Reports</div>
          </div>
        ))}
        {topCourses.length === 0 && (
          <div className="stat-card">
            <h3>No Course Data</h3>
            <div className="stat-number">-</div>
            <div className="stat-label">Available</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCoursesSection; 