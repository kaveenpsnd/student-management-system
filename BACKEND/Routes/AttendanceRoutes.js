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
router.post("/", AttendanceController.saveStudentAttendance)


// ===== Staff Attendance Routes =====
// Mark staff attendance
router.post("/staff/rfid", AttendanceController.markStaffAttendance)

// Manual staff attendance entry
router.post("/staff/manual", AttendanceController.manualStaffAttendance)

// Get staff attendance records
router.get("/staff/:staffId", AttendanceController.getStaffAttendance)

// Admin retrieves all attendance records
router.get("/", AttendanceController.getAllAttendance)

// Generate a full attendance report
router.get("/report", AttendanceController.generateAttendanceReport)

module.exports = router
