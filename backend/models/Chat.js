const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["private", "group"], 
            required: true,
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", 
                required: true,
            },
        ],
        groupName: {
            type: String,
            trim: true,
        },
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Chat", chatSchema);