const express = require("express")
const router = express.Router()
const ExamResultsController = require("../Controllers/ExamResultsController")

// Get all exam results for a student
router.get("/:studentId", ExamResultsController.getStudentExamResults)

// Get a specific exam result
router.get("/result/:resultId", ExamResultsController.getExamResultById)

// Create a new exam result
router.post("/", ExamResultsController.createExamResult)

// Update an exam result
router.put("/:resultId", ExamResultsController.updateExamResult)

// Delete an exam result
router.delete("/:resultId", ExamResultsController.deleteExamResult)

module.exports = router

