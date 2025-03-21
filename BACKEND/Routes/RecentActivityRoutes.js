const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../Controllers/RecentActivityController'); // Ensure this is correct

router.get('/', getRecentActivities); // Ensure this is correct
console.log(getRecentActivities); // Should log the function

module.exports = router;