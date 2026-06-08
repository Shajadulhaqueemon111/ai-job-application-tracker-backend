import httpStatus from 'http-status';

import { Message } from './message.model';
import AppError from '../../error/appError';
import { getIO } from '../../utils/soket';
import { NotificationModel } from '../notification/notification.model';
import { JobApplication } from '../application/application.modle';
import { Types } from 'mongoose';

const sendMessage = async (payload: any) => {
  // ১. ডাটাবেজে মেসেজ ক্রিয়েট করা
  const result = await Message.create(payload);

  const io = getIO();

  io.to(payload.applicationId.toString()).emit('newMessage', result);

  io.to(payload.receiverId.toString()).emit('notification', {
    type: 'message',
    title: 'New Message',
    message: payload.message,
    applicationId: payload.applicationId,
  });

  // ডাটাবেজে নোটিফিকেশন সেভ করা
  try {
    await NotificationModel.create({
      userId: payload.receiverId, // 👈 FIX: নোটিফিকেশন রিসিভার পাবে, সেন্ডার নিজে নয়!
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
  const application = await JobApplication.findById(applicationId).populate<{
    jobId: { createdBy: Types.ObjectId };
  }>('jobId');

  if (!application || !application.userId) {
    throw new Error('Application not found');
  }

  const isApplicant = application.userId.toString() === userId;

  const isHR = application.jobId?.createdBy.toString() === userId;

  if (!isApplicant && !isHR) {
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
