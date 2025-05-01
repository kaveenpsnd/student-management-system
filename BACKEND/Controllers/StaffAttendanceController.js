const StaffAttendance = require("../Models/StaffAttendanceModel")
const Staff = require("../Models/StaffModel")

// Mark attendance (check-in)
exports.markAttendance = async (req, res) => {
  try {
    const { staffId, rfidCardId } = req.body

    // Find staff member
    const staff = await Staff.findById(staffId)
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      })
    }

    // Check if attendance already marked for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingAttendance = await StaffAttendance.findOne({
      staffId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today",
      })
    }

    // Create new attendance record
    const newAttendance = new StaffAttendance({
      staffId,
      date: today,
      checkIn: new Date(),
      rfidCardId,
      status: "Present",
    })

    await newAttendance.save()

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: newAttendance,
    })
  } catch (error) {
    console.error("Error marking attendance:", error)
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    })
  }
}

// Mark exit (check-out)
exports.markExit = async (req, res) => {
  try {
    const { staffId, rfidCardId } = req.body

    // Find today's attendance record
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const attendance = await StaffAttendance.findOne({
      staffId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No check-in record found for today",
      })
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Check-out already recorded for today",
      })
    }

    // Update attendance record with check-out time
    const checkOut = new Date()

    // Calculate working hours
    const checkInTime = new Date(attendance.checkIn)
    const workingHours = (checkOut - checkInTime) / (1000 * 60 * 60) // Convert milliseconds to hours

    attendance.checkOut = checkOut
    attendance.workingHours = Number.parseFloat(workingHours.toFixed(2))

    // Update status based on working hours
    if (workingHours < 4) {
      attendance.status = "Half-Day"
    }

    await attendance.save()

    res.status(200).json({
      success: true,
      message: "Exit marked successfully",
      data: attendance,
    })
  } catch (error) {
    console.error("Error marking exit:", error)
    res.status(500).json({
      success: false,
      message: "Failed to mark exit",
      error: error.message,
    })
  }
}

// Get staff attendance
exports.getStaffAttendance = async (req, res) => {
  try {
    const { staffId } = req.params
    const { month, year } = req.query

    const query = { staffId }

    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
      const endDate = new Date(Number.parseInt(year), Number.parseInt(month), 0)

      query.date = {
        $gte: startDate,
        $lte: endDate,
      }
    }

    const attendance = await StaffAttendance.find(query).sort({ date: -1 })

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    })
  } catch (error) {
    console.error("Error fetching staff attendance:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch staff attendance",
      error: error.message,
    })
  }
}

// Get today's attendance for a staff member
exports.getTodayAttendance = async (req, res) => {
  try {
    const { staffId } = req.params

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const attendance = await StaffAttendance.findOne({
      staffId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No attendance record found for today",
      })
    }

    res.status(200).json({
      success: true,
      data: attendance,
    })
  } catch (error) {
    console.error("Error fetching today's attendance:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's attendance",
      error: error.message,
    })
  }
}

// Get staff attendance report
exports.getStaffAttendanceReport = async (req, res) => {
  try {
    const { staffId } = req.params
    const { startDate, endDate } = req.query

    const query = { staffId }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    const attendance = await StaffAttendance.find(query).sort({ date: 1 })

    // Calculate statistics
    const totalDays = attendance.length
    const presentDays = attendance.filter((a) => a.status === "Present").length
    const halfDays = attendance.filter((a) => a.status === "Half-Day").length
    const absentDays = attendance.filter((a) => a.status === "Absent").length
    const lateDays = attendance.filter((a) => a.status === "Late").length
    const totalWorkingHours = attendance.reduce((sum, a) => sum + (a.workingHours || 0), 0)

    res.status(200).json({
      success: true,
      data: {
        attendance,
        statistics: {
          totalDays,
          presentDays,
          halfDays,
          absentDays,
          lateDays,
          totalWorkingHours: Number.parseFloat(totalWorkingHours.toFixed(2)),
          averageWorkingHours: Number.parseFloat((totalWorkingHours / totalDays).toFixed(2)) || 0,
        },
      },
    })
  } catch (error) {
    console.error("Error generating staff attendance report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate staff attendance report",
      error: error.message,
    })
  }
}

// Get monthly attendance report
exports.getMonthlyAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.params
    const monthNum = Number.parseInt(month) - 1 // JavaScript months are 0-indexed
    const yearNum = Number.parseInt(year)

    const startDate = new Date(yearNum, monthNum, 1)
    const endDate = new Date(yearNum, monthNum + 1, 0) // Last day of month

    const attendance = await StaffAttendance.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("staffId", "staffId fullName staffType")

    // Group by staff member
    const staffMap = new Map()

    attendance.forEach((record) => {
      const staffId = record.staffId._id.toString()

      if (!staffMap.has(staffId)) {
        staffMap.set(staffId, {
          staffId: record.staffId.staffId,
          fullName: record.staffId.fullName,
          staffType: record.staffId.staffType,
          presentDays: 0,
          halfDays: 0,
          absentDays: 0,
          lateDays: 0,
          totalWorkingHours: 0,
        })
      }

      const staffData = staffMap.get(staffId)

      if (record.status === "Present") staffData.presentDays++
      else if (record.status === "Half-Day") staffData.halfDays++
      else if (record.status === "Absent") staffData.absentDays++
      else if (record.status === "Late") staffData.lateDays++

      staffData.totalWorkingHours += record.workingHours || 0
    })

    const reportData = Array.from(staffMap.values()).map((staff) => ({
      ...staff,
      totalWorkingHours: Number.parseFloat(staff.totalWorkingHours.toFixed(2)),
    }))

    res.status(200).json({
      success: true,
      month: monthNum + 1,
      year: yearNum,
      data: reportData,
    })
  } catch (error) {
    console.error("Error generating monthly attendance report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate monthly attendance report",
      error: error.message,
    })
  }
}

