const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../Controllers/RecentActivityController');

router.get('/', getRecentActivities);

module.exports = router;
