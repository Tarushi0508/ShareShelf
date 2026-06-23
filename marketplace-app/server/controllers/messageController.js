import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { listingId, recipientId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't message yourself" });
    }

    const message = await Message.create({
      listing: listingId,
      sender: req.user._id,
      recipient: recipientId,
      content: content.trim(),
    });

    const populated = await message.populate('sender', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    })
      .populate('listing', 'title images')
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .sort({ createdAt: -1 });

    const conversationMap = new Map();

    for (const msg of messages) {
      if (!msg.listing) continue;
      const isSender = msg.sender._id.toString() === req.user._id.toString();
      const otherUser = isSender ? msg.recipient : msg.sender;
      const key = `${msg.listing._id}_${otherUser._id}`;

      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          listing: msg.listing,
          otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      const convo = conversationMap.get(key);
      if (!isSender && !msg.read) {
        convo.unreadCount += 1;
      }
    }

    res.json(Array.from(conversationMap.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getThread = async (req, res) => {
  try {
    const { listingId, otherUserId } = req.params;

    const messages = await Message.find({
      listing: listingId,
      $or: [
        { sender: req.user._id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user._id },
      ],
    })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { listing: listingId, sender: otherUserId, recipient: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ recipient: req.user._id, read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};