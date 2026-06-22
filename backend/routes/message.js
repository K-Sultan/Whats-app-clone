const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const { sendMessage, allMessages } = require("../controllers/messageController");

// All message routes are protected
router.route("/").post(protect, sendMessage);             // Send message
router.route("/:chatId").get(protect, allMessages);       // Get chat history

module.exports = router;