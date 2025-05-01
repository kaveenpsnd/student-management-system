const RecentActivity = require("../Models/RecentActivityModel")

// Get all recent activities
const getRecentActivities = async (req, res) => {
  try {
    const activities = await RecentActivity.find().sort({ timestamp: -1 }).limit(10)
    res.status(200).json(activities)
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    res.status(500).json({ message: "Failed to fetch recent activities", error: error.message })
  }
}

// Add a new activity
const addActivity = async (req, res) => {
  try {
    const { type, description, user } = req.body

    if (!type || !description) {
      return res.status(400).json({ message: "Type and description are required" })
    }

    const newActivity = new RecentActivity({
      type,
      description,
      user: user || "System",
      timestamp: new Date(),
    })

    const savedActivity = await newActivity.save()
    res.status(201).json(savedActivity)
  } catch (error) {
    console.error("Error adding activity:", error)
    res.status(500).json({ message: "Failed to add activity", error: error.message })
  }
}

module.exports = {
  getRecentActivities,
  addActivity,
}
