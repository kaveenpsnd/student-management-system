"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import "../../styles/exam-form.css"

const EditExamResult = () => {
  const { studentId, resultId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    examName: "",
    term: "",
    year: "",
    subjects: [{ name: "", score: "", grade: "", remarks: "" }],
    teacherRemarks: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student details
        const studentResponse = await axios.get(`http://localhost:5000/student/${studentId}`)
        setStudent(studentResponse.data)

        // Fetch exam result details
        try {
          const resultResponse = await axios.get(`http://localhost:5000/exam-results/${resultId}`)
          setFormData(resultResponse.data)
        } catch (error) {
          console.log("Using mock exam result data")
          // Mock data if API doesn't exist yet
          setFormData({
            examName: "Midterm Examination",
            term: "First Term",
            year: "2023",
            subjects: [
              { name: "Mathematics", score: 85, grade: "A", remarks: "Excellent" },
              { name: "Science", score: 78, grade: "B", remarks: "Good" },
              { name: "English", score: 92, grade: "A+", remarks: "Outstanding" },
              { name: "Social Studies", score: 75, grade: "B", remarks: "Good" },
            ],
            totalScore: 330,
            averageScore: 82.5,
            rank: 5,
            teacherRemarks: "Good performance. Keep it up!",
          })
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [studentId, resultId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects]
    updatedSubjects[index][field] = value

    // Auto-calculate grade based on score
    if (field === "score") {
      const score = Number.parseInt(value)
      let grade = ""
      let remarks = ""

      if (score >= 90) {
        grade = "A+"
        remarks = "Outstanding"
      } else if (score >= 80) {
        grade = "A"
        remarks = "Excellent"
      } else if (score >= 75) {
        grade = "B+"
        remarks = "Very Good"
      } else if (score >= 70) {
        grade = "B"
        remarks = "Good"
      } else if (score >= 65) {
        grade = "C+"
        remarks = "Above Average"
      } else if (score >= 60) {
        grade = "C"
        remarks = "Average"
      } else if (score >= 55) {
        grade = "D+"
        remarks = "Below Average"
      } else if (score >= 50) {
        grade = "D"
        remarks = "Pass"
      } else {
        grade = "F"
        remarks = "Fail"
      }

      updatedSubjects[index].grade = grade
      updatedSubjects[index].remarks = remarks
    }

    setFormData({ ...formData, subjects: updatedSubjects })
  }

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: "", score: "", grade: "", remarks: "" }],
    })
  }

  const removeSubject = (index) => {
    const updatedSubjects = [...formData.subjects]
    updatedSubjects.splice(index, 1)
    setFormData({ ...formData, subjects: updatedSubjects })
  }

  const calculateTotalAndAverage = () => {
    const validScores = formData.subjects
      .filter((subject) => subject.name && !isNaN(Number.parseInt(subject.score)))
      .map((subject) => Number.parseInt(subject.score))

    const totalScore = validScores.reduce((sum, score) => sum + score, 0)
    const averageScore = validScores.length > 0 ? (totalScore / validScores.length).toFixed(2) : 0

    return { totalScore, averageScore }
  }

  // Update the handleSubmit function to match the expected backend format
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Calculate total and average scores
    const { totalScore, averageScore } = calculateTotalAndAverage()

    // Format subjects to match the backend model
    const formattedSubjects = formData.subjects
      .filter((subject) => subject.name.trim() !== "")
      .map((subject) => ({
        name: subject.name,
        marksObtained: Number.parseInt(subject.score),
        maximumMarks: 100,
        grade: subject.grade,
        status: subject.remarks,
      }))

    // Prepare data for submission
    const resultData = {
      studentId,
      examName: formData.examName,
      term: formData.term,
      year: formData.year,
      subjects: formattedSubjects,
      totalMarks: totalScore,
      maximumTotalMarks: formattedSubjects.length * 100,
      percentage: formattedSubjects.length > 0 ? ((totalScore / (formattedSubjects.length * 100)) * 100).toFixed(2) : 0,
      finalGrade: calculateFinalGrade(averageScore),
      teacherRemarks: formData.teacherRemarks,
    }

    try {
      // Send the formatted data to the API
      await axios.put(`http://localhost:5000/exam-results/${resultId}`, resultData)
      alert("Exam result updated successfully!")
      navigate(`/exam-results/${studentId}`)
    } catch (error) {
      console.error("Error updating exam result:", error)
      alert("Failed to update exam result. Please try again.")
    }
  }

  // Add a helper function to calculate final grade
  const calculateFinalGrade = (averageScore) => {
    const score = Number.parseFloat(averageScore)
    if (score >= 90) return "A+"
    if (score >= 80) return "A"
    if (score >= 75) return "B+"
    if (score >= 70) return "B"
    if (score >= 65) return "C+"
    if (score >= 60) return "C"
    if (score >= 55) return "D+"
    if (score >= 50) return "D"
    return "F"
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="error-message">
        Student not found. The student may have been deleted or you don't have permission to view this profile.
      </div>
    )
  }

  const { totalScore, averageScore } = calculateTotalAndAverage()

  return (
    <div className="exam-form-container">
      {/* Back button */}
      <div className="back-button-container">
        <button onClick={() => navigate(`/exam-results/${studentId}`)} className="back-button">
          <ArrowLeft className="" />
          Back to Exam Results
        </button>
      </div>

      {/* Header */}
      <div className="exam-header-card">
        <div className="exam-header-gradient">
          <h1 className="exam-header-title">
            Edit Exam Result for {student.firstName} {student.lastName}
          </h1>
          <p className="exam-header-subtitle">
            Student ID: {student.studentId} | {student.grade}, {student.section}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="exam-form-card">
        <form onSubmit={handleSubmit} className="exam-form">
          <div className="exam-form-grid">
            <div>
              <label className="exam-form-label">Exam Name</label>
              <input
                type="text"
                name="examName"
                value={formData.examName}
                onChange={handleChange}
                className="exam-form-input"
                placeholder="e.g. Midterm Examination"
                required
              />
            </div>
            <div>
              <label className="exam-form-label">Term</label>
              <select name="term" value={formData.term} onChange={handleChange} className="exam-form-input" required>
                <option value="">Select Term</option>
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>
            <div>
              <label className="exam-form-label">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="exam-form-input"
                required
              />
            </div>
          </div>

          {/* Subjects */}
          <div className="subjects-section">
            <div className="subjects-header">
              <h3 className="subjects-title">Subjects</h3>
              <button type="button" onClick={addSubject} className="add-subject-button">
                <Plus className="" />
                Add Subject
              </button>
            </div>

            <div className="subjects-table-container">
              <table className="subjects-table">
                <thead>
                  <tr>
                    <th className="">Subject</th>
                    <th className="">Score</th>
                    <th className="">Grade</th>
                    <th className="">Remarks</th>
                    <th className="">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.subjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="">
                        <input
                          type="text"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                          className="exam-form-input"
                          placeholder="Subject name"
                          required
                        />
                      </td>
                      <td className="">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={subject.score}
                          onChange={(e) => handleSubjectChange(index, "score", e.target.value)}
                          className="exam-form-input"
                          placeholder="0-100"
                          required
                        />
                      </td>
                      <td className="">
                        <input
                          type="text"
                          value={subject.grade}
                          onChange={(e) => handleSubjectChange(index, "grade", e.target.value)}
                          className="exam-form-input"
                          placeholder="Grade"
                          readOnly
                        />
                      </td>
                      <td className="">
                        <input
                          type="text"
                          value={subject.remarks}
                          onChange={(e) => handleSubjectChange(index, "remarks", e.target.value)}
                          className="exam-form-input"
                          placeholder="Remarks"
                          readOnly
                        />
                      </td>
                      <td className="">
                        {formData.subjects.length > 1 && (
                          <button type="button" onClick={() => removeSubject(index)} className="remove-subject-button">
                            <Trash2 className="" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="exam-summary-grid">
            <div className="summary-card">
              <p className="summary-label">Total Score</p>
              <p className="summary-value">{totalScore}</p>
            </div>
            <div className="summary-card">
              <p className="summary-label">Average Score</p>
              <p className="summary-value">{averageScore}</p>
            </div>
          </div>

          {/* Teacher Remarks */}
          <div className="remarks-field">
            <label className="exam-form-label">Teacher's Remarks</label>
            <textarea
              name="teacherRemarks"
              value={formData.teacherRemarks}
              onChange={handleChange}
              rows="3"
              className="remarks-textarea"
              placeholder="Add your comments about the student's performance"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Update Exam Result
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditExamResult
