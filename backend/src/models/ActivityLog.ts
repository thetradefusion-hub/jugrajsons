import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  entity: 'product' | 'order' | 'user' | 'coupon' | 'settings' | 'other';
  entityId: mongoose.Types.ObjectId | string;
  entityName: string;
  details: string;
  ipAddress: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entity: {
      type: String,
      enum: ['product', 'order', 'user', 'coupon', 'settings', 'other'],
      required: true,
    },
    entityId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    entityName: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ActivityLogSchema.index({ adminId: 1, createdAt: -1 });
ActivityLogSchema.index({ entity: 1, createdAt: -1 });
ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;

