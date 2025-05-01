"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../styles/student-attendance.css"
import { useToast } from "../../hooks/use-toast"

const ClassAttendance = () => {
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [grades, setGrades] = useState([])
  const [sections, setSections] = useState([])
  const { toast } = useToast()

  // Fetch all students and extract grades and sections
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:5000/student")
        const students = response.data

        // Set all students
        setAllStudents(students)

        // Define all available grades and sections
        const allGrades = [
          "Grade 1",
          "Grade 2",
          "Grade 3",
          "Grade 4",
          "Grade 5",
          "Grade 6",
          "Grade 7",
          "Grade 8",
          "Grade 9",
          "Grade 10",
          "Grade 11",
          "Grade 12",
          "Grade 13",
        ]

        const allSections = ["Section A", "Section B", "Section C", "Section D", "Section E", "Section F", "Section G"]

        setGrades(allGrades)
        setSections(allSections)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching students:", err)
        setError("Failed to load students. Please try again.")
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // Filter students when grade or section changes
  useEffect(() => {
    const filterStudents = async () => {
      try {
        // Filter students based on selected grade and section
        let filteredStudents = [...allStudents]

        if (selectedGrade && selectedGrade !== "") {
          filteredStudents = filteredStudents.filter((student) => student.grade === selectedGrade)
        }

        if (selectedSection && selectedSection !== "") {
          filteredStudents = filteredStudents.filter((student) => student.section === selectedSection)
        }

        // Check if attendance exists for this class and date
        const classIdentifier =
          selectedGrade && selectedSection ? `${selectedGrade} - ${selectedSection}` : "All Classes"

        try {
          const attendanceResponse = await axios.get(`http://localhost:5000/attendance/class/${classIdentifier}`, {
            params: { date: selectedDate },
          })

          // If attendance exists, use it
          if (attendanceResponse.data && attendanceResponse.data.students) {
            // Merge attendance data with student details
            const attendanceMap = new Map(attendanceResponse.data.students.map((record) => [record.studentId, record]))

            const studentsWithAttendance = filteredStudents.map((student) => ({
              ...student,
              status: attendanceMap.get(student.studentId)?.status || "present",
              notes: attendanceMap.get(student.studentId)?.notes || "",
            }))

            setStudents(studentsWithAttendance)
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
      } catch (err) {
        console.error("Error filtering students:", err)
        setError("Failed to filter students. Please try again.")
      }
    }

    filterStudents()
  }, [selectedGrade, selectedSection, selectedDate, allStudents])

  const handleStatusChange = (studentId, status) => {
    setStudents(students.map((student) => (student.studentId === studentId ? { ...student, status } : student)))
  }

  const handleNotesChange = (studentId, notes) => {
    setStudents(students.map((student) => (student.studentId === studentId ? { ...student, notes } : student)))
  }

  const handleSaveAttendance = async () => {
    try {
      if (students.length === 0) {
        toast({
          title: "No Students",
          description: "No students found to save attendance for.",
          variant: "warning",
        })
        return
      }

      const classIdentifier = selectedGrade && selectedSection ? `${selectedGrade} - ${selectedSection}` : "All Classes"

      const attendanceData = {
        class: classIdentifier,
        date: selectedDate,
        students: students.map((student) => ({
          studentId: student.studentId,
          status: student.status,
          notes: student.notes,
        })),
      }

      await axios.post("http://localhost:5000/attendance", attendanceData)
      toast({
        title: "Success",
        description: "Attendance saved successfully!",
        variant: "success",
      })
    } catch (err) {
      console.error("Error saving attendance:", err)
      toast({
        title: "Error",
        description: "Failed to save attendance. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadAttendance = () => {
    if (students.length === 0) {
      toast({
        title: "No Students",
        description: "No students to download attendance for.",
        variant: "warning",
      })
      return
    }

    // Create CSV content
    const headers = ["Student ID", "Name", "Status", "Notes"]
    const rows = students.map((student) => [
      student.studentId,
      `${student.firstName || ""} ${student.lastName || ""}`,
      student.status,
      student.notes,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance_${selectedGrade}_${selectedSection}_${selectedDate}.csv`)
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
          <label className="filter-label">Select Grade</label>
          <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="filter-select">
            <option value="">All Grades</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Select Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="filter-select"
          >
            <option value="">All Sections</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
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
        ) : students.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            No students found for the selected grade and section. Please select a different combination.
          </div>
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
                            <img src={`http://localhost:5000${student.photo}`} alt={student.firstName || ""} />
                          ) : student.firstName ? (
                            student.firstName.charAt(0)
                          ) : (
                            "?"
                          )}
                        </div>
                        <span>
                          {student.firstName || "Unknown"} {student.lastName || ""}
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
