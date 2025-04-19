const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get all messages for a chat
router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

// Route to send a new message

module.exports = router;
