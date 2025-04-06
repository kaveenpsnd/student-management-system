"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import LoadingSpinner from "../common/LoadingSpinner"
import ErrorMessage from "../common/ErrorMessage"
import "../../styles/student-list.css"

const StudentList = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [gradeFilter, setGradeFilter] = useState("")
  const [sectionFilter, setSectionFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 10

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:5000/student")
        setStudents(response.data)
        setFilteredStudents(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching students:", error)
        setError("Failed to load students. Please try again later.")
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (gradeFilter) {
      filtered = filtered.filter((student) => student.grade === gradeFilter)
    }

    if (sectionFilter) {
      filtered = filtered.filter((student) => student.section === sectionFilter)
    }

    setFilteredStudents(filtered)
    setCurrentPage(1)
  }, [searchTerm, gradeFilter, sectionFilter, students])

  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const exportStudentData = (studentId) => {
    const student = students.find((s) => s.studentId === studentId)
    if (!student) return

    const csvContent = `Student ID,${student.studentId}
First Name,${student.firstName}
Middle Name,${student.middleName || ""}
Last Name,${student.lastName}
Date of Birth,${new Date(student.dateOfBirth).toLocaleDateString()}
Gender,${student.gender}
Grade,${student.grade}
Section,${student.section}
Academic Year,${student.academicYear}
Guardian Name,${student.guardianName}
Relationship,${student.relationship}
Contact Number,${student.contactNumber}
Email Address,${student.emailAddress}`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `student_${student.studentId}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <div>
          <h1 className="student-list-title">Student Profiles</h1>
          <p className="student-list-subtitle">View and manage all enrolled students</p>
        </div>
        <Link to="/student-enrollment" className="enroll-button">
          <span className="enroll-button-icon">👨‍🎓</span>
          Enroll Student
        </Link>
      </div>

      <div className="filters-container">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="filter-select">
          <option value="">All Grades</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Grade 7">Grade 7</option>
          <option value="Grade 8">Grade 8</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Grade 10">Grade 10</option>
        </select>

        <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="filter-select">
          <option value="">All Sections</option>
          <option value="Section A">Section A</option>
          <option value="Section B">Section B</option>
          <option value="Section C">Section C</option>
        </select>
      </div>

      <div className="student-table-container">
        {currentStudents.length > 0 ? (
          <>
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>
                      <div className="student-name-cell">
                        <div className="student-avatar">
                          {student.photo ? (
                            <img src={`http://localhost:5000${student.photo}`} alt={`${student.firstName} ${student.lastName}`} />
                          ) : (
                            <span className="student-initial">
                              {student.firstName.charAt(0)}
                              {student.lastName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="student-name">{`${student.firstName} ${student.lastName}`}</span>
                      </div>
                    </td>
                    <td>{student.grade}</td>
                    <td>{student.section}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/student-profiles/${student.studentId}`} className="view-button">
                          <span className="button-icon">👁️</span>
                          View
                        </Link>
                        <button className="export-button" onClick={() => exportStudentData(student.studentId)}>
                          <span className="button-icon">📥</span>
                          Export
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <div className="pagination-info">
                Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> to{" "}
                <span className="font-medium">{Math.min(indexOfLastStudent, filteredStudents.length)}</span> of{" "}
                <span className="font-medium">{filteredStudents.length}</span> results
              </div>

              <div className="pagination-buttons">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  ◀
                </button>
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  ▶
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">No students found matching your criteria</div>
        )}
      </div>
    </div>
  )
}

export default StudentList
