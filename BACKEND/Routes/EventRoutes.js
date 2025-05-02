const express = require("express");
const router = express.Router();
const EventController = require("../Controllers/EventController");

// User routes
router.post("/create", EventController.createEvent);
router.get("/my-events", EventController.getMyEvents);
router.get("/:id", EventController.getEventById);
router.put("/:id", EventController.updateEventById);
router.delete("/:id", EventController.deleteEventById);

// Admin routes
router.get("/", EventController.getAllEvents);
router.put("/approve/:eventId", EventController.approveEvent);
router.put("/reject/:eventId", EventController.rejectEvent);

module.exports = router;
