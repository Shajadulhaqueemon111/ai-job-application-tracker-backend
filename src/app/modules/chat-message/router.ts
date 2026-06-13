import express from 'express';

import { MessageController } from './message.controller';
import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middleware/validationRequest';
import { createMessageValidation } from './message.zodValidation';

const router = express.Router();

router.post(
  '/send',
  authValidateRequest(USER_ROLE.hr, USER_ROLE.user),
  validateRequest(createMessageValidation),
  MessageController.sendMessage,
);

router.get(
  '/conversation/:applicationId',
  authValidateRequest(USER_ROLE.hr, USER_ROLE.user),
  MessageController.getConversation,
);
router.get(
  '/active-applications/:userId',
  authValidateRequest(USER_ROLE.hr, USER_ROLE.user),
  MessageController.getApplicationsWithMessages,
);
router.get(
  '/summary/:userId',
  authValidateRequest(USER_ROLE.hr, USER_ROLE.user),
  MessageController.getChatSummary,
);
router.patch(
  '/read/:messageId',
  authValidateRequest(USER_ROLE.hr, USER_ROLE.user),
  MessageController.markAsRead,
);

router.get(
  '/unread/:userId',
  authValidateRequest(USER_ROLE.hr, USER_ROLE.user),
  MessageController.getUnreadMessages,
);

export const MessageRoutes = router;
