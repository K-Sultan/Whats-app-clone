// backend/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat", // Which chat does this message belong to?
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Who sent this message?
            required: true,
        },
        content: {
            type: String,
            required: [true, "Message content cannot be empty"],
            trim: true,
        },
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model("Message", messageSchema);