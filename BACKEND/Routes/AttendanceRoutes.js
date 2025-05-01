const express = require("express")
const router = express.Router()
const AttendanceController = require("../Controllers/AttendanceController")

// ===== Student Attendance Routes =====
// Get attendance for a class on a specific date
router.get("/class/:className", AttendanceController.getClassAttendance)

// Get attendance records for a specific student
router.get("/student/:studentId", AttendanceController.getStudentAttendance)

// Get attendance statistics for a student
router.get("/stats/:studentId", AttendanceController.getStudentAttendanceStats)

// Save attendance for a class
router.post("/", AttendanceController.saveAttendance)


// ===== Staff Attendance Routes =====
// Mark staff attendance
router.post("/mark", AttendanceController.markAttendance)

// Get specific staff attendance by ID
router.get("/staff/:id", AttendanceController.getStaffAttendance)

// Admin manually records attendance
router.post("/manual", AttendanceController.manualAttendance)

// Admin retrieves all attendance records
router.get("/", AttendanceController.getAllAttendance)

// Generate a full attendance report
router.get("/report", AttendanceController.generateAttendanceReport)

module.exports = router
