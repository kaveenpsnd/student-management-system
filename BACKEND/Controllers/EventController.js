const EventModel = require("../Models/EventModel");
const { addRecentActivity } = require("./RecentActivityController");

// Create a new event request
const createEvent = async (req, res) => {
  try {
    const newEvent = new EventModel({
      ...req.body,
      createdBy: req.user.id,
    });

    await newEvent.save();

    await addRecentActivity(`${req.user.name} created an event: ${newEvent.eventName}`, "created");

    res.status(201).json({ message: "Event created successfully!", eventId: newEvent._id });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all events (for admin)
const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in user's own events
const getMyEvents = async (req, res) => {
  try {
    const events = await EventModel.find({ createdBy: req.user.id });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific event request by ID
const getEventById = async (req, res) => {
  try {
    const event = await EventModel.findOne({ _id: req.params.id });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update event only if user is owner and status is pending
const updateEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    if (event.status !== "Pending") return res.status(400).json({ message: "Cannot update non-pending event" });

    const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete event only if user is owner and status is pending
const deleteEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    if (event.status !== "Pending") return res.status(400).json({ message: "Cannot delete non-pending event" });

    await EventModel.findByIdAndDelete(req.params.id);
    await addRecentActivity(`${event.eventName} event was deleted`, "deleted");

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin-only approve event
const approveEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.findOneAndUpdate(
      { _id: eventId },
      { status: "Approved" },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    await addRecentActivity(`${event.eventName} event was approved`, "approved");

    res.status(200).json({ message: "Event approved successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin-only reject event
const rejectEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.findOneAndUpdate(
      { _id: eventId },
      { status: "Rejected" },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    await addRecentActivity(`${event.eventName} event was rejected`, "rejected");

    res.status(200).json({ message: "Event rejected successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  approveEvent,
  rejectEvent
};
