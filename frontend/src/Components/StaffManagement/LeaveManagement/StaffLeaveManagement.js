"use client"

import { useState, useEffect } from "react"
import { leaveService } from "../../../services/leaveService"
import { useToast } from "../../../hooks/use-toast"
import "../../../styles/leave-management.css"

const StaffLeaveManagement = () => {
  const { toast } = useToast()
  const [leaves, setLeaves] = useState([])
  const [leaveStats, setLeaveStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [chartYear, setChartYear] = useState(new Date().getFullYear())
  const [chartMonth, setChartMonth] = useState(new Date().getMonth())

  // Get staff ID from localStorage
  const staffId = localStorage.getItem('staffId')

  useEffect(() => {
    if (staffId) {
      fetchLeaveData()
    }
  }, [staffId])

  useEffect(() => {
    fetchLeaveData();
  }, [fetchLeaveData]);

  if (!staffId) {
    return (
      <div className="error-message">
        Please log in to access leave management.
      </div>
    )
  }

  const fetchLeaveData = async () => {
    try {
      setLoading(true)

      // Fetch leave requests
      const leaveData = await leaveService.getStaffLeaves(staffId)
      setLeaves(leaveData)

      // Fetch leave statistics
      const stats = await leaveService.getStaffLeaveStats(staffId)
      setLeaveStats(stats)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching leave data:", error)
      toast({
        title: "Error",
        description: "Failed to load leave data",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleApplyLeave = async (leaveData) => {
    try {
      await leaveService.applyLeave({
        ...leaveData,
        staffId,
      })

      toast({
        title: "Success",
        description: "Leave application submitted successfully",
        variant: "success",
      })

      setShowApplyForm(false)
      fetchLeaveData()
    } catch (error) {
      console.error("Error applying for leave:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to apply for leave",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLeave = async (leaveId, leaveData) => {
    try {
      await leaveService.updateLeave(leaveId, leaveData)

      toast({
        title: "Success",
        description: "Leave application updated successfully",
        variant: "success",
      })

      setSelectedLeave(null)
      fetchLeaveData()
    } catch (error) {
      console.error("Error updating leave:", error)
      toast({
        title: "Error",
        description: "Failed to update leave application",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLeave = async (leaveId) => {
    if (window.confirm("Are you sure you want to cancel this leave application?")) {
      try {
        await leaveService.deleteLeave(leaveId)

        toast({
          title: "Success",
          description: "Leave application cancelled successfully",
          variant: "success",
        })

        fetchLeaveData()
      } catch (error) {
        console.error("Error deleting leave:", error)
        toast({
          title: "Error",
          description: "Failed to cancel leave application",
          variant: "destructive",
        })
      }
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

  if (loading) {
    return <div className="loading-spinner">Loading leave data...</div>
  }

  return (
    <div className="staff-leave-container">
      <div className="leave-header">
        <div>
          <h1 className="leave-title">Leave Management</h1>
          <p className="leave-subtitle">Apply for leave and check your leave balance</p>
        </div>
        <button onClick={() => setShowApplyForm(true)} className="apply-leave-button">
          Apply for Leave
        </button>
      </div>

      <div className="leave-dashboard">
        <div className="leave-balance-card">
          <h2 className="card-title">Leave Balance</h2>

          {leaveStats && (
            <div className="leave-balance">
              <div className="leave-item">
                <div className="leave-progress">
                  <div
                    className="progress-fill annual"
                    style={{ width: `${(leaveStats.leaveBalance.annual / 14) * 100}%` }}
                  ></div>
                </div>
                <div className="leave-details">
                  <span className="leave-type">Annual Leave</span>
                  <span className="leave-count">{leaveStats.leaveBalance.annual} / 14 days</span>
                </div>
              </div>

              <div className="leave-item">
                <div className="leave-progress">
                  <div
                    className="progress-fill casual"
                    style={{ width: `${(leaveStats.leaveBalance.casual / 7) * 100}%` }}
                  ></div>
                </div>
                <div className="leave-details">
                  <span className="leave-type">Casual Leave</span>
                  <span className="leave-count">{leaveStats.leaveBalance.casual} / 7 days</span>
                </div>
              </div>

              <div className="leave-item">
                <div className="leave-progress">
                  <div
                    className="progress-fill medical"
                    style={{ width: `${(leaveStats.leaveBalance.medical / 21) * 100}%` }}
                  ></div>
                </div>
                <div className="leave-details">
                  <span className="leave-type">Medical Leave</span>
                  <span className="leave-count">{leaveStats.leaveBalance.medical} / 21 days</span>
                </div>
              </div>

              <div className="leave-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Leaves</span>
                  <span className="summary-value">42 days</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Remaining</span>
                  <span className="summary-value">{leaveStats.leaveBalance.remaining} days</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Taken</span>
                  <span className="summary-value">{leaveStats.leaveBalance.taken.total} days</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="leave-chart-card">
          <h2 className="card-title">Leave History</h2>

          {leaveStats && (
            <div className="leave-chart">
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
                  {leaveStats.monthlyStats[chartMonth].fullDay > 0 && (
                    <div
                      className="chart-bar full-day"
                      style={{ height: `${leaveStats.monthlyStats[chartMonth].fullDay * 20}px` }}
                    >
                      <span className="bar-value">{leaveStats.monthlyStats[chartMonth].fullDay}</span>
                    </div>
                  )}

                  {leaveStats.monthlyStats[chartMonth].halfDay > 0 && (
                    <div
                      className="chart-bar half-day"
                      style={{ height: `${leaveStats.monthlyStats[chartMonth].halfDay * 20}px` }}
                    >
                      <span className="bar-value">{leaveStats.monthlyStats[chartMonth].halfDay}</span>
                    </div>
                  )}

                  {leaveStats.monthlyStats[chartMonth].fullDay === 0 &&
                    leaveStats.monthlyStats[chartMonth].halfDay === 0 && (
                      <div className="no-data">No leave taken this month</div>
                    )}
                </div>

                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color full-day"></span>
                    <span className="legend-label">Full Day</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color half-day"></span>
                    <span className="legend-label">Half Day</span>
                  </div>
                </div>
              </div>

              <div className="chart-comparison">
                <h4 className="comparison-title">Comparison with Previous Year</h4>
                <div className="comparison-bars">
                  <div className="comparison-group">
                    <div className="comparison-label">Current Year</div>
                    <div className="comparison-bar">
                      <div
                        className="bar-fill current"
                        style={{
                          width: `${
                            (leaveStats.monthlyStats[chartMonth].fullDay +
                              leaveStats.monthlyStats[chartMonth].halfDay * 0.5) *
                            10
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="comparison-value">
                      {leaveStats.monthlyStats[chartMonth].fullDay + leaveStats.monthlyStats[chartMonth].halfDay * 0.5}{" "}
                      days
                    </div>
                  </div>

                  <div className="comparison-group">
                    <div className="comparison-label">Previous Year</div>
                    <div className="comparison-bar">
                      <div
                        className="bar-fill previous"
                        style={{
                          width: `${
                            (leaveStats.prevMonthlyStats[chartMonth].fullDay +
                              leaveStats.prevMonthlyStats[chartMonth].halfDay * 0.5) *
                            10
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="comparison-value">
                      {leaveStats.prevMonthlyStats[chartMonth].fullDay +
                        leaveStats.prevMonthlyStats[chartMonth].halfDay * 0.5}{" "}
                      days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="leave-requests-section">
        <h2 className="section-title">My Leave Requests</h2>

        {leaves.length === 0 ? (
          <div className="no-leaves">
            You haven't applied for any leave yet. Click "Apply for Leave" to get started.
          </div>
        ) : (
          <div className="leave-table-container">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      <span className={`leave-type ${leave.leaveType.toLowerCase()}`}>{leave.leaveType}</span>
                    </td>
                    <td>
                      {leave.duration} {leave.duration === 1 ? "day" : "days"}
                      {leave.halfDay && " (Half day)"}
                    </td>
                    <td>
                      <div className="leave-dates">
                        <div>From: {new Date(leave.startDate).toLocaleDateString()}</div>
                        <div>To: {new Date(leave.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td>
                      <div className="leave-reason">{leave.reason}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${leave.status.toLowerCase()}`}>{leave.status}</span>
                      {leave.status === "Rejected" && leave.rejectionReason && (
                        <div className="rejection-reason">Reason: {leave.rejectionReason}</div>
                      )}
                    </td>
                    <td>
                      {leave.status === "Pending" ? (
                        <div className="leave-actions">
                          <button onClick={() => setSelectedLeave(leave)} className="edit-button">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteLeave(leave._id)} className="delete-button">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="processed-info">
                          {leave.status === "Approved" ? "Approved" : "Rejected"} on{" "}
                          {leave.approvedDate ? new Date(leave.approvedDate).toLocaleDateString() : "N/A"}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showApplyForm && <LeaveApplicationForm onSubmit={handleApplyLeave} onCancel={() => setShowApplyForm(false)} />}

      {selectedLeave && (
        <LeaveApplicationForm
          leave={selectedLeave}
          onSubmit={(data) => handleUpdateLeave(selectedLeave._id, data)}
          onCancel={() => setSelectedLeave(null)}
        />
      )}
    </div>
  )
}

const LeaveApplicationForm = ({ leave, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    leaveType: leave?.leaveType || "Annual",
    startDate: leave?.startDate ? new Date(leave.startDate).toISOString().split("T")[0] : "",
    endDate: leave?.endDate ? new Date(leave.endDate).toISOString().split("T")[0] : "",
    halfDay: leave?.halfDay || false,
    reason: leave?.reason || "",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="leave-form-overlay">
      <div className="leave-form-container">
        <div className="form-header">
          <h2 className="form-title">{leave ? "Edit Leave Application" : "Apply for Leave"}</h2>
          <button onClick={onCancel} className="close-button">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Annual">Annual Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Medical">Medical Leave</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="halfDay"
                checked={formData.halfDay}
                onChange={handleChange}
                className="checkbox-input"
              />
              Half Day
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {leave ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StaffLeaveManagement
