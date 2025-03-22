const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../Controllers/RecentActivityController');

router.get('/', getRecentActivities);
console.log(getRecentActivities); 

module.exports = router;