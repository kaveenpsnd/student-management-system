const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceRecordSchema = new Schema({
  studentId: {
    type: String,
    required: true,
    ref: "Student",
  },
  status: {
    type: String,
    enum: ["present", "absent", "late"],
    default: "present",
    required: true,
  },
  notes: {
    type: String,
  },
});

const AttendanceSchema = new Schema({
  class: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  students: [AttendanceRecordSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AttendanceSchema.index({ class: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
