const express = require("express");
const router = express.Router();
const {
  getHelpRequests,
  getHelpRequest,
  createHelpRequest,
  updateHelpRequest,
  deleteHelpRequest,
  offerHelp,
  withdrawHelp,
} = require("../controllers/helpController");
const { protect } = require("../middleware/auth");

router.route("/").get(getHelpRequests).post(protect, createHelpRequest);

router
  .route("/:id")
  .get(getHelpRequest)
  .put(protect, updateHelpRequest)
  .delete(protect, deleteHelpRequest);

router.post("/:id/offer-help", protect, offerHelp);
router.post("/:id/withdraw-help", protect, withdrawHelp);

module.exports = router;
