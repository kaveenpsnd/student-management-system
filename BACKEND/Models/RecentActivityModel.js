const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecentActivitySchema = new Schema({
  studentName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RecentActivity', RecentActivitySchema);
