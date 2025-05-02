const express = require("express")
const router = express.Router()
const AttendanceController = require("../Controllers/StudentAttendanceController")

// Get attendance for a class on a specific date
router.get("/class/:className", AttendanceController.getClassAttendance)

// Get attendance records for a specific student
router.get("/student/:studentId", AttendanceController.getStudentAttendance)

// Get attendance statistics for a student
router.get("/stats/:studentId", AttendanceController.getStudentAttendanceStats)

// Save attendance for a class
router.post("/", AttendanceController.saveAttendance)

module.exports = router
