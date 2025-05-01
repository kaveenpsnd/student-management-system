const express = require("express")
const router = express.Router()
const AttendanceController = require("../Controllers/AttendanceController")

// Staff attendance routes
router.post("/mark", AttendanceController.markAttendance)
router.get("/staff/:id", AttendanceController.getStaffAttendance)

// Admin attendance routes
router.post("/manual", AttendanceController.manualAttendance)
router.get("/", AttendanceController.getAllAttendance)
router.get("/report", AttendanceController.generateAttendanceReport)

module.exports = router
