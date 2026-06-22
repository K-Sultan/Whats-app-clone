// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true, 
            trim: true,   
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, 
            trim: true,
            lowercase: true, 
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        avatar: {
            type: String,
            default: "https://i.pravatar.cc/150?u=default", 
        },
    },
    {
        timestamps: true, 
    }
);


module.exports = mongoose.model("User", userSchema);