const Attendance = require("../Models/AttendanceModel")
const Student = require("../Models/StudentModel")
const { addRecentActivity } = require("./RecentActivityController")

// Get attendance for a class on a specific date
const getClassAttendance = async (req, res) => {
  try {
    const { date } = req.query
    const className = req.params.className

    if (!className || !date) {
      return res.status(400).json({ message: "Class name and date are required" })
    }

    // Find attendance record for the class and date
    const attendance = await Attendance.findOne({
      class: className,
      date: new Date(date),
    })

    if (!attendance) {
      return res.status(404).json({ message: "No attendance record found for this class and date" })
    }

    res.status(200).json(attendance)
  } catch (error) {
    console.error("Error fetching class attendance:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get attendance records for a specific student
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params

    // Verify student exists
    const student = await Student.findOne({ studentId })
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Find all attendance records that include this student
    const attendanceRecords = await Attendance.find({
      "students.studentId": studentId,
    }).sort({ date: -1 })

    // Extract only the relevant student's attendance from each record
    const studentAttendance = attendanceRecords.map((record) => {
      const studentRecord = record.students.find((s) => s.studentId === studentId)
      return {
        date: record.date,
        class: record.class,
        status: studentRecord.status,
        notes: studentRecord.notes,
      }
    })

    res.status(200).json(studentAttendance)
  } catch (error) {
    console.error("Error fetching student attendance:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Save attendance for a class
const saveAttendance = async (req, res) => {
  try {
    const { class: className, date, students } = req.body

    if (!className || !date || !students) {
      return res.status(400).json({ message: "Class name, date, and student records are required" })
    }

    // Check if attendance record already exists for this class and date
    let attendance = await Attendance.findOne({
      class: className,
      date: new Date(date),
    })

    if (attendance) {
      // Update existing record
      attendance.students = students
      await attendance.save()
    } else {
      // Create new record
      attendance = new Attendance({
        class: className,
        date: new Date(date),
        students,
      })
      await attendance.save()
    }

    // Add recent activity
    await addRecentActivity(
      "Administrator",
      `updated attendance for ${className} on ${new Date(date).toLocaleDateString()}`,
    )

    res.status(200).json({ message: "Attendance saved successfully", attendance })
  } catch (error) {
    console.error("Error saving attendance:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get attendance statistics for a student
const getStudentAttendanceStats = async (req, res) => {
  try {
    const { studentId } = req.params

    // Verify student exists
    const student = await Student.findOne({ studentId })
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Find all attendance records that include this student
    const attendanceRecords = await Attendance.find({
      "students.studentId": studentId,
    })

    // Calculate statistics
    let presentCount = 0
    let absentCount = 0
    let lateCount = 0
    let totalCount = 0

    attendanceRecords.forEach((record) => {
      const studentRecord = record.students.find((s) => s.studentId === studentId)
      if (studentRecord) {
        totalCount++
        if (studentRecord.status === "present") presentCount++
        else if (studentRecord.status === "absent") absentCount++
        else if (studentRecord.status === "late") lateCount++
      }
    })

    // Calculate percentages
    const stats = {
      total: totalCount,
      present: totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0,
      absent: totalCount > 0 ? Math.round((absentCount / totalCount) * 100) : 0,
      late: totalCount > 0 ? Math.round((lateCount / totalCount) * 100) : 0,
      presentCount,
      absentCount,
      lateCount,
    }

    res.status(200).json(stats)
  } catch (error) {
    console.error("Error fetching student attendance stats:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getClassAttendance,
  getStudentAttendance,
  saveAttendance,
  getStudentAttendanceStats,
}
