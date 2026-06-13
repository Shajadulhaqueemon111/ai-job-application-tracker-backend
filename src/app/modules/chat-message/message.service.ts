import httpStatus from 'http-status';

import { Message } from './message.model';
import AppError from '../../error/appError';
import { getIO } from '../../utils/soket';
import { NotificationModel } from '../notification/notification.model';
import { JobApplication } from '../application/application.modle';
import { Types } from 'mongoose';

const sendMessage = async (payload: any) => {
  const result = await Message.create(payload);

  const io = getIO();

  io.to(payload.applicationId.toString()).emit('newMessage', result);

  io.to(payload.receiverId.toString()).emit('notification', {
    type: 'message',
    title: 'New Message',
    message: payload.message,
    applicationId: payload.applicationId,
  });

  try {
    await NotificationModel.create({
      userId: payload.receiverId,
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
const getApplicationsWithMessages = async (userId: string) => {
  // এই user related সব unique applicationId গুলো বের করো
  const applicationIds = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).distinct('applicationId');

  return applicationIds;
};
// ✅ এই function টা MessageService-এ add করো

const getChatSummary = async (userId: string) => {
  // এই user-এর সব applicationId বের করো
  const applicationIds = await Message.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).distinct('applicationId');

  // প্রতিটা applicationId-এর জন্য last message + unread count বের করো
  const summaries = await Promise.all(
    applicationIds.map(async (applicationId) => {
      // last message
      const lastMessage = await Message.findOne({ applicationId })
        .sort({ createdAt: -1 })
        .select('message senderId createdAt attachments')
        .lean();

      // unread count — যেগুলো আমার কাছে এসেছে কিন্তু পড়িনি
      const unreadCount = await Message.countDocuments({
        applicationId,
        receiverId: userId,
        isRead: false,
      });

      return {
        applicationId: applicationId.toString(),
        lastMessage: lastMessage
          ? {
              text: lastMessage.message,
              time: lastMessage.createdAt,
              fromMe: lastMessage.senderId?.toString() === userId,
              hasAttachment:
                Array.isArray(lastMessage.attachment) &&
                lastMessage.attachment.length > 0,
            }
          : null,
        unreadCount,
      };
    }),
  );

  return summaries;
};

export const MessageService = {
  sendMessage,
  getConversation,
  markAsRead,
  getUnreadMessages,
  getApplicationsWithMessages,
  getChatSummary,
};
