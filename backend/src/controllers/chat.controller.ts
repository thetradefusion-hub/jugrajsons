import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import ChatMessage from '../models/ChatMessage';
import Expert from '../models/Expert';

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { expertId, message } = req.body;

    if (!expertId || !message) {
      return res.status(400).json({ message: 'Expert ID and message are required' });
    }

    // Check if expert exists
    const expert = await Expert.findById(expertId);
    if (!expert || !expert.isActive) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    const chatMessage = await ChatMessage.create({
      user: req.user!._id,
      expert: expertId,
      message,
      sender: 'user',
      read: false,
    });

    const populatedMessage = await ChatMessage.findById(chatMessage._id)
      .populate('user', 'name email')
      .populate('expert', 'name image');

    res.status(201).json(populatedMessage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { expertId } = req.params;

    const messages = await ChatMessage.find({
      user: req.user!._id,
      expert: expertId,
    })
      .populate('user', 'name email')
      .populate('expert', 'name image')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await ChatMessage.updateMany(
      { user: req.user!._id, expert: expertId, sender: 'expert', read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatList = async (req: AuthRequest, res: Response) => {
  try {
    // Get all unique experts the user has chatted with
    const messages = await ChatMessage.find({ user: req.user!._id })
      .populate('expert', 'name image specialization available')
      .sort({ createdAt: -1 });

    // Group by expert and get latest message
    const expertMap = new Map();
    messages.forEach((msg: any) => {
      const expertId = msg.expert._id.toString();
      if (!expertMap.has(expertId)) {
        expertMap.set(expertId, {
          expert: msg.expert,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }
    });

    // Count unread messages
    for (const [expertId, chat] of expertMap.entries()) {
      const unread = await ChatMessage.countDocuments({
        user: req.user!._id,
        expert: expertId,
        sender: 'expert',
        read: false,
      });
      chat.unreadCount = unread;
    }

    res.json(Array.from(expertMap.values()));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendExpertReply = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, expertId, message } = req.body;

    if (!userId || !expertId || !message) {
      return res.status(400).json({ message: 'User ID, Expert ID, and message are required' });
    }

    // Check if user is admin or the expert
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    // Verify the user is admin or the expert themselves
    if (req.user!.role !== 'admin' && req.user!._id.toString() !== expertId) {
      return res.status(403).json({ message: 'Unauthorized to send expert replies' });
    }

    const chatMessage = await ChatMessage.create({
      user: userId,
      expert: expertId,
      message,
      sender: 'expert',
      read: false,
    });

    const populatedMessage = await ChatMessage.findById(chatMessage._id)
      .populate('user', 'name email')
      .populate('expert', 'name image');

    res.status(201).json(populatedMessage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpertChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { expertId, userId } = req.params;

    if (!expertId || !userId) {
      return res.status(400).json({ message: 'Expert ID and User ID are required' });
    }

    // Verify the user is admin or the expert
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    if (req.user!.role !== 'admin' && req.user!._id.toString() !== expertId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const messages = await ChatMessage.find({
      user: userId,
      expert: expertId,
    })
      .populate('user', 'name email')
      .populate('expert', 'name image')
      .sort({ createdAt: 1 });

    // Mark user messages as read when expert views them
    await ChatMessage.updateMany(
      { user: userId, expert: expertId, sender: 'user', read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

