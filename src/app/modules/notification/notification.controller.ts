import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

export const NotificationController = {
  createNotification: async (req: Request, res: Response) => {
    const result = await NotificationService.createNotification(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  },

  getNotifications: async (req: Request, res: Response) => {
    const userId = req.query.userId as string;

    const result = await NotificationService.getNotifications(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  },

  markAsRead: async (req: Request, res: Response) => {
    const result = await NotificationService.markAsRead(req.params.id);

    res.json({
      success: true,
      data: result,
    });
  },
};
