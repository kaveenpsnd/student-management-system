const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StaffAttendanceSchema = new Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
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
      type: Number, // In hours
      default: 0,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half-Day", "Late", "Early Departure", "On Leave"],
      default: "Present",
    },
    rfidCardId: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    year: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },
    month: {
      type: Number,
      required: true,
      default: () => new Date().getMonth() + 1,
    },
    day: {
      type: Number,
      required: true,
      default: () => new Date().getDate(),
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    lateMinutes: {
      type: Number,
      default: 0,
    },
    earlyDeparture: {
      type: Boolean,
      default: false,
    },
    earlyDepartureMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes
StaffAttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });
StaffAttendanceSchema.index({ rfidCardId: 1, date: 1 });
StaffAttendanceSchema.index({ year: 1, month: 1, staffId: 1 });

// Calculate working hours before saving
StaffAttendanceSchema.pre("save", function(next) {
  if (this.checkIn && this.checkOut) {
    const diffInMs = this.checkOut - this.checkIn;
    this.workingHours = (diffInMs / (1000 * 60 * 60)).toFixed(2);
  }
  next();
});

// Virtual for attendance percentage
StaffAttendanceSchema.virtual('attendancePercentage').get(function() {
  const totalDays = new Date(this.year, this.month, 0).getDate();
  const presentDays = this.status === 'Present' ? 1 : 0;
  return (presentDays / totalDays) * 100;
});

module.exports = mongoose.model("StaffAttendance", StaffAttendanceSchema);



