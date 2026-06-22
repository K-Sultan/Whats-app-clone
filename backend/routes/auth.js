// backend/routes/auth.js
const express = require("express");
const router = express.Router();

// Import controllers and middleware
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes (No token required)
router.post("/register", register);
router.post("/login", login);

// Protected route (Requires a valid JWT token)
// Notice how we put 'protect' BEFORE 'getMe'. 
// Express runs them in order: first it checks the token, then it runs getMe.
router.get("/me", protect, getMe);

module.exports = router;