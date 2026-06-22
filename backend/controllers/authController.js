const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🛠️ Helper function to generate a JWT token
const generateToken = (userId) => {
    // We sign the token with the user's ID and our secret key
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "30d", // The token will be valid for 30 days
    });
};


// REGISTER 

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide username, email, and password" });
        }

        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        // 3. Hash the password (NEVER store plain text passwords!)
        // genSalt(10) creates a random string to make hashing more secure
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create the user in the database
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // 5. If user was created successfully, send back their data + a token
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id), // 🎟️ Give them their digital ID card
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};


// LOGIN 

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by email
        const user = await User.findOne({ email });

        // 2. Check if user exists AND if the provided password matches the hashed password in DB
        // bcrypt.compare() handles the magic of comparing plain text to a hash
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                token: generateToken(user._id), // 🎟️ Give them their digital ID card
            });
        } else {
            // We say "Invalid email or password" instead of "User not found" 
            // so hackers can't guess which emails are registered.
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
};


// GET USER DATA
const getMe = async (req, res) => {
    try {
        // Because we used the 'protect' middleware, req.user is already populated!
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Could not fetch user data", error: error.message });
    }
};

module.exports = { register, login, getMe };