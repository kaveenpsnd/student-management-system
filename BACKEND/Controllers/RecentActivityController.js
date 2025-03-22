const RecentActivity = require('../Models/RecentActivityModel');

const getRecentActivities = async (req, res) => {
  try {
    const activities = await RecentActivity.find().sort({ timestamp: -1 }).limit(10);
    return res.status(200).json({ activities });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const addRecentActivity = async (studentName, action) => {
  try {
    console.log(`Adding activity: ${studentName} ${action}`);
    const activity = new RecentActivity({ 
      studentName, 
      action: `${action}`
    });
    await activity.save();
    console.log("Activity saved:", activity);
  } catch (error) {
    console.error("Failed to add activity:", error);
  }
};

module.exports = { getRecentActivities, addRecentActivity };