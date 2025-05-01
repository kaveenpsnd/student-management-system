"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import LoadingSpinner from "../common/LoadingSpinner"
import ErrorMessage from "../common/ErrorMessage"
import "../../styles/student-management.css"

const StudentManagement = () => {
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityResponse = await axios.get("http://localhost:5000/activity")
        setRecentActivities(activityResponse.data.activities)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="student-management-container">
      {/* Search Bar */}
      <input type="text" className="search-bar" placeholder="Search students..." />

      {/* Page Title */}
      <h1 className="page-title">Student Management</h1>

      {/* Management Cards */}
      <div className="management-cards">
        <Link to="/student-enrollment" className="management-card">
          <div className="card-icon-container">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                  fill="#333"
                />
                <circle cx="17" cy="7" r="5" fill="#333" />
                <path d="M19 7H15M17 5V9" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <h3 className="card-title">Student Enrollment</h3>
          <p className="card-description">Register new students</p>
        </Link>

        <Link to="/student-profiles" className="management-card">
          <div className="card-icon-container">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V6H20V18Z"
                  fill="#333"
                />
                <path d="M4 0H20V24H4V0ZM6 2V22H18V2H6ZM13 18H11V16H13V18ZM13 14H11V8H13V14Z" fill="#333" />
              </svg>
            </div>
          </div>
          <h3 className="card-title">Student Profiles</h3>
          <p className="card-description">View and manage profiles</p>
        </Link>

        <Link to="/attendance" className="management-card">
          <div className="card-icon-container">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="#333"
                />
                <path d="M12 17L12 12L7 12" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <h3 className="card-title">Attendance Tracking</h3>
          <p className="card-description">Monitor attendance</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="recent-activity-header">
          <h3 className="recent-activity-title">Recent Activity</h3>
        </div>
        <div>
          {recentActivities.length > 0 ? (
            <ul className="activity-list">
              {recentActivities.map((activity) => (
                <li key={activity._id} className="activity-item">
                  <div className="activity-content">
                    <div className="activity-avatar">
                      {activity.studentPhoto ? (
                        <img src={`http://localhost:5000${activity.studentPhoto}`} alt={activity.studentName} />
                      ) : (
                        activity.studentName.charAt(0)
                      )}
                    </div>
                    <div className="activity-details">
                      <p className="activity-text">
                        <span className="activity-name">{activity.studentName}</span> {activity.action}
                      </p>
                      <p className="activity-time">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">No recent activities</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentManagement
