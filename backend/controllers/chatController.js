
const Chat = require("../models/Chat");
const User = require("../models/User");


// ACCESS OR CREATE A 1-ON-1 CHAT
const accessChat = async (req, res) => {
    const { userId } = req.body; // The ID of the user we want to chat with

    // 1. Validation
    if (!userId) {
        return res.status(400).json({ message: "UserId param not sent with request" });
    }

    // 2. Check if a private chat already exists between the logged-in user (req.user._id) and the target user (userId)
    // $all means the participants array must contain BOTH of these IDs
    let isChat = await Chat.find({
        type: "private",
        participants: { $all: [req.user._id, userId] },
    })
        .populate("participants", "-password") // Get user details, but exclude passwords
        .populate("latestMessage");            // Get the details of the last message

    // Populate the sender inside the latestMessage
    isChat = await User.populate(isChat, {
        path: "latestMessage.senderId",
        select: "username avatar email",
    });

    // 3. If a chat exists, return it
    if (isChat.length > 0) {
        return res.send(isChat[0]);
    } else {
        // 4. If no chat exists, create a new one
        var chatData = {
            type: "private",
            participants: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("participants", "-password")
                .populate("latestMessage");

            // (Optional) Populate sender of latest message if it exists
            const finalChat = await User.populate(fullChat, {
                path: "latestMessage.senderId",
                select: "username avatar email",
            });

            res.status(200).json(finalChat);
        } catch (error) {
            res.status(400).json({ message: "Error creating chat", error: error.message });
        }
    }
};

// ==========================================
// FETCH ALL CHATS FOR THE LOGGED-IN USER
// ==========================================
const fetchChats = async (req, res) => {
    try {
        // Find all chats where the logged-in user is a participant
        let results = await Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate("participants", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 }); // Sort by most recently updated (latest activity)

        // Populate the sender details inside the latestMessage
        results = await User.populate(results, {
            path: "latestMessage.senderId",
            select: "username avatar email",
        });

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chats", error: error.message });
    }
};


// CREATE A GROUP CHAT
const createGroupChat = async (req, res) => {
    // Expecting 'users' (array of IDs) and 'groupName' in the request body
    const { users, groupName } = req.body;

    if (!users || !groupName) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    // A group needs at least 2 other people + the creator = 3 users minimum (or 2 if you prefer, let's stick to 2 for simplicity)
    if (users.length < 2) {
        return res.status(400).json({ message: "A group chat requires at least 2 other participants" });
    }

    // Add the logged-in user to the participants array
    users.push(req.user._id);

    try {
        const groupChat = await Chat.create({
            type: "group",
            participants: users,
            groupName: groupName,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("participants", "-password");

        res.status(201).json(fullGroupChat);
    } catch (error) {
        res.status(400).json({ message: "Error creating group chat", error: error.message });
    }
};

module.exports = { accessChat, fetchChats, createGroupChat };