import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  user: mongoose.Types.ObjectId;
  expert: mongoose.Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string; // "09:00", "10:00", etc.
  duration: number; // in minutes
  consultationType: 'video' | 'audio' | 'chat' | 'in-person';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string; // reason for consultation
  notes: string;
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expert: { type: Schema.Types.ObjectId, ref: 'Expert', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  duration: { type: Number, default: 30 }, // 30 minutes default
  consultationType: {
    type: String,
    enum: ['video', 'audio', 'chat', 'in-person'],
    default: 'video'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  reason: { type: String, default: '' },
  notes: { type: String, default: '' },
  fee: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);

