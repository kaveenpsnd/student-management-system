const express = require("express")
const router = express.Router()
const staffAttendanceController = require("../Controllers/StaffAttendanceController")

// Staff attendance routes
router.post("/mark", staffAttendanceController.markAttendance)
router.post("/mark-exit", staffAttendanceController.markExit)
router.get("/staff/:staffId", staffAttendanceController.getStaffAttendance)
router.get("/staff/:staffId/today", staffAttendanceController.getTodayAttendance)
router.get("/report/staff/:staffId", staffAttendanceController.getStaffAttendanceReport)
router.get("/report/monthly/:month/:year", staffAttendanceController.getMonthlyAttendanceReport)
router.get("/report/annual/:year", staffAttendanceController.getAnnualAttendanceReport)
router.get("/top-performers", staffAttendanceController.getTopPerformers)
router.get("/chart/staff/:staffId", staffAttendanceController.getStaffAttendanceChart)

module.exports = router
