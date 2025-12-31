import { Request, Response } from 'express';
import ActivityLog from '../models/ActivityLog';

// Get all activity logs
export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const { entity, action, limit = 100 } = req.query;
    const query: any = {};

    if (entity) {
      query.entity = entity;
    }
    if (action) {
      query.action = action;
    }

    const logs = await ActivityLog.find(query)
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get activity log by ID
export const getActivityLog = async (req: Request, res: Response) => {
  try {
    const log = await ActivityLog.findById(req.params.id)
      .populate('adminId', 'name email');

    if (!log) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    res.json(log);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

