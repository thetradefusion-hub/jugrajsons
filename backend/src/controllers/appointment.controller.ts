import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Appointment from '../models/Appointment';
import Expert from '../models/Expert';

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { expertId, appointmentDate, appointmentTime, consultationType, reason, duration } = req.body;

    if (!expertId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ message: 'Expert ID, date, and time are required' });
    }

    // Check if expert exists
    const expert = await Expert.findById(expertId);
    if (!expert || !expert.isActive) {
      return res.status(404).json({ message: 'Expert not found or inactive' });
    }

    // Check if expert is available
    if (!expert.available) {
      return res.status(400).json({ message: 'Expert is currently unavailable' });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      expert: expertId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      user: req.user!._id,
      expert: expertId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      duration: duration || 30,
      consultationType: consultationType || 'video',
      reason: reason || '',
      fee: expert.consultationFee || 0,
      paymentStatus: expert.consultationFee > 0 ? 'pending' : 'paid',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('user', 'name email')
      .populate('expert', 'name specialization image');

    res.status(201).json(populatedAppointment);
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find({ user: req.user!._id })
      .populate('expert', 'name specialization image phone email')
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpertAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const { expertId } = req.params;
    const appointments = await Appointment.find({ expert: expertId })
      .populate('user', 'name email phone')
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { status, notes, paymentStatus, fee } = req.body;
    const updateData: any = {};
    
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (fee !== undefined) updateData.fee = fee;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email phone')
      .populate('expert', 'name specialization image phone email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const { status, expertId, userId } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (expertId) {
      query.expert = expertId;
    }

    if (userId) {
      query.user = userId;
    }

    const appointments = await Appointment.find(query)
      .populate('user', 'name email phone')
      .populate('expert', 'name specialization image phone email')
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

