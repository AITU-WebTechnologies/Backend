const express = require("express");
const eventController = require("../controllers/event-controller");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

router.post("/create-event", authenticateToken, eventController.createEvent);
router.get("/all-events", authenticateToken, eventController.getAllEvents);
router.get("/checker-events", authenticateToken, eventController.getCheckerEvents);
router.get("/:eventId", authenticateToken, eventController.getEventById);
router.get("/checker/:eventId", authenticateToken, eventController.viewEvent);
router.delete("/:eventId", authenticateToken, eventController.deleteEvent);
router.put("/update-participant-status/:eventId", authenticateToken, eventController.updateParticipantStatus);
router.put("/:eventId", authenticateToken, eventController.updateEvent);



module.exports = router;