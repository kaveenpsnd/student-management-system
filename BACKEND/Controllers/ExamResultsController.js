const ExamResult = require("../Models/ExamResultsModel")
const Student = require("../Models/StudentModel")
const { addRecentActivity } = require("./RecentActivityController")

// Get all exam results for a student
const getStudentExamResults = async (req, res) => {
  try {
    const { studentId } = req.params

    // Verify student exists
    const student = await Student.findOne({ studentId })
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    const examResults = await ExamResult.find({ studentId }).sort({ createdAt: -1 })
    res.status(200).json(examResults)
  } catch (error) {
    console.error("Error fetching exam results:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get a specific exam result by ID
const getExamResultById = async (req, res) => {
  try {
    const { resultId } = req.params
    const examResult = await ExamResult.findById(resultId)

    if (!examResult) {
      return res.status(404).json({ message: "Exam result not found" })
    }

    res.status(200).json(examResult)
  } catch (error) {
    console.error("Error fetching exam result:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create a new exam result
const createExamResult = async (req, res) => {
  try {
    const {
      studentId,
      examName,
      term,
      year,
      subjects,
      totalMarks,
      maximumTotalMarks,
      percentage,
      finalGrade,
      rank,
      teacherRemarks,
    } = req.body

    // Verify student exists
    const student = await Student.findOne({ studentId })
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    const newExamResult = new ExamResult({
      studentId,
      examName,
      term,
      year,
      subjects,
      totalMarks,
      maximumTotalMarks,
      percentage,
      finalGrade,
      rank,
      teacherRemarks,
    })

    await newExamResult.save()

    // Add recent activity
    await addRecentActivity(
      `${student.firstName} ${student.lastName}`,
      `received results for ${examName}`,
      student.photo,
    )

    res.status(201).json({
      message: "Exam result added successfully",
      examResultId: newExamResult._id,
    })
  } catch (error) {
    console.error("Error creating exam result:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update an exam result
const updateExamResult = async (req, res) => {
  try {
    const { resultId } = req.params

    const {
      examName,
      term,
      year,
      subjects,
      totalMarks,
      maximumTotalMarks,
      percentage,
      finalGrade,
      rank,
      teacherRemarks,
    } = req.body

    const examResult = await ExamResult.findById(resultId)

    if (!examResult) {
      return res.status(404).json({ message: "Exam result not found" })
    }

    // Update the exam result
    examResult.examName = examName
    examResult.term = term
    examResult.year = year
    examResult.subjects = subjects
    examResult.totalMarks = totalMarks
    examResult.maximumTotalMarks = maximumTotalMarks
    examResult.percentage = percentage
    examResult.finalGrade = finalGrade
    examResult.rank = rank
    examResult.teacherRemarks = teacherRemarks

    await examResult.save()

    // Get student info for activity
    const student = await Student.findOne({ studentId: examResult.studentId })

    // Add recent activity
    await addRecentActivity(
      `${student.firstName} ${student.lastName}`,
      `had exam results updated for ${examName}`,
      student.photo,
    )

    res.status(200).json({
      message: "Exam result updated successfully",
      examResult,
    })
  } catch (error) {
    console.error("Error updating exam result:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete an exam result
const deleteExamResult = async (req, res) => {
  try {
    const { resultId } = req.params

    const examResult = await ExamResult.findById(resultId)

    if (!examResult) {
      return res.status(404).json({ message: "Exam result not found" })
    }

    // Get student info for activity before deleting
    const student = await Student.findOne({ studentId: examResult.studentId })

    await ExamResult.findByIdAndDelete(resultId)

    // Add recent activity
    await addRecentActivity(
      `${student.firstName} ${student.lastName}`,
      `had exam results deleted for ${examResult.examName}`,
      student.photo,
    )

    res.status(200).json({ message: "Exam result deleted successfully" })
  } catch (error) {
    console.error("Error deleting exam result:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getStudentExamResults,
  getExamResultById,
  createExamResult,
  updateExamResult,
  deleteExamResult,
}
