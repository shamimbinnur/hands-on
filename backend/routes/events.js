const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  checkJoinStatus,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");

router.route("/").get(getEvents).post(protect, createEvent);

router
  .route("/:id")
  .get(getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

router.post("/:id/join", protect, joinEvent);
router.post("/:id/leave", protect, leaveEvent);
router.get("/:id/joined", protect, checkJoinStatus);

module.exports = router;
