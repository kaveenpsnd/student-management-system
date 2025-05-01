const { Attendance, AttendanceSummary } = require("../Models/StaffAttendanceModel")
const Staff = require("../Models/StaffModel")
const { Leave } = require("../Models/LeaveModel")

// Helper function to send SMS notification (mock implementation)
const sendSMS = async (phoneNumber, message) => {
  console.log(`SMS sent to ${phoneNumber}: ${message}`)
  // In a real implementation, you would use a service like Twilio, Nexmo, etc.
  return true
}

// Helper function to calculate working hours
const calculateWorkingHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  
  const checkInTime = new Date(checkIn).getTime()
  const checkOutTime = new Date(checkOut).getTime()
  
  // Calculate difference in milliseconds
  const diff = checkOutTime - checkInTime
  
  // Convert to minutes
  return Math.round(diff / (1000 * 60))
}

// Helper function to update monthly attendance summary
const updateAttendanceSummary = async (staffId, attendanceRecord) => {
  const date = new Date(attendanceRecord.date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // JavaScript months are 0-based
  
  // Find or create attendance summary
  let summary = await AttendanceSummary.findOne({ staffId, year, month })
  
  if (!summary) {
    summary = new AttendanceSummary({
      staffId,
      year,
      month,
    })
  }
  
  // Calculate working days in the month
  const daysInMonth = new Date(year, month, 0).getDate()
  const workingDays = [...Array(daysInMonth).keys()].map(i => new Date(year, month - 1, i + 1))
    .filter(date => date.getDay() !== 0 && date.getDay() !== 6).length
  
  summary.totalWorkingDays = workingDays
  
  // Get all attendance records for this staff in this month
  const attendanceRecords = await Attendance.find({
    staffId,
    date: {
      $gte: new Date(year, month - 1, 1),
      $lte: new Date(year, month, 0),
    },
  })
  
  // Calculate attendance statistics
  let daysPresent = 0
  let daysAbsent = 0
  let daysHalfDay = 0
  let daysOnLeave = 0
  let totalWorkingHours = 0
  let lateCount = 0
  let earlyDepartureCount = 0
  
  attendanceRecords.forEach(record => {
    switch (record.status) {
      case "Present":
        daysPresent++
        totalWorkingHours += record.workingHours
        if (record.checkIn.status === "Late") lateCount++
        if (record.checkOut.status === "Early") earlyDepartureCount++
        break
      case "Absent":
        daysAbsent++
        break
      case "Half-day":
        daysHalfDay++
        totalWorkingHours += record.workingHours
        break
      case "On-leave":
        daysOnLeave++
        break
    }
  })
  
  // Update summary
  summary.daysPresent = daysPresent
  summary.daysAbsent = daysAbsent
  summary.daysHalfDay = daysHalfDay
  summary.daysOnLeave = daysOnLeave
  summary.totalWorkingHours = totalWorkingHours
  summary.averageWorkingHours = daysPresent > 0 ? Math.round(totalWorkingHours / daysPresent) : 0
  summary.lateCount = lateCount
  summary.earlyDepartureCount = earlyDepartureCount
  summary.attendancePercentage = workingDays > 0
    ? Math.round(((daysPresent + daysHalfDay * 0.5 + daysOnLeave) / workingDays) * 100)
    : 0
  
  await summary.save()
  return summary
}

// Mark attendance using RFID
exports.markAttendance = async (req, res) => {
  try {
    const { rfidCardId } = req.body
    
    // Validate input
    if (!rfidCardId) {
      return res.status(400).json({
        success: false,
        message: "RFID card ID is required",
      })
    }
    
    // Find staff by RFID card ID (in a real app, you'd associate RFID with staff)
    // For this example, we'll just find a staff by ID since we don't have RFID field
    const staff = await Staff.findById(req.body.staffId)
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found for this RFID card",
      })
    }
    
    // Get current date (strip time part)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Check if staff is on leave today
    const onLeave = await Leave.findOne({
      staffId: staff._id,
      startDate: { $lte: today },
      endDate: { $gte: today },
      leaveStatus: "Approved",
    })
    
    if (onLeave) {
      return res.status(400).json({
        success: false,
        message: "Cannot mark attendance while on approved leave",
      })
    }
    
    // Find or create today's attendance record
    let attendance = await Attendance.findOne({
      staffId: staff._id,
      date: today,
    })
    
    const currentTime = new Date()
    
    if (!attendance) {
      // Create new attendance record for check-in
      attendance = new Attendance({
        staffId: staff._id,
        date: today,
        checkIn: {
          time: currentTime,
          status: currentTime.getHours() < 9 ? "On-time" : "Late",
        },
        status: "Present",
        rfidCardId,
      })
      
      await attendance.save()
      
      return res.status(201).json({
        success: true,
        message: `Good morning, ${staff.fullName}! Check-in successful at ${currentTime.toLocaleTimeString()}`,
        data: attendance,
      })
    } else {
      // Update existing record for check-out
      if (!attendance.checkOut.time) {
        attendance.checkOut = {
          time: currentTime,
          status: currentTime.getHours() >= 17 ? "On-time" : "Early",
        }
        
        // Calculate working hours
        attendance.workingHours = calculateWorkingHours(
          attendance.checkIn.time,
          currentTime
        )
        
        await attendance.save()
        
        // Update monthly summary
        await updateAttendanceSummary(staff._id, attendance)
        
        return res.status(200).json({
          success: true,
          message: `Goodbye, ${staff.fullName}! Check-out successful at ${currentTime.toLocaleTimeString()}. You worked for ${Math.floor(attendance.workingHours / 60)} hours and ${attendance.workingHours % 60} minutes today.`,
          data: attendance,
        })
      } else {
        return res.status(400).json({
          success: false,
          message: "You have already checked out today",
        })
      }
    }
  } catch (error) {
    console.error("Error marking attendance:", error)
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    })
  }
}

