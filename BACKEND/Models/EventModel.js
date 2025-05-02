const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventRequestSchema = new Schema({
  eventId: { type: String, unique: true },
  eventName: { type: String, required: true },
  eventType: { type: String, enum: ['Academic', 'Sport', 'Extra-Curricular'], required: true },
  grades: [{ type: String, required: true }], 
  location: { type: String, enum: ['Classroom', 'Playground', 'Main Hall'], required: true },
  description: { type: String },
  schedulingMode: { type: String, enum: ['Manual', 'Smart'], required: true },
  date: { type: Date }, // Only used in manual
  startTime: { type: String },
  endTime: { type: String },
  preferredSlots: [
    {
      start: { type: Date },
      end: { type: Date }
    }
  ], // Used only in Smart Scheduling
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdBy: { type: String, required: true }, // Staff ID from logged-in user
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate Event ID
EventRequestSchema.pre('save', async function (next) {
  if (!this.eventId) {
    try {
      const lastEvent = await this.constructor.findOne().sort({ eventId: -1 });

      let newEventId = "EVT00001";

      if (lastEvent && lastEvent.eventId) {
        const lastIdNumber = parseInt(lastEvent.eventId.replace("EVT", ""), 10);
        newEventId = `EVT${String(lastIdNumber + 1).padStart(5, '0')}`;
      }

      this.eventId = newEventId;
      next();
    } catch (error) {
      console.error("Error generating Event ID:", error);
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('EventRequest', EventRequestSchema, 'events');

