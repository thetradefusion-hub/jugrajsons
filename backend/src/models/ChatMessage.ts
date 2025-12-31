import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  user: mongoose.Types.ObjectId;
  expert: mongoose.Types.ObjectId;
  message: string;
  sender: 'user' | 'expert';
  read: boolean;
  createdAt: Date;
}

const ChatMessageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expert: { type: Schema.Types.ObjectId, ref: 'Expert', required: true },
  message: { type: String, required: true },
  sender: { type: String, enum: ['user', 'expert'], required: true },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for faster queries
ChatMessageSchema.index({ user: 1, expert: 1, createdAt: -1 });

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

