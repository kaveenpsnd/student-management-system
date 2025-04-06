"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../styles/student-attendance.css"

const ClassAttendance = () => {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [classes, setClasses] = useState([])

  // Fetch available classes (grades and sections)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/student")
        const allStudents = response.data

        // Extract unique grade-section combinations
        const uniqueClasses = [...new Set(allStudents.map((student) => `${student.grade} - ${student.section}`))].sort()

        setClasses(uniqueClasses)

        // Set default selected class if available
        if (uniqueClasses.length > 0 && !selectedClass) {
          setSelectedClass(uniqueClasses[0])
        }
      } catch (err) {
        console.error("Error fetching classes:", err)
        setError("Failed to load classes. Please try again.")
      }
    }

    fetchClasses()
  }, [selectedClass])

  // Fetch students when class or date changes
  useEffect(() => {
    if (!selectedClass) return

    const fetchStudents = async () => {
      try {
        setLoading(true)

        // Parse grade and section from selected class
        const [grade, section] = selectedClass.split(" - ")

        // Fetch students in the selected class
        const response = await axios.get("http://localhost:5000/student")
        const allStudents = response.data
        const filteredStudents = allStudents.filter(
          (student) => student.grade === grade && student.section === section.trim(),
        )

        // Check if attendance exists for this class and date
        try {
          const attendanceResponse = await axios.get(`http://localhost:5000/attendance/class/${selectedClass}`, {
            params: { date: selectedDate },
          })

          // If attendance exists, use it
          if (attendanceResponse.data && attendanceResponse.data.students) {
            setStudents(attendanceResponse.data.students)
          } else {
            // Otherwise, initialize with default values
            setStudents(
              filteredStudents.map((student) => ({
                ...student,
                status: "present",
                notes: "",
              })),
            )
          }
        } catch (err) {
          // If no attendance record exists, initialize with default values
          setStudents(
            filteredStudents.map((student) => ({
              ...student,
              status: "present",
              notes: "",
            })),
          )
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching students:", err)
        setError("Failed to load students. Please try again.")
        setLoading(false)
      }
    }

    fetchStudents()
  }, [selectedClass, selectedDate])

  const handleStatusChange = (studentId, status) => {
    setStudents(students.map((student) => (student.studentId === studentId ? { ...student, status } : student)))
  }

  const handleNotesChange = (studentId, notes) => {
    setStudents(students.map((student) => (student.studentId === studentId ? { ...student, notes } : student)))
  }

  const handleSaveAttendance = async () => {
    try {
      const attendanceData = {
        class: selectedClass,
        date: selectedDate,
        students: students.map((student) => ({
          studentId: student.studentId,
          status: student.status,
          notes: student.notes,
        })),
      }

      await axios.post("http://localhost:5000/attendance", attendanceData)
      alert("Attendance saved successfully!")
    } catch (err) {
      console.error("Error saving attendance:", err)
      alert("Failed to save attendance. Please try again.")
    }
  }

  const handleDownloadAttendance = () => {
    // Create CSV content
    const headers = ["Student ID", "Name", "Status", "Notes"]
    const rows = students.map((student) => [
      student.studentId,
      `${student.firstName} ${student.lastName}`,
      student.status,
      student.notes,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance_${selectedClass}_${selectedDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate attendance summary
  const summary = {
    total: students.length,
    present: students.filter((s) => s.status === "present").length,
    absent: students.filter((s) => s.status === "absent").length,
    late: students.filter((s) => s.status === "late").length,
  }

  if (error) {
    return <div className="attendance-container">{error}</div>
  }

  return (
    <div className="attendance-container">
      {/* Header */}
      <div className="attendance-header">
        <div className="header-title">
          <svg className="header-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#333" />
            <path d="M2 17L12 22L22 17" stroke="#333" strokeWidth="2" />
            <path d="M2 12L12 17L22 12" stroke="#333" strokeWidth="2" />
          </svg>
          <h1 className="header-text">Class Attendance</h1>
        </div>
        <div className="teacher-name">Ms. Johnson</div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Select Class</label>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="filter-select">
            {classes.length === 0 && <option value="">Loading classes...</option>}
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="attendance-table-container">
        <div className="table-header">
          <h2 className="table-title">Student Attendance</h2>
          <div className="action-buttons">
            <button onClick={handleDownloadAttendance} className="download-button">
              Download Attendance
            </button>
            <button onClick={handleSaveAttendance} className="save-button">
              Save Attendance
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading students...</div>
        ) : (
          <>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th className="radio-cell">Present</th>
                  <th className="radio-cell">Absent</th>
                  <th className="radio-cell">Late</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId}>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {student.photo ? (
                            <img src={`http://localhost:5000${student.photo}`} alt={student.firstName} />
                          ) : (
                            student.firstName.charAt(0)
                          )}
                        </div>
                        <span>
                          {student.firstName} {student.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="radio-cell">
                      <input
                        type="radio"
                        name={`status-${student.studentId}`}
                        checked={student.status === "present"}
                        onChange={() => handleStatusChange(student.studentId, "present")}
                        className="attendance-radio"
                      />
                    </td>
                    <td className="radio-cell">
                      <input
                        type="radio"
                        name={`status-${student.studentId}`}
                        checked={student.status === "absent"}
                        onChange={() => handleStatusChange(student.studentId, "absent")}
                        className="attendance-radio"
                      />
                    </td>
                    <td className="radio-cell">
                      <input
                        type="radio"
                        name={`status-${student.studentId}`}
                        checked={student.status === "late"}
                        onChange={() => handleStatusChange(student.studentId, "late")}
                        className="attendance-radio"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.notes || ""}
                        onChange={(e) => handleNotesChange(student.studentId, e.target.value)}
                        placeholder=""
                        className="notes-input"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="summary-container">
              <div className="total-students">Total Students: {summary.total}</div>
              <div className="attendance-stats">
                <div className="stat-item">Present: {summary.present}</div>
                <div className="stat-item">Absent: {summary.absent}</div>
                <div className="stat-item">Late: {summary.late}</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="footer">Attendance Management System © 2025</div>
    </div>
  )
}

export default ClassAttendance

