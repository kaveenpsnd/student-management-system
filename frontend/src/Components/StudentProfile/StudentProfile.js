"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "../../styles/student-profile.css"
// Add import for DeleteConfirmationModal at the top of the file
import DeleteConfirmationModal from "../common/DeleteConfirmationModal"
import { studentService } from "../../services/studentService"
import { useToast } from "../../hooks/use-toast"

const StudentProfile = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [student, setStudent] = useState(null)
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 })
  const [activeTab, setActiveTab] = useState("personal")
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Add state for delete confirmation modal inside the component, after other useState declarations
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student data
        const studentResponse = await axios.get(`http://localhost:5000/student/${studentId}`)
        setStudent(studentResponse.data)

        // Set enrolled courses based on subjects
        if (studentResponse.data.subjects && studentResponse.data.subjects.length > 0) {
          // If subjects is a string, convert to array
          const subjectsArray =
            typeof studentResponse.data.subjects === "string"
              ? studentResponse.data.subjects.split(",").map((s) => s.trim())
              : studentResponse.data.subjects

          const courses = subjectsArray.map((subject) => ({
            name: subject,
            professor: getProfessorForSubject(subject),
            schedule: getScheduleForSubject(subject),
          }))

          setEnrolledCourses(courses)
        }

        // Fetch attendance stats
        try {
          const attendanceResponse = await axios.get(`http://localhost:5000/attendance/stats/${studentId}`)
          setAttendanceStats(attendanceResponse.data)
        } catch (err) {
          console.error("Error fetching attendance stats:", err)
          // If API doesn't exist yet, calculate from attendance records
          try {
            const attendanceRecordsResponse = await axios.get(`http://localhost:5000/attendance/student/${studentId}`)
            const records = attendanceRecordsResponse.data

            if (records && records.length > 0) {
              const presentCount = records.filter((record) => record.status === "present").length
              const totalCount = records.length

              setAttendanceStats({
                present: Math.round((presentCount / totalCount) * 100),
                absent: Math.round(((totalCount - presentCount) / totalCount) * 100),
              })
            } else {
              // Default if no records found
              setAttendanceStats({ present: 0, absent: 0 })
            }
          } catch (recordsErr) {
            console.error("Error fetching attendance records:", recordsErr)
            setAttendanceStats({ present: 0, absent: 0 })
          }
        }

        // Fetch attendance records
        try {
          const attendanceRecordsResponse = await axios.get(`http://localhost:5000/attendance/student/${studentId}`)
          setAttendanceRecords(attendanceRecordsResponse.data.slice(0, 5)) // Show only the last 5 records
        } catch (err) {
          console.error("Error fetching attendance records:", err)
          setAttendanceRecords([])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching student details:", error)
        setError("Failed to load student data. Please try again later.")
        setLoading(false)
      }
    }
    fetchData()
  }, [studentId])

  const handleDeleteStudent = async () => {
    try {
      await studentService.deleteStudent(studentId)
      toast({
        title: "Success",
        description: "Student deleted successfully",
        variant: "success",
      })
      navigate("/student-profiles")
    } catch (error) {
      console.error("Error deleting student:", error)
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper functions to generate professor names and schedules
  const getProfessorForSubject = (subject) => {
    const professors = {
      Mathematics: "Prof. Robert Wilson",
      Science: "Prof. Emily Brown",
      English: "Prof. James Smith",
      History: "Prof. Sarah Johnson",
      IT: "Prof. Michael Chen",
    }

    return professors[subject] || "Prof. " + subject
  }

  const getScheduleForSubject = (subject) => {
    const schedules = {
      Mathematics: "Mon, Wed, Fri",
      Science: "Tue, Thu",
      English: "Mon, Wed",
      History: "Tue, Fri",
      IT: "Wed, Thu",
    }

    return schedules[subject] || "Mon, Wed"
  }

  // Handle quick action buttons
  const handleUpdateInfo = () => {
    navigate(`/student-profiles/edit/${studentId}`)
  }

  const handleDownloadReport = () => {
    // Create CSV content
    const csvContent = `Student Report
Student ID: ${student.studentId}
Name: ${student.firstName} ${student.lastName}
Grade: ${student.grade}
Section: ${student.section}
Academic Year: ${student.academicYear}

Attendance:
Present: ${attendanceStats.present}%
Absent: ${attendanceStats.absent}%

Subjects:
${enrolledCourses.map((course) => `${course.name} - ${course.professor} (${course.schedule})`).join("\n")}

Report generated on: ${new Date().toLocaleString()}
`

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `student_report_${student.studentId}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleContactParent = () => {
    window.location.href = `mailto:${student.emailAddress}?subject=Regarding ${student.firstName} ${student.lastName} (${student.studentId})&body=Dear ${student.guardianName},%0D%0A%0D%0AI am writing to discuss ${student.firstName}'s academic progress.%0D%0A%0D%0ARegards,%0D%0ASchool Administration`
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading student profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>{error}</div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: "center", padding: "2rem" }}>Student not found</div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-title">
          <svg className="header-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#333" />
            <path d="M2 17L12 22L22 17" stroke="#333" strokeWidth="2" />
            <path d="M2 12L12 17L22 12" stroke="#333" strokeWidth="2" />
          </svg>
          <h1 className="header-text">Student Profile</h1>
        </div>
        {/* Add delete button to the header-actions div */}
        <div className="header-actions">
          <svg className="header-icon-button" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#333"
              strokeWidth="2"
            />
            <path d="M12 6V12L16 14" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="user-avatar">
            {student.photo ? (
              <img src={`http://localhost:5000${student.photo}`} alt={student.firstName} />
            ) : (
              <span>{student.firstName.charAt(0)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="student-info-card">
        <div className="student-info-content">
          <div className="student-avatar">
            {student.photo ? (
              <img src={`http://localhost:5000${student.photo}`} alt={student.firstName} />
            ) : (
              student.firstName.charAt(0)
            )}
          </div>
          <div className="student-details">
            <h2 className="student-name">
              {student.firstName} {student.lastName}
            </h2>
            <p className="student-id">Student ID: {student.studentId}</p>
            <p className="student-class">
              {student.grade} - {student.section}
            </p>
          </div>
          <Link to={`/exam-results/${studentId}`} className="exam-results-button">
            View Exam Results
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <div className="tabs-list">
          <button
            onClick={() => setActiveTab("personal")}
            className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`tab-button ${activeTab === "attendance" ? "active" : ""}`}
          >
            Attendance Record
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "personal" ? (
        <div className="profile-content">
          {/* Personal Details */}
          <div className="profile-card">
            <h3 className="card-title">Personal Details</h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" value={`${student.firstName} ${student.lastName}`} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="text"
                value={new Date(student.dateOfBirth).toLocaleDateString()}
                readOnly
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="text" value={student.emailAddress} readOnly className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" value={student.contactNumber} readOnly className="form-input" />
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="profile-card">
            <h3 className="card-title">Attendance Overview</h3>

            <div className="progress-container">
              <div className="progress-header">
                <span className="progress-label">Present</span>
                <span className="progress-value">{attendanceStats.present}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill present" style={{ width: `${attendanceStats.present}%` }}></div>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-header">
                <span className="progress-label">Absent</span>
                <span className="progress-value">{attendanceStats.absent}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill absent" style={{ width: `${attendanceStats.absent}%` }}></div>
              </div>
            </div>

            <div className="quick-actions">
              <h4 className="quick-actions-title">Quick Actions</h4>
              <button className="action-button" onClick={handleUpdateInfo}>
                <span>Update Information</span>
                <span className="action-icon">✏️</span>
              </button>
              <button className="action-button" onClick={handleDownloadReport}>
                <span>Download Report</span>
                <span className="action-icon">📥</span>
              </button>
              <button className="action-button" onClick={handleContactParent}>
                <span>Contact Parent</span>
                <span className="action-icon">✉️</span>
              </button>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="profile-card courses-card">
            <h3 className="card-title">Enrolled Courses</h3>
            <div className="courses-list">
              {enrolledCourses && enrolledCourses.length > 0 ? (
                enrolledCourses.map((course, index) => (
                  <div key={index} className="course-item">
                    <div className="course-name">{course.name}</div>
                    <div className="course-professor">{course.professor}</div>
                    <div className="course-schedule">{course.schedule}</div>
                  </div>
                ))
              ) : (
                <div className="no-courses">No courses enrolled</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="attendance-table-container">
          <h3 className="card-title">Attendance Record</h3>
          <p className="attendance-description">Detailed attendance information for the current academic year.</p>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          record.status === "present" ? "present" : record.status === "absent" ? "absent" : "late"
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="attendance-notes">{record.notes || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-records">
                    No attendance records found for this student.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Delete button at the bottom */}
      <div className="delete-button-container">
        <button onClick={() => setShowDeleteModal(true)} className="delete-student-button">
          <svg className="delete-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete Student Record
        </button>
      </div>

      {/* Add the DeleteConfirmationModal at the end of the component, just before the final closing div */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          title="Delete Student"
          message="Are you sure you want to delete this student?"
          onConfirm={handleDeleteStudent}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default StudentProfile
