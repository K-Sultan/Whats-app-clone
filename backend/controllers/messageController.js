// backend/controllers/messageController.js
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");

// ==========================================
// SEND A NEW MESSAGE
// ==========================================
const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({ message: "Invalid data passed into request" });
    }

    // 1. Create the new message document
    var newMessage = {
        senderId: req.user._id,
        content: content,
        chatId: chatId,
    };

    try {
        // Save to DB
        var message = await Message.create(newMessage);

        // Populate sender details and chat details to return a rich object
        message = await message.populate("senderId", "username avatar");
        message = await message.populate("chatId");

        // Also populate the participants of the chat so the frontend knows who is in it
        message = await User.populate(message, {
            path: "chatId.participants",
            select: "username avatar email",
        });

        // 2. Update the Chat document's 'latestMessage' field
        // This is crucial for sorting the chat list by recent activity!
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: "Error sending message", error: error.message });
    }
};

// ==========================================
// GET ALL MESSAGES FOR A SPECIFIC CHAT
// ==========================================
const allMessages = async (req, res) => {
    try {
        // Find all messages belonging to this chatId
        const messages = await Message.find({ chatId: req.params.chatId })
            .populate("senderId", "username avatar email")
            .populate("chatId");

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
};

module.exports = { sendMessage, allMessages };