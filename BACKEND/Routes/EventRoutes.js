const express = require("express");
const router = express.Router();
const EventController = require("../Controllers/EventController");
const { authenticateUser, authenticateAdmin } = require("../middleware/auth");

// User routes
router.post("/create", authenticateUser, EventController.createEvent);
router.get("/my-events", authenticateUser, EventController.getMyEvents);
router.get("/:id", authenticateUser, EventController.getEventById);
router.put("/:id", authenticateUser, EventController.updateEventById);
router.delete("/:id", authenticateUser, EventController.deleteEventById);

// Admin routes
router.get("/", authenticateAdmin, EventController.getAllEvents);
router.put("/approve/:eventId", authenticateAdmin, EventController.approveEvent);
router.put("/reject/:eventId", authenticateAdmin, EventController.rejectEvent);

module.exports = router;
