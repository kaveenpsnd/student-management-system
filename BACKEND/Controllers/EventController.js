const mongoose = require("mongoose")

const Schema = mongoose.Schema

const eventSchema = new Schema(
  {
    eventName: { type: String, required: true },
    eventType: { type: String, enum: ["Academic", "Sport", "Extra-Curriculer"] },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true },
)

const Event = mongoose.model("Event", eventSchema)

module.exports = Event