// Get annual attendance report
exports.getAnnualAttendanceReport = async (req, res) => {
  try {
    const { year } = req.params
    const yearNum = Number.parseInt(year)

    const startDate = new Date(yearNum, 0, 1)
    const endDate = new Date(yearNum, 11, 31)

    const attendance = await StaffAttendance.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("staffId", "staffId fullName staffType")

    // Group by staff member
    const staffMap = new Map()

    attendance.forEach((record) => {
      const staffId = record.staffId._id.toString()

      if (!staffMap.has(staffId)) {
        staffMap.set(staffId, {
          staffId: record.staffId.staffId,
          fullName: record.staffId.fullName,
          staffType: record.staffId.staffType,
          presentDays: 0,
          halfDays: 0,
          absentDays: 0,
          lateDays: 0,
          totalWorkingHours: 0,
          monthlyHours: Array(12).fill(0),
        })
      }

      const staffData = staffMap.get(staffId)
      const month = new Date(record.date).getMonth()

      if (record.status === "Present") staffData.presentDays++
      else if (record.status === "Half-Day") staffData.halfDays++
      else if (record.status === "Absent") staffData.absentDays++
      else if (record.status === "Late") staffData.lateDays++

      staffData.totalWorkingHours += record.workingHours || 0
      staffData.monthlyHours[month] += record.workingHours || 0
    })

    const reportData = Array.from(staffMap.values()).map((staff) => ({
      ...staff,
      totalWorkingHours: Number.parseFloat(staff.totalWorkingHours.toFixed(2)),
      monthlyHours: staff.monthlyHours.map((hours) => Number.parseFloat(hours.toFixed(2))),
    }))

    res.status(200).json({
      success: true,
      year: yearNum,
      data: reportData,
    })
  } catch (error) {
    console.error("Error generating annual attendance report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate annual attendance report",
      error: error.message,
    })
  }
}

// Get top performers based on attendance
exports.getTopPerformers = async (req, res) => {
  try {
    const { year, month, limit = 5 } = req.query

    let startDate, endDate

    if (year && month) {
      // Monthly top performers
      startDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
      endDate = new Date(Number.parseInt(year), Number.parseInt(month), 0)
    } else if (year) {
      // Annual top performers
      startDate = new Date(Number.parseInt(year), 0, 1)
      endDate = new Date(Number.parseInt(year), 11, 31)
    } else {
      // Current year by default
      const currentYear = new Date().getFullYear()
      startDate = new Date(currentYear, 0, 1)
      endDate = new Date(currentYear, 11, 31)
    }

    // Aggregate attendance data
    const attendanceData = await StaffAttendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$staffId",
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
            },
          },
          totalWorkingHours: { $sum: "$workingHours" },
        },
      },
      {
        $lookup: {
          from: "staffs", // Collection name (mongoose automatically pluralizes model name)
          localField: "_id",
          foreignField: "_id",
          as: "staffInfo",
        },
      },
      {
        $unwind: "$staffInfo",
      },
      {
        $project: {
          staffId: "$staffInfo.staffId",
          fullName: "$staffInfo.fullName",
          staffType: "$staffInfo.staffType",
          photo: "$staffInfo.photo",
          totalDays: 1,
          presentDays: 1,
          totalWorkingHours: 1,
          attendancePercentage: {
            $multiply: [{ $divide: ["$presentDays", "$totalDays"] }, 100],
          },
        },
      },
      {
        $sort: { attendancePercentage: -1 },
      },
      {
        $limit: Number.parseInt(limit),
      },
    ])

    // Format the results
    const topPerformers = attendanceData.map((staff) => ({
      ...staff,
      totalWorkingHours: Number.parseFloat(staff.totalWorkingHours.toFixed(2)),
      attendancePercentage: Number.parseFloat(staff.attendancePercentage.toFixed(2)),
    }))

    res.status(200).json({
      success: true,
      data: topPerformers,
    })
  } catch (error) {
    console.error("Error fetching top performers:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch top performers",
      error: error.message,
    })
  }
}

// Get staff attendance chart data
exports.getStaffAttendanceChart = async (req, res) => {
  try {
    const { staffId } = req.params
    const { year } = req.query
    const yearNum = Number.parseInt(year) || new Date().getFullYear()

    const startDate = new Date(yearNum, 0, 1)
    const endDate = new Date(yearNum, 11, 31)

    const attendance = await StaffAttendance.find({
      staffId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 })

    // Group by month
    const monthlyData = Array(12)
      .fill(0)
      .map(() => ({
        present: 0,
        halfDay: 0,
        absent: 0,
        late: 0,
        workingHours: 0,
      }))

    attendance.forEach((record) => {
      const month = new Date(record.date).getMonth()

      if (record.status === "Present") monthlyData[month].present++
      else if (record.status === "Half-Day") monthlyData[month].halfDay++
      else if (record.status === "Absent") monthlyData[month].absent++
      else if (record.status === "Late") monthlyData[month].late++

      monthlyData[month].workingHours += record.workingHours || 0
    })

    // Format working hours to 2 decimal places
    monthlyData.forEach((month) => {
      month.workingHours = Number.parseFloat(month.workingHours.toFixed(2))
    })

    res.status(200).json({
      success: true,
      year: yearNum,
      data: monthlyData,
    })
  } catch (error) {
    console.error("Error generating staff attendance chart:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate staff attendance chart",
      error: error.message,
    })
  }
}
