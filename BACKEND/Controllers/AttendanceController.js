const { Attendance: StaffAttendance, AttendanceSummary } = require("../Models/StaffAttendanceModel");
const Staff = require("../Models/StaffModel");
const { Leave } = require("../Models/LeaveModel");
const StudentAttendance = require("../Models/AttendanceModel");
const Student = require("../Models/StudentModel");
const { addRecentActivity } = require("./RecentActivityController");

// ==================== Shared Helper Functions ====================
const sendSMS = async (phoneNumber, message) => {
  console.log(`SMS sent to ${phoneNumber}: ${message}`);
  return true;
};

const calculateWorkingHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round(diff / (1000 * 60));
};

// ==================== Staff Attendance Controllers ====================
const updateStaffSummary = async (staffId, attendanceRecord) => {
  const date = new Date(attendanceRecord.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  let summary = await AttendanceSummary.findOne({ staffId, year, month }) || 
    new AttendanceSummary({ staffId, year, month });

  const daysInMonth = new Date(year, month, 0).getDate();
  summary.totalWorkingDays = [...Array(daysInMonth).keys()]
    .map(i => new Date(year, month - 1, i + 1))
    .filter(d => d.getDay() !== 0 && d.getDay() !== 6).length;

  const records = await StaffAttendance.find({
    staffId,
    date: { $gte: new Date(year, month - 1, 1), $lte: new Date(year, month, 0) }
  });

  // Calculate summary statistics
  const stats = records.reduce((acc, record) => {
    switch(record.status) {
      case "Present":
        acc.daysPresent++;
        acc.totalHours += record.workingHours;
        if(record.checkIn.status === "Late") acc.lateCount++;
        if(record.checkOut.status === "Early") acc.earlyDepartureCount++;
        break;
      case "Absent": acc.daysAbsent++; break;
      case "Half-day": acc.daysHalfDay++; break;
      case "On-leave": acc.daysOnLeave++; break;
    }
    return acc;
  }, { daysPresent:0, daysAbsent:0, daysHalfDay:0, daysOnLeave:0, totalHours:0, lateCount:0, earlyDepartureCount:0 });

  Object.assign(summary, {
    ...stats,
    averageWorkingHours: stats.daysPresent > 0 ? Math.round(stats.totalHours / stats.daysPresent) : 0,
    attendancePercentage: summary.totalWorkingDays > 0 
      ? Math.round(((stats.daysPresent + stats.daysHalfDay * 0.5 + stats.daysOnLeave) / summary.totalWorkingDays) * 100)
      : 0
  });

  return summary.save();
};

// Staff RFID Attendance
const markStaffAttendance = async (req, res) => {
  try {
    const { rfidCardId } = req.body;
    const staff = await Staff.findOne({ rfidCardId });
    
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });

    const today = new Date().setHours(0,0,0,0);
    const existingLeave = await Leave.findOne({
      staffId: staff._id,
      startDate: { $lte: today },
      endDate: { $gte: today },
      status: "Approved"
    });

    if (existingLeave) return res.status(400).json({ 
      success: false, 
      message: "Cannot mark attendance during approved leave" 
    });

    let attendance = await StaffAttendance.findOne({ staffId: staff._id, date: today });
    const now = new Date();

    if (!attendance) {
      attendance = await new StaffAttendance({
        staffId: staff._id,
        date: today,
        checkIn: { time: now, status: now.getHours() < 9 ? "On-time" : "Late" },
        status: "Present"
      }).save();
      
      return res.status(201).json({
        success: true,
        message: `Check-in successful at ${now.toLocaleTimeString()}`,
        data: attendance
      });
    }

    if (!attendance.checkOut.time) {
      attendance.checkOut = { 
        time: now, 
        status: now.getHours() >= 17 ? "On-time" : "Early" 
      };
      attendance.workingHours = calculateWorkingHours(attendance.checkIn.time, now);
      await attendance.save();
      await updateStaffSummary(staff._id, attendance);
      
      return res.status(200).json({
        success: true,
        message: `Check-out successful. Worked ${Math.floor(attendance.workingHours/60)}h ${attendance.workingHours%60}m`,
        data: attendance
      });
    }

    return res.status(400).json({ success: false, message: "Already checked out today" });
  } catch (error) {
    console.error("Staff attendance error:", error);
    res.status(500).json({ success: false, message: "Attendance processing failed", error: error.message });
  }
};

