"use client"

import { useState, useEffect } from "react"
import { staffAttendanceService } from "../../../services/attendanceService"
import { useToast } from "../../../hooks/use-toast"
import "../../../styles/staff-attendance.css"

const StaffAttendance = () => {
  const { toast } = useToast()
  const [attendance, setAttendance] = useState([])
  const [attendanceStats, setAttendanceStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCheckInForm, setShowCheckInForm] = useState(false)
  const [showCheckOutForm, setShowCheckOutForm] = useState(false)
  const [chartYear, setChartYear] = useState(new Date().getFullYear())
  const [chartMonth, setChartMonth] = useState(new Date().getMonth())

  // Get staff ID from localStorage
  const staffId = localStorage.getItem('staffId');

  useEffect(() => {
    if (staffId) {
      fetchAttendanceData()
    }
  }, [staffId])

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  if (!staffId) {
    return <div>Please log in to view attendance records.</div>;
  }

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)

      // Fetch attendance records
      const attendanceData = await staffAttendanceService.getStaffAttendance(staffId)
      setAttendance(attendanceData)

      // Fetch attendance statistics
      const stats = await staffAttendanceService.getStaffAttendanceStats(staffId)
      setAttendanceStats(stats)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    try {
      // In a real app, you would get the RFID code from a scanner
      const rfidCode = "RFID12345" // Example RFID code

      await staffAttendanceService.markCheckIn(staffId, rfidCode)

      toast({
        title: "Success",
        description: "Check-in marked successfully",
        variant: "success",
      })

      setShowCheckInForm(false)
      fetchAttendanceData()
    } catch (error) {
      console.error("Error marking check-in:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark check-in",
        variant: "destructive",
      })
    }
  }

  const handleCheckOut = async () => {
    try {
      // In a real app, you would get the RFID code from a scanner
      const rfidCode = "RFID12345" // Example RFID code

      await staffAttendanceService.markCheckOut(staffId, rfidCode)

      toast({
        title: "Success",
        description: "Check-out marked successfully",
        variant: "success",
      })

      setShowCheckOutForm(false)
      fetchAttendanceData()
    } catch (error) {
      console.error("Error marking check-out:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to mark check-out",
        variant: "destructive",
      })
    }
  }

  const navigateMonth = (direction) => {
    let newMonth = chartMonth
    let newYear = chartYear

    if (direction === "prev") {
      newMonth--
      if (newMonth < 0) {
        newMonth = 11
        newYear--
      }
    } else {
      newMonth++
      if (newMonth > 11) {
        newMonth = 0
        newYear++
      }
    }

    setChartMonth(newMonth)
    setChartYear(newYear)
  }

  // Check if today's attendance is already marked
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayAttendance = attendance.find((record) => {
    const recordDate = new Date(record.date)
    recordDate.setHours(0, 0, 0, 0)
    return recordDate.getTime() === today.getTime()
  })

  const canCheckIn = !todayAttendance
  const canCheckOut = todayAttendance && !todayAttendance.checkOut

  if (loading) {
    return <div className="loading-spinner">Loading attendance data...</div>
  }

  return (
    <div className="staff-attendance-container">
      <div className="attendance-header">
        <div>
          <h1 className="attendance-title">Attendance Management</h1>
          <p className="attendance-subtitle">Mark your attendance and view history</p>
        </div>
        <div className="attendance-actions">
          <button onClick={() => setShowCheckInForm(true)} className="check-in-button" disabled={!canCheckIn}>
            Check In
          </button>
          <button onClick={() => setShowCheckOutForm(true)} className="check-out-button" disabled={!canCheckOut}>
            Check Out
          </button>
        </div>
      </div>

      <div className="attendance-dashboard">
        <div className="attendance-summary-card">
          <h2 className="card-title">Attendance Summary</h2>

          {attendanceStats && (
            <div className="attendance-summary">
              <div className="summary-stats">
                <div className="stat-item">
                  <div className="stat-value">{attendanceStats.summary.attendancePercentage}%</div>
                  <div className="stat-label">Attendance Rate</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{attendanceStats.summary.totalPresent}</div>
                  <div className="stat-label">Days Present</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{attendanceStats.summary.totalAbsent}</div>
                  <div className="stat-label">Days Absent</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{attendanceStats.summary.totalWorkingHours.toFixed(1)}</div>
                  <div className="stat-label">Working Hours</div>
                </div>
              </div>

              <div className="attendance-progress">
                <div className="progress-label">Overall Attendance</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${attendanceStats.summary.attendancePercentage}%` }}
                  ></div>
                </div>
                <div className="progress-value">{attendanceStats.summary.attendancePercentage}%</div>
              </div>
            </div>
          )}

          {todayAttendance && (
            <div className="today-status">
              <h3 className="today-title">Today's Status</h3>
              <div className="today-details">
                <div className="status-item">
                  <span className="status-label">Check In:</span>
                  <span className="status-value">{new Date(todayAttendance.checkIn).toLocaleTimeString()}</span>
                </div>
                {todayAttendance.checkOut && (
                  <>
                    <div className="status-item">
                      <span className="status-label">Check Out:</span>
                      <span className="status-value">{new Date(todayAttendance.checkOut).toLocaleTimeString()}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Working Hours:</span>
                      <span className="status-value">{todayAttendance.workingHours.toFixed(2)} hours</span>
                    </div>
                  </>
                )}
                <div className="status-badge-container">
                  <span className={`status-badge ${todayAttendance.status.toLowerCase()}`}>
                    {todayAttendance.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="attendance-chart-card">
          <h2 className="card-title">Monthly Attendance</h2>

          {attendanceStats && (
            <div className="attendance-chart">
              <div className="chart-header">
                <button onClick={() => navigateMonth("prev")} className="chart-nav-button">
                  &lt;
                </button>
                <h3 className="chart-title">
                  {new Date(chartYear, chartMonth).toLocaleString("default", { month: "long" })} {chartYear}
                </h3>
                <button onClick={() => navigateMonth("next")} className="chart-nav-button">
                  &gt;
                </button>
              </div>

              <div className="chart-container">
                <div className="chart-bars">
                  {attendanceStats.monthlyStats[chartMonth].present > 0 && (
                    <div
                      className="chart-bar present"
                      style={{ height: `${attendanceStats.monthlyStats[chartMonth].present * 10}px` }}
                    >
                      <span className="bar-value">{attendanceStats.monthlyStats[chartMonth].present}</span>
                    </div>
                  )}

                  {attendanceStats.monthlyStats[chartMonth].halfDay > 0 && (
                    <div
                      className="chart-bar half-day"
                      style={{ height: `${attendanceStats.monthlyStats[chartMonth].halfDay * 10}px` }}
                    >
                      <span className="bar-value">{attendanceStats.monthlyStats[chartMonth].halfDay}</span>
                    </div>
                  )}

                  {attendanceStats.monthlyStats[chartMonth].absent > 0 && (
                    <div
                      className="chart-bar absent"
                      style={{ height: `${attendanceStats.monthlyStats[chartMonth].absent * 10}px` }}
                    >
                      <span className="bar-value">{attendanceStats.monthlyStats[chartMonth].absent}</span>
                    </div>
                  )}

                  {attendanceStats.monthlyStats[chartMonth].present === 0 &&
                    attendanceStats.monthlyStats[chartMonth].halfDay === 0 &&
                    attendanceStats.monthlyStats[chartMonth].absent === 0 && (
                      <div className="no-data">No attendance data for this month</div>
                    )}
                </div>

                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color present"></span>
                    <span className="legend-label">Present</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color half-day"></span>
                    <span className="legend-label">Half Day</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color absent"></span>
                    <span className="legend-label">Absent</span>
                  </div>
                </div>
              </div>

              <div className="working-hours">
                <h4 className="hours-title">
                  Working Hours: {attendanceStats.monthlyStats[chartMonth].workingHours.toFixed(1)} hours
                </h4>
                <div className="hours-bar">
                  <div
                    className="hours-fill"
                    style={{
                      width: `${Math.min(100, (attendanceStats.monthlyStats[chartMonth].workingHours / 160) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="attendance-history-section">
        <h2 className="section-title">Attendance History</h2>

        {attendance.length === 0 ? (
          <div className="no-attendance">No attendance records found.</div>
        ) : (
          <div className="attendance-table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.slice(0, 10).map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{new Date(record.checkIn).toLocaleTimeString()}</td>
                    <td>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "Not checked out"}</td>
                    <td>{record.workingHours > 0 ? `${record.workingHours.toFixed(2)} hours` : "N/A"}</td>
                    <td>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>{record.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCheckInForm && (
        <div className="attendance-form-overlay">
          <div className="attendance-form-container">
            <div className="form-header">
              <h2 className="form-title">Check In</h2>
              <button onClick={() => setShowCheckInForm(false)} className="close-button">
                ×
              </button>
            </div>

            <div className="form-content">
              <p className="form-message">
                You are about to check in for today. In a real system, you would scan your RFID card.
              </p>

              <div className="rfid-simulation">
                <div className="rfid-icon">📱</div>
                <p className="rfid-text">Simulating RFID Card Scan</p>
              </div>

              <div className="form-actions">
                <button onClick={() => setShowCheckInForm(false)} className="cancel-button">
                  Cancel
                </button>
                <button onClick={handleCheckIn} className="confirm-button">
                  Confirm Check In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCheckOutForm && (
        <div className="attendance-form-overlay">
          <div className="attendance-form-container">
            <div className="form-header">
              <h2 className="form-title">Check Out</h2>
              <button onClick={() => setShowCheckOutForm(false)} className="close-button">
                ×
              </button>
            </div>

            <div className="form-content">
              <p className="form-message">
                You are about to check out for today. In a real system, you would scan your RFID card.
              </p>

              <div className="rfid-simulation">
                <div className="rfid-icon">📱</div>
                <p className="rfid-text">Simulating RFID Card Scan</p>
              </div>

              <div className="form-actions">
                <button onClick={() => setShowCheckOutForm(false)} className="cancel-button">
                  Cancel
                </button>
                <button onClick={handleCheckOut} className="confirm-button">
                  Confirm Check Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffAttendance
