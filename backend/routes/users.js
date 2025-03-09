const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  getUserVolunteerHistory,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getUsers);
router.get("/:id", getUser);
router.put("/:id", protect, updateUser);
router.get("/:id/history", getUserVolunteerHistory);

module.exports = router;