// Manually mark attendance for staff (admin function)
exports.manualAttendance = async (req, res) => {
  try {
    const { staffId, date, checkInTime, checkOutTime, status, remarks } = req.body
    
    // Validate input
    if (!staffId || !date) {
      return res.status(400).json({
        success: false,
        message: "Staff ID and date are required",
      })
    }
    
    // Check if staff exists
    const staff = await Staff.findById(staffId)
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      })
    }
    
    // Parse date
    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)
    
    // Check if record already exists
    let attendance = await Attendance.findOne({
      staffId,
      date: attendanceDate,
    })
    
    if (!attendance) {
      // Create new attendance record
      attendance = new Attendance({
        staffId,
        date: attendanceDate,
        status: status || "Present",
        remarks,
      })
    } else {
      // Update existing record
      attendance.status = status || attendance.status
      attendance.remarks = remarks || attendance.remarks
    }
    
    // Set check-in and check-out times if provided
    if (checkInTime) {
      const [hours, minutes] = checkInTime.split(':').map(Number)
      const checkIn = new Date(attendanceDate)
      checkIn.setHours(hours, minutes, 0, 0)
      
      attendance.checkIn = {
        time: checkIn,
        status: hours < 9 ? "On-time" : "Late",
      }
    }
    
    if (checkOutTime) {
      const [hours, minutes] = checkOutTime.split(':').map(Number)
      const checkOut = new Date(attendanceDate)
      checkOut.setHours(hours, minutes, 0, 0)
      
      attendance.checkOut = {
        time: checkOut,
        status: hours >= 17 ? "On-time" : "Early",
      }
    }
    
    // Calculate working hours if both check-in and check-out are provided
    if (attendance.checkIn.time && attendance.checkOut.time) {
      attendance.workingHours = calculateWorkingHours(
        attendance.checkIn.time,
        attendance.checkOut.time
      )
    }
    
    await attendance.save()
    
    // Update monthly summary
    await updateAttendanceSummary(staffId, attendance)
    
    res.status(200).json({
      success: true,
      message: "Attendance record updated successfully",
      data: attendance,
    })
  } catch (error) {
    console.error("Error updating attendance:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update attendance",
      error: error.message,
    })
  }
}

// Get attendance for a specific staff member
exports.getStaffAttendance = async (req, res) => {
  try {
    const { id } = req.params
    const { month, year } = req.query
    
    // Check if staff exists
    const staff = await Staff.findById(id)
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found",
      })
    }
    
    let query = { staffId: id }
    
    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      query.date = { $gte: startDate, $lte: endDate }
    }
    
    // Get attendance records
    const attendanceRecords = await Attendance.find(query).sort({ date: 1 })
    
    // Get attendance summary
    const summary = month && year
      ? await AttendanceSummary.findOne({ staffId: id, year, month })
      : null
    
    res.status(200).json({
      success: true,
      data: {
        attendance: attendanceRecords,
        summary,
      },
    })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
      error: error.message,
    })
  }
}

// Get attendance records for all staff (admin function)
exports.getAllAttendance = async (req, res) => {
  try {
    const { date, month, year, staffId, status } = req.query
    
    let query = {}
    
    // Apply filters
    if (staffId) {
      query.staffId = staffId
    }
    
    if (status) {
      query.status = status
    }
    
    if (date) {
      const attendanceDate = new Date(date)
      attendanceDate.setHours(0, 0, 0, 0)
      query.date = attendanceDate
    } else if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      query.date = { $gte: startDate, $lte: endDate }
    }
    
    // Get attendance records with staff details
    const attendanceRecords = await Attendance.find(query)
      .populate("staffId", "fullName staffId staffType designation photo")
      .sort({ date: -1 })
    
    res.status(200).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords,
    })
  } catch (error) {
    console.error("Error fetching attendance records:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance records",
      error: error.message,
    })
  }
}

