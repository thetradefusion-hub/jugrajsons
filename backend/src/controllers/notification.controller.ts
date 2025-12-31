import { Request, Response } from 'express';
import Notification from '../models/Notification';

// Get all notifications (admin)
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { type, read } = req.query;
    const query: any = {};

    if (type) {
      query.type = type;
    }
    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get user notifications
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const notifications = await Notification.find({
      $or: [{ userId }, { userId: { $exists: false } }],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create notification
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { type, title, message, link, userId } = req.body;

    const notification = await Notification.create({
      type,
      title,
      message,
      link,
      userId,
    });

    res.status(201).json(notification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    const query: any = { read: false };
    
    if (userId) {
      query.$or = [{ userId }, { userId: { $exists: false } }];
    }

    await Notification.updateMany(query, { read: true });

    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

