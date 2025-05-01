const mongoose = require("mongoose")

const recentActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["student", "staff", "inventory", "attendance", "leave", "exam", "system"],
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    default: "System",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("RecentActivity", recentActivitySchema)
