"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "../../styles/exam-results.css"

const ExamResults = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [examResults, setExamResults] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student data
        const studentResponse = await axios.get(`http://localhost:5000/student/${studentId}`)
        setStudent(studentResponse.data)

        // Fetch exam results
        const examResponse = await axios.get(`http://localhost:5000/exam-results/${studentId}`)

        if (examResponse.data && examResponse.data.length > 0) {
          setExamResults(examResponse.data)
          setSelectedExam(examResponse.data[0]) // Select the first exam by default
        } else {
          setError("No exam results found for this student")
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    fetchData()
  }, [studentId])

  const handleExamChange = (examId) => {
    const selected = examResults.find((exam) => exam._id === examId)
    setSelectedExam(selected)
  }

  const handleDeleteExam = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam result?")) {
      return
    }

    try {
      await axios.delete(`http://localhost:5000/exam-results/${examId}`)
      // Remove the deleted exam from the list
      const updatedExams = examResults.filter((exam) => exam._id !== examId)
      setExamResults(updatedExams)

      // If the deleted exam was selected, select another one
      if (selectedExam._id === examId) {
        setSelectedExam(updatedExams.length > 0 ? updatedExams[0] : null)
      }

      alert("Exam result deleted successfully")
    } catch (error) {
      console.error("Error deleting exam result:", error)
      alert("Failed to delete exam result")
    }
  }

  if (loading) {
    return (
      <div className="results-container">
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading exam results...</div>
      </div>
    )
  }

  if (error && !selectedExam) {
    return (
      <div className="results-container">
        <div className="results-header">
          <div className="header-title">
            <svg className="header-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#333" />
              <path d="M2 17L12 22L22 17" stroke="#333" strokeWidth="2" />
              <path d="M2 12L12 17L22 12" stroke="#333" strokeWidth="2" />
            </svg>
            <h1 className="header-text">Student Exam Results</h1>
          </div>
          <button onClick={() => navigate(`/student-profiles/${studentId}`)} className="back-button">
            ← Back to Student Profile
          </button>
        </div>

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
            </div>
            <div className="class-info">
              <div>
                <p className="class-label">Class</p>
                <p className="class-value">
                  {student.grade}-{student.section}
                </p>
              </div>
              <div className="academic-year">
                <p className="class-label">Academic Year</p>
                <p className="class-value">{student.academicYear}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
          {error}
          <div className="add-exam-button-container">
            <Link to={`/exam-results/${studentId}/add`} className="add-exam-button">
              <span className="add-icon">+</span> Add New Exam Result
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!student || !selectedExam) {
    return (
      <div className="results-container">
        <div style={{ textAlign: "center", padding: "2rem" }}>Student or exam results not found</div>
      </div>
    )
  }

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <div className="header-title">
          <svg className="header-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#333" />
            <path d="M2 17L12 22L22 17" stroke="#333" strokeWidth="2" />
            <path d="M2 12L12 17L22 12" stroke="#333" strokeWidth="2" />
          </svg>
          <h1 className="header-text">Student Exam Results</h1>
        </div>
        <button onClick={() => navigate(`/student-profiles/${studentId}`)} className="back-button">
          ← Back to Student Profile
        </button>
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
          </div>
          <div className="class-info">
            <div>
              <p className="class-label">Class</p>
              <p className="class-value">
                {student.grade}-{student.section}
              </p>
            </div>
            <div className="academic-year">
              <p className="class-label">Academic Year</p>
              <p className="class-value">{selectedExam.year}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Selection and Action Buttons */}
      <div className="exam-actions-container">
        <div className="exam-selector">
          <label htmlFor="exam-select">Select Exam:</label>
          <select
            id="exam-select"
            value={selectedExam._id}
            onChange={(e) => handleExamChange(e.target.value)}
            className="exam-select"
          >
            {examResults.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.examName} - {exam.term} ({exam.year})
              </option>
            ))}
          </select>
        </div>
        <div className="exam-buttons">
          <Link to={`/exam-results/${studentId}/add`} className="add-exam-button">
            <span className="add-icon">+</span> Add New Exam
          </Link>
          <Link to={`/exam-results/${studentId}/edit/${selectedExam._id}`} className="edit-exam-button">
            <span className="edit-icon">✏️</span> Edit Exam
          </Link>
          <button className="delete-exam-button" onClick={() => handleDeleteExam(selectedExam._id)}>
            <span className="delete-icon">🗑️</span> Delete Exam
          </button>
        </div>
      </div>

      {/* Exam Results */}
      <div className="results-card">
        <h3 className="results-title">{selectedExam.examName}</h3>

        <table className="results-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks Obtained</th>
              <th>Maximum Marks</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {selectedExam.subjects.map((subject, index) => (
              <tr key={index}>
                <td className="subject-name">{subject.name}</td>
                <td>{subject.marksObtained || subject.score}</td>
                <td>{subject.maximumMarks || 100}</td>
                <td>{subject.grade}</td>
                <td>
                  <span className="status-badge">{subject.status || subject.remarks || "Pass"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="results-summary">
          <div>
            <p className="total-marks">
              Total Marks: {selectedExam.totalMarks || selectedExam.totalScore}/
              {selectedExam.maximumTotalMarks || selectedExam.subjects.length * 100}
            </p>
            <p className="percentage">Percentage: {selectedExam.percentage || selectedExam.averageScore}%</p>
          </div>
          <div className="final-grade-container">
            <p className="final-grade-label">Final Grade:</p>
            <p className="final-grade">{selectedExam.finalGrade}</p>
          </div>
        </div>

        {selectedExam.teacherRemarks && (
          <div className="teacher-remarks">
            <h4 className="remarks-title">Teacher's Remarks:</h4>
            <p className="remarks-content">{selectedExam.teacherRemarks}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="results-footer">Academic Records 2025 - All rights reserved</div>
    </div>
  )
}

export default ExamResults