// Generate attendance report
exports.generateAttendanceReport = async (req, res) => {
  try {
    const { staffId, month, year, reportType } = req.query
    
    // Validate required parameters
    if (reportType === "monthly" && (!month || !year)) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required for monthly report",
      })
    }
    
    if (reportType === "annual" && !year) {
      return res.status(400).json({
        success: false,
        message: "Year is required for annual report",
      })
    }
    
    // Get staff data if staffId is provided
    let staff = null
    if (staffId) {
      staff = await Staff.findById(staffId).select("-password")
      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff member not found",
        })
      }
    }
    
    // Generate report based on type
    if (reportType === "monthly") {
      if (staffId) {
        // Individual monthly report
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0)
        
        const attendanceRecords = await Attendance.find({
          staffId,
          date: { $gte: startDate, $lte: endDate },
        }).sort({ date: 1 })
        
        const summary = await AttendanceSummary.findOne({ staffId, year, month })
        
        return res.status(200).json({
          success: true,
          data: {
            staff,
            period: { month, year },
            records: attendanceRecords,
            summary,
          },
        })
      } else {
        // All staff monthly report
        const startDate = new Date(year, month - 1, 1)
        const endDate = new Date(year, month, 0)
        
        const summaries = await AttendanceSummary.find({ year, month })
          .populate("staffId", "fullName staffId staffType designation")
          .sort({ "staffId.fullName": 1 })
        
        return res.status(200).json({
          success: true,
          data: {
            period: { month, year },
            summaries,
          },
        })
      }
    } else if (reportType === "annual") {
      if (staffId) {
        // Individual annual report
        const summaries = await AttendanceSummary.find({ staffId, year })
          .sort({ month: 1 })
        
        // Calculate annual totals
        const annualStats = summaries.reduce(
          (stats, summary) => {
            stats.daysPresent += summary.daysPresent
            stats.daysAbsent += summary.daysAbsent
            stats.daysHalfDay += summary.daysHalfDay
            stats.daysOnLeave += summary.daysOnLeave
            stats.totalWorkingHours += summary.totalWorkingHours
            stats.lateCount += summary.lateCount
            stats.earlyDepartureCount += summary.earlyDepartureCount
            return stats
          },
          {
            daysPresent: 0,
            daysAbsent: 0,
            daysHalfDay: 0,
            daysOnLeave: 0,
            totalWorkingHours: 0,
            lateCount: 0,
            earlyDepartureCount: 0,
          }
        )
        
        // Calculate annual attendance percentage
        const totalWorkingDays = summaries.reduce((total, summary) => total + summary.totalWorkingDays, 0)
        annualStats.attendancePercentage = totalWorkingDays > 0
          ? Math.round(((annualStats.daysPresent + annualStats.daysHalfDay * 0.5 + annualStats.daysOnLeave) / totalWorkingDays) * 100)
          : 0
        
        return res.status(200).json({
          success: true,
          data: {
            staff,
            year,
            monthlySummaries: summaries,
            annualStats,
          },
        })
      } else {
        // All staff annual report
        const allStaff = await Staff.find().select("_id fullName staffId staffType designation")
        const staffIds = allStaff.map(staff => staff._id)
        
        // Get all summaries for the year
        const allSummaries = await AttendanceSummary.find({
          staffId: { $in: staffIds },
          year,
        })
        
        // Group summaries by staff
        const staffSummaries = {}
        allStaff.forEach(staff => {
          staffSummaries[staff._id] = {
            staff,
            summaries: [],
            annualStats: {
              daysPresent: 0,
              daysAbsent: 0,
              daysHalfDay: 0,
              daysOnLeave: 0,
              totalWorkingHours: 0,
              lateCount: 0,
              earlyDepartureCount: 0,
              attendancePercentage: 0,
              totalWorkingDays: 0,
            },
          }
        })
        
        // Populate summaries and calculate stats
        allSummaries.forEach(summary => {
          const staffId = summary.staffId.toString()
          if (staffSummaries[staffId]) {
            staffSummaries[staffId].summaries.push(summary)
            staffSummaries[staffId].annualStats.daysPresent += summary.daysPresent
            staffSummaries[staffId].annualStats.daysAbsent += summary.daysAbsent
            staffSummaries[staffId].annualStats.daysHalfDay += summary.daysHalfDay
            staffSummaries[staffId].annualStats.daysOnLeave += summary.daysOnLeave
            staffSummaries[staffId].annualStats.totalWorkingHours += summary.totalWorkingHours
            staffSummaries[staffId].annualStats.lateCount += summary.lateCount
            staffSummaries[staffId].annualStats.earlyDepartureCount += summary.earlyDepartureCount
            staffSummaries[staffId].annualStats.totalWorkingDays += summary.totalWorkingDays
          }
        })
        
        // Calculate attendance percentages and convert to array
        const reportData = Object.values(staffSummaries).map(data => {
          data.annualStats.attendancePercentage = data.annualStats.totalWorkingDays > 0
            ? Math.round(((data.annualStats.daysPresent + data.annualStats.daysHalfDay * 0.5 + data.annualStats.daysOnLeave) / data.annualStats.totalWorkingDays) * 100)
            : 0
          return data
        })
        
        // Sort by attendance percentage (highest first)
        reportData.sort((a, b) => b.annualStats.attendancePercentage - a.annualStats.attendancePercentage)
        
        return res.status(200).json({
          success: true,
          data: {
            year,
            staffReports: reportData,
          },
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid report type. Use 'monthly' or 'annual'",
      })
    }
  } catch (error) {
    console.error("Error generating attendance report:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate attendance report",
      error: error.message,
    })
  }
}

