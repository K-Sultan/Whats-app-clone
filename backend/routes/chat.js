const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const { accessChat, fetchChats, createGroupChat } = require("../controllers/chatController");

// All chat routes are protected
router.route("/").post(protect, accessChat);      // Create/Access 1-on-1
router.route("/").get(protect, fetchChats);       // Get all my chats
router.route("/group").post(protect, createGroupChat); // Create group

module.exports = router;