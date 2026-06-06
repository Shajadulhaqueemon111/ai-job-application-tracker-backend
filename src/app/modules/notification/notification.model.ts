import { Schema, model } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: String,
      default: null, // null = global
    },
    type: {
      type: String,
      enum: [
        'NEW_JOB',
        'INTERVIEW',
        'APPLICATION_UPDATE',
        'SHORTLISTED',
        'INTERVIEWED',
        'APPLICATION_STATUS_UPDATED',
        'OFFERED',
        'HIRED',
        'REJECTED',
        'AI_SUGGESTION',
        'SYSTEM',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const NotificationModel = model('Notification', notificationSchema);
