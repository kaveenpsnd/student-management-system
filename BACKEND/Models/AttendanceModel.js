const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AttendanceSchema = new Schema({
  staffId: {
    type: String,
    required: true,
    ref: "Staff",
  },
  date: {
    type: Date,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
  },
  workingHours: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Half-Day", "On Leave"],
    default: "Present",
  },
  notes: {
    type: String,
  },
})

// Compound index to ensure uniqueness of staffId and date combination
AttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model("Attendance", AttendanceSchema)
