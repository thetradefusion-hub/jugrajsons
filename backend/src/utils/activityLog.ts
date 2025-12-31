import ActivityLog from '../models/ActivityLog';

interface CreateActivityLogParams {
  adminId: any;
  action: string;
  entity: 'product' | 'order' | 'user' | 'coupon' | 'settings' | 'other' | 'review';
  entityId: any;
  entityName: string;
  details: string;
  ipAddress: string;
}

export const createActivityLog = async (params: CreateActivityLogParams) => {
  try {
    await ActivityLog.create(params);
  } catch (error) {
    console.error('Error creating activity log:', error);
  }
};

