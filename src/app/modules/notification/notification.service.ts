import { getIO } from '../../utils/soket';
import { NotificationModel } from './notification.model';

export const NotificationService = {
  // Create notification
  createNotification: async (payload: any) => {
    const notification = await NotificationModel.create(payload);

    // GLOBAL notification
    if (!payload.userId) {
      getIO().emit('notification', notification);
    }

    // PRIVATE notification
    if (payload.userId) {
      getIO().to(payload.userId).emit('notification', notification);
    }

    return notification;
  },

  // Get all notifications for user + global
  getNotifications: async (userId: string) => {
    return await NotificationModel.find({
      $or: [{ userId }, { userId: null }],
    }).sort({ createdAt: -1 });
  },

  // Mark as read
  markAsRead: async (id: string) => {
    return await NotificationModel.findByIdAndUpdate(
      id,
      { read: true },
      { new: true },
    );
  },
  deleteNotification: async (id: string, userId: string) => {
    return await NotificationModel.findOneAndDelete({
      _id: id,
      userId: userId, // IMPORTANT
    });
  },
};