// Staff Manual Attendance
const manualStaffAttendance = async (req, res) => {
  try {
    const { staffId, date, checkIn, checkOut, status } = req.body;
    const attendanceDate = new Date(date).setHours(0,0,0,0);

    let record = await StaffAttendance.findOne({ staffId, date: attendanceDate }) ||
      new StaffAttendance({ staffId, date: attendanceDate });

    if (checkIn) {
      const [h, m] = checkIn.split(':');
      record.checkIn = {
        time: new Date(attendanceDate).setHours(h, m),
        status: h < 9 ? "On-time" : "Late"
      };
    }

    if (checkOut) {
      const [h, m] = checkOut.split(':');
      record.checkOut = {
        time: new Date(attendanceDate).setHours(h, m),
        status: h >= 17 ? "On-time" : "Early"
      };
      record.workingHours = calculateWorkingHours(record.checkIn.time, record.checkOut.time);
    }

    record.status = status || record.status;
    await record.save();
    await updateStaffSummary(staffId, record);

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.error("Manual staff attendance error:", error);
    res.status(500).json({ success: false, message: "Manual attendance update failed", error: error.message });
  }
};

// Staff Reports
const getStaffAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, year } = req.query;
    
    const filter = { staffId: id };
    if (month && year) {
      filter.date = { 
        $gte: new Date(year, month-1, 1), 
        $lte: new Date(year, month, 0) 
      };
    }

    const [records, summary] = await Promise.all([
      StaffAttendance.find(filter).sort({ date: 1 }),
      month && year ? AttendanceSummary.findOne({ staffId: id, year, month }) : null
    ]);

    res.status(200).json({ success: true, data: { records, summary } });
  } catch (error) {
    console.error("Staff attendance fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch staff attendance", error: error.message });
  }
};

// ==================== Student Attendance Controllers ====================
const getClassAttendance = async (req, res) => {
  try {
    const { className } = req.params;
    const { date } = req.query;
    
    const attendance = await StudentAttendance.findOne({ 
      class: className, 
      date: new Date(date) 
    }).populate('students.studentId', 'name rollNumber');

    if (!attendance) return res.status(404).json({ 
      success: false, 
      message: "No attendance found for this date" 
    });

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Class attendance error:", error);
    res.status(500).json({ success: false, message: "Failed to get class attendance", error: error.message });
  }
};

const saveStudentAttendance = async (req, res) => {
  try {
    const { class: className, date, students } = req.body;
    const attendanceDate = new Date(date).setHours(0,0,0,0);

    let record = await StudentAttendance.findOne({ class: className, date: attendanceDate }) ||
      new StudentAttendance({ class: className, date: attendanceDate, students: [] });

    record.students = students.map(s => ({
      studentId: s.studentId,
      status: s.status,
      notes: s.notes
    }));

    await record.save();
    await addRecentActivity(req.user.id, `Updated attendance for ${className}`);

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.error("Save student attendance error:", error);
    res.status(500).json({ success: false, message: "Attendance save failed", error: error.message });
  }
};

const getStudentAttendanceStats = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await StudentAttendance.find({ 
      "students.studentId": studentId 
    });

    const stats = records.reduce((acc, record) => {
      const student = record.students.find(s => s.studentId === studentId);
      if (student) {
        acc.total++;
        acc[student.status]++;
        if (student.status === 'late') acc.late++;
      }
      return acc;
    }, { total: 0, present: 0, absent: 0, late: 0 });

    stats.attendancePercentage = stats.total > 0 
      ? Math.round((stats.present / stats.total) * 100)
      : 0;

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Student stats error:", error);
    res.status(500).json({ success: false, message: "Failed to get stats", error: error.message });
  }
};

// Get attendance for a specific student
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await StudentAttendance.find({ studentId })
      .sort({ date: -1 })
      .populate('recordedBy', 'fullName');
    
    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student attendance'
    });
  }
};

// Get all attendance records
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await StudentAttendance.find()
      .populate('studentId', 'fullName')
      .populate('recordedBy', 'fullName')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records'
    });
  }
};

// Generate attendance report
const generateAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, classId } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (classId) {
      query.studentId = { $in: await Student.find({ classId }).select('_id') };
    }
    
    const attendance = await StudentAttendance.find(query)
      .populate('studentId', 'fullName classId')
      .populate('recordedBy', 'fullName')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate attendance report'
    });
  }
};

module.exports = {
  // Staff Exports
  markStaffAttendance,
  manualStaffAttendance,
  getStaffAttendance,
  updateStaffSummary,

  // Student Exports
  getClassAttendance,
  saveStudentAttendance,
  getStudentAttendanceStats,
  getStudentAttendance,
  getAllAttendance,
  generateAttendanceReport
};