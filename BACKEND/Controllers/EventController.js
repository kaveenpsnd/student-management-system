const EventModel = require("../Models/EventModel");

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { eventName, eventType, grade, date, startTime, endTime, createdBy } = req.body;

    // Validate required fields
    if (!eventName || !eventType || !grade || !date || !startTime || !endTime || !createdBy) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    const newEvent = new EventModel({
      eventName,
      eventType,
      grade,
      date,
      startTime,
      endTime,
      createdBy,
      status: 'Pending'
    });

    await newEvent.save();
    res.status(201).json({ 
      message: "Event created successfully!", 
      event: newEvent 
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all events (for admin)
const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get events by creator and status
const getMyEvents = async (req, res) => {
  try {
    const { createdBy, status } = req.query;
    const query = { createdBy };
    
    if (status) {
      query.status = status;
    }

    const events = await EventModel.find(query).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get events for calendar (approved events)
const getCalendarEvents = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { 
      status: 'Approved',
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const events = await EventModel.find(query);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific event by ID
const getEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update event (only if pending)
const updateEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    if (event.status !== "Pending") {
      return res.status(400).json({ message: "Cannot update non-pending event" });
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete event (only if pending)
const deleteEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    if (event.status !== "Pending") {
      return res.status(400).json({ message: "Cannot delete non-pending event" });
    }

    await EventModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Approve event
const approveEvent = async (req, res) => {
  try {
    const event = await EventModel.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ 
      message: "Event approved successfully", 
      event 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reject event
const rejectEvent = async (req, res) => {
  try {
    const event = await EventModel.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ 
      message: "Event rejected successfully", 
      event 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getMyEvents,
  getCalendarEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  approveEvent,
  rejectEvent
};
