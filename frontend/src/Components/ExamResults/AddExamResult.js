"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"

const AddExamResult = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    examName: "",
    term: "",
    year: new Date().getFullYear().toString(),
    subjects: [{ name: "", score: "", grade: "", remarks: "" }],
    teacherRemarks: "",
  })

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/student/${studentId}`)
        setStudent(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching student details:", error)
        setLoading(false)
      }
    }
    fetchStudent()
  }, [studentId])

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Calculate total and average scores
    const { totalScore, averageScore } = calculateTotalAndAverage()

    // Prepare data for submission
    const resultData = {
      ...formData,
      studentId,
      totalScore,
      averageScore,
      rank: 0, // This would typically be calculated on the server
      subjects: formData.subjects.filter((subject) => subject.name.trim() !== ""),
    }

    try {
      // Assuming there's an API endpoint for adding exam results
      await axios.post(`http://localhost:5000/exam-results`, resultData)
      alert("Exam result added successfully!")
      navigate(`/exam-results/${studentId}`)
    } catch (error) {
      console.error("Error adding exam result:", error)
      alert("Failed to add exam result. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Student not found. The student may have been deleted or you don't have permission to view this profile.
      </div>
    )
  }

  const { totalScore, averageScore } = calculateTotalAndAverage()

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/exam-results/${studentId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Exam Results
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
          <h1 className="text-xl font-bold text-white">
            Add New Exam Result for {student.firstName} {student.lastName}
          </h1>
          <p className="text-purple-100">
            Student ID: {student.studentId} | {student.grade}, {student.section}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
              <input
                type="text"
                name="examName"
                value={formData.examName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Midterm Examination"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Term</option>
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Subjects */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Subjects</h3>
              <button
                type="button"
                onClick={addSubject}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.subjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Subject name"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={subject.score}
                          onChange={(e) => handleSubjectChange(index, "score", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="0-100"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={subject.grade}
                          onChange={(e) => handleSubjectChange(index, "grade", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Grade"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={subject.remarks}
                          onChange={(e) => handleSubjectChange(index, "remarks", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Remarks"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-3">
                        {formData.subjects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSubject(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
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
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Total Score</p>
              <p className="text-xl font-semibold">{totalScore}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Average Score</p>
              <p className="text-xl font-semibold">{averageScore}</p>
            </div>
          </div>

          {/* Teacher Remarks */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher's Remarks</label>
            <textarea
              name="teacherRemarks"
              value={formData.teacherRemarks}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add your comments about the student's performance"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Exam Result
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExamResult

