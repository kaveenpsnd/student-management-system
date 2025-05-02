const express = require("express");
const router = express.Router();
const EventController = require("../Controllers/EventController");

// Create new event
router.post("/create", EventController.createEvent);

// Get events for calendar (approved events)
router.get("/calendar", EventController.getCalendarEvents);

// Get user's events (with optional status filter)
router.get("/my-events", EventController.getMyEvents);

// Get all events (for admin)
router.get("/", EventController.getAllEvents);

// Get specific event
router.get("/:id", EventController.getEventById);

// Update event (only if pending)
router.put("/:id", EventController.updateEventById);

// Delete event (only if pending)
router.delete("/:id", EventController.deleteEventById);

// Admin approval routes
router.put("/approve/:id", EventController.approveEvent);
router.put("/reject/:id", EventController.rejectEvent);

module.exports = router;
