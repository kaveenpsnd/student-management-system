const express = require("express")
const router = express.Router()
const RecentActivity = require("../Models/RecentActivityModel")

// Get all recent activities
router.get("/", async (req, res) => {
  try {
    const activities = await RecentActivity.find().sort({ timestamp: -1 }).limit(10)
    res.status(200).json({ activities })
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Add a new activity
router.post("/", async (req, res) => {
  try {
    const { studentName, studentPhoto, action } = req.body
    const newActivity = new RecentActivity({
      studentName,
      studentPhoto,
      action,
      timestamp: new Date(),
    })

    const savedActivity = await newActivity.save()
    res.status(201).json({ activity: savedActivity })
  } catch (error) {
    console.error("Error adding activity:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
