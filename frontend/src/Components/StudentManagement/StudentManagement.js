import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Nav/Nav';
import { Link } from 'react-router-dom';
import './StudentManagement.css';

const StudentManagement = () => {
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/activity")
      .then((response) => {
        setRecentActivities(response.data.activities);
      })
      .catch((error) => {
        console.error("Error fetching recent activities:", error);
      });
  }, []);

  return (
    <div className="student-management">
      <Nav /> 
      <input type="text" className="search-bar" placeholder="Search students..." />
      
      <div className="container">
        <h2 className="title">Student Management</h2>

        {/* Management Cards */}
        <div className="card-container">
            <Link to="/student-enrollment" className="card">
              <span className="card-icon">➕</span>
              <h3>Student Enrollment</h3>
              <p>Register new students</p>
            </Link>
          <Link to="/student-profiles" className="card"> {/* Update this link */}
            <span className="card-icon">📄</span>
            <h3>Student Profiles</h3>
            <p>View and manage profiles</p>
          </Link>
          <div className="card">
            <span className="card-icon">✅</span>
            <h3>Attendance Tracking</h3>
            <p>Monitor attendance</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          {recentActivities.map((activity) => (
            <div key={activity._id} className="activity-item">
              <img src="https://via.placeholder.com/40" alt="User" />
              <div className="activity-text">
                <p>
                  <strong>{activity.studentName}</strong> {activity.action}
                </p>
                <span className="activity-time">{new Date(activity.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;