import express from 'express';
import { NotificationController } from './notification.controller';
import validateRequest from '../../middleware/validationRequest';
import { createNotificationSchema } from './zodValidation';
import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.hr),

  validateRequest(createNotificationSchema),
  NotificationController.createNotification,
);

router.get(
  '/',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.hr, USER_ROLE.user),
  NotificationController.getNotifications,
);

router.patch(
  '/:id/read',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.hr),
  NotificationController.markAsRead,
);

router.delete(
  '/:id',
  authValidateRequest(USER_ROLE.admin, USER_ROLE.hr, USER_ROLE.user),
  NotificationController.deleteNotification,
);

export const NotificationRoutes = router;
