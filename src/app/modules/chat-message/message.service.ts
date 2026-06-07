import httpStatus from 'http-status';

import { Message } from './message.model';
import AppError from '../../error/appError';
import { getIO } from '../../utils/soket';
import { NotificationModel } from '../notification/notification.model';
import { JobApplication } from '../application/application.modle';

const sendMessage = async (payload: any) => {
  const result = await Message.create(payload);

  const io = getIO();

  // 🔥 realtime message
  io.to(payload.receiverId.toString()).emit('receiveMessage', result);

  // 🔔 realtime notification
  io.to(payload.receiverId.toString()).emit('notification', {
    type: 'message',
    title: 'New Message',
    message: payload.message,
  });
  try {
    await NotificationModel.create({
      userId: payload.senderId, // 👈 sender will also get notification for their sent message
      type: 'NEW_MESSAGE',
      title: 'New Message',
      message: payload.message,
      read: false,
    });
  } catch (err) {
    console.error('Notification create failed:', err);
  }
  return result;
};
const getConversation = async (applicationId: string, userId: string) => {
  const application = await JobApplication.findById(applicationId);

  if (!application) {
    throw new Error('Application not found');
  }

  const isOwner =
    application.userId?.toString() === userId ||
    application.jobId?.toString() === userId; // HR side (if needed)

  if (!isOwner) {
    throw new Error('Not authorized');
  }

  const messages = await Message.find({ applicationId })
    .populate('senderId', 'name email profileImage role')
    .populate('receiverId', 'name email profileImage role')
    .sort({ createdAt: 1 });

  return messages;
};

const markAsRead = async (messageId: string) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
  }

  const result = await Message.findByIdAndUpdate(
    messageId,
    {
      isRead: true,
    },
    {
      new: true,
    },
  );

  return result;
};

const getUnreadMessages = async (userId: string) => {
  const result = await Message.find({
    receiverId: userId,
    isRead: false,
  })
    .populate('senderId', 'name email profileImage')
    .sort({ createdAt: -1 });

  return result;
};

export const MessageService = {
  sendMessage,
  getConversation,
  markAsRead,
  getUnreadMessages,
};
