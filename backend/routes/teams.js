const express = require("express");
const router = express.Router();
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  joinTeam,
  leaveTeam,
} = require("../controllers/teamController");
const { protect } = require("../middleware/auth");

router.route("/").get(getTeams).post(protect, createTeam);

router
  .route("/:id")
  .get(getTeam)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);

router.post("/:id/join", protect, joinTeam);
router.post("/:id/leave", protect, leaveTeam);

module.exports = router;
