"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { staffAttendanceService } from "../../../services/attendanceService"
import { useToast } from "../../../hooks/use-toast"
import "../../../styles/attendance.css"

const AdminAttendance = () => {
  const { toast } = useToast()
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState("")
  const [staffFilter, setStaffFilter] = useState("")

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true)
      const attendanceData = await staffAttendanceService.getAllAttendance()
      setAttendance(attendanceData)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching attendance:", error)
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive",
      })
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  return (
    <div className="admin-attendance-container">
      <div className="attendance-header">
        <div>
          <h1 className="attendance-title">Attendance Management</h1>
          <p className="attendance-subtitle">View and manage staff attendance</p>
        </div>
        <div className="header-actions">
          <Link to="/attendance-reports" className="reports-button">
            Generate Reports
          </Link>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Staff Member</label>
          <input
            type="text"
            placeholder="Search by staff name..."
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading attendance records...</div>
      ) : attendance.length === 0 ? (
        <div className="no-results">No attendance records found</div>
      ) : (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td>
                    <div className="staff-cell">
                      <div className="staff-avatar">
                        {record.staff?.photo ? (
                          <img
                            src={`http://localhost:5000${record.staff.photo}`}
                            alt={record.staff?.fullName || "Staff"}
                          />
                        ) : (
                          <span>{record.staff?.fullName?.charAt(0) || "?"}</span>
                        )}
                      </div>
                      <div className="staff-info">
                        <div className="staff-name">{record.staff?.fullName || "Unknown Staff"}</div>
                        <div className="staff-designation">{record.staff?.designation || ""}</div>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.timeIn || "N/A"}</td>
                  <td>{record.timeOut || "N/A"}</td>
                  <td>
                    <span className={`status-badge ${record.status.toLowerCase()}`}>{record.status}</span>
                  </td>
                  <td>
                    <div className="attendance-actions">
                      <button className="edit-button">Edit</button>
                      <button className="delete-button">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminAttendance
