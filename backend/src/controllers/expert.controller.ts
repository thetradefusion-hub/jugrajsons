import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Expert from '../models/Expert';

export const getExperts = async (req: Request, res: Response) => {
  try {
    const { specialization, available, search } = req.query;
    const query: any = { isActive: true };

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (available === 'true') {
      query.available = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { specialties: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const experts = await Expert.find(query)
      .sort({ rating: -1, totalConsultations: -1 });

    res.json(experts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpert = async (req: Request, res: Response) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    res.json(expert);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createExpert = async (req: AuthRequest, res: Response) => {
  try {
    const expert = await Expert.create(req.body);
    res.status(201).json(expert);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Expert with this email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateExpert = async (req: AuthRequest, res: Response) => {
  try {
    const expert = await Expert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    res.json(expert);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Expert with this email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpert = async (req: AuthRequest, res: Response) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }
    res.json({ message: 'Expert deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

