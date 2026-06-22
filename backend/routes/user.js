// backend/routes/user.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { searchUsers } = require("../controllers/userController");

// GET /api/user?search=xyz
router.route("/").get(protect, searchUsers);

module.exports = router;