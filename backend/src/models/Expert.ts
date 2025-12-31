import mongoose, { Schema, Document } from 'mongoose';

export interface IExpert extends Document {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number; // in years
  qualification: string[];
  bio: string;
  image: string;
  languages: string[];
  available: boolean;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  totalConsultations: number;
  specialties: string[]; // e.g., ["Digestive Health", "Skin Care"]
  availableSlots: {
    day: string; // "Monday", "Tuesday", etc.
    startTime: string; // "09:00"
    endTime: string; // "17:00"
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExpertSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true, default: 0 },
  qualification: [{ type: String }],
  bio: { type: String, default: '' },
  image: { type: String, default: '' },
  languages: [{ type: String }],
  available: { type: Boolean, default: true },
  consultationFee: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  totalConsultations: { type: Number, default: 0 },
  specialties: [{ type: String }],
  availableSlots: [{
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IExpert>('Expert', ExpertSchema);

