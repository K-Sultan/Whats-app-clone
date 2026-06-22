// backend/controllers/userController.js
const User = require("../models/User");

// Search for users by username or email
const searchUsers = async (req, res) => {
    // Get the search keyword from the query string (e.g., /api/user?search=john)
    const keyword = req.query.search
        ? {
            $or: [
                { username: { $regex: req.query.search, $options: "i" } }, // 'i' makes it case-insensitive
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    try {
        // Find users matching the keyword, but EXCLUDE the logged-in user
        // .find() returns an array of users
        const users = await User.find(keyword)
            .find({ _id: { $ne: req.user._id } }) // $ne means "not equal"
            .select("-password"); // Don't send passwords back

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error searching users", error: error.message });
    }
};

module.exports = { searchUsers };