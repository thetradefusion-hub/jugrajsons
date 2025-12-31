import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  type: 'order' | 'stock' | 'user' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  userId?: mongoose.Types.ObjectId; // For user-specific notifications
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ['order', 'stock', 'user', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
NotificationSchema.index({ read: 1, createdAt: -1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ userId: 1 });

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;

