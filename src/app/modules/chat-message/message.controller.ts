import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { MessageService } from './message.service';

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const user = req.user; // 👈 authenticated HR/user

  const payload = {
    senderId: user._id,
    receiverId: req.body.receiverId, // must already be ObjectId
    message: req.body.message,
    applicationId: req.body.applicationId,
    attachments: req.body.attachments,
  };

  const result = await MessageService.sendMessage(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Message sent successfully',
    data: result,
  });
});

const getConversation = catchAsync(async (req: Request, res: Response) => {
  const { applicationId } = req.params;

  const result = await MessageService.getConversation(
    applicationId,
    req.user._id.toString(),
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Conversation retrieved successfully',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { messageId } = req.params;

  const result = await MessageService.markAsRead(messageId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Message marked as read',
    data: result,
  });
});

const getUnreadMessages = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await MessageService.getUnreadMessages(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Unread messages retrieved successfully',
    data: result,
  });
});
const getApplicationsWithMessages = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await MessageService.getApplicationsWithMessages(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Unread messages retrieved successfully',
    data: result,
  });
};
const getChatSummary = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await MessageService.getChatSummary(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat summary fetched successfully',
    data: result,
  });
});
export const MessageController = {
  sendMessage,
  getConversation,
  markAsRead,
  getUnreadMessages,
  getApplicationsWithMessages,
  getChatSummary,
};
