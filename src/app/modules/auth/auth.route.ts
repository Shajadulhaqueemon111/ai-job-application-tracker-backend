import express from 'express';
import {
  getAuditLogs,
  getMe,
  loginUser,
  logout,
  toggleTwoFactor,
  verifyOTP,
} from './auth.controller';
import validateRequest from '../../middleware/validationRequest';
import { loginZodValidationSchema } from './auth.zodvalidation';
import { verifyOtpZodSchema } from './otp-zod-schema';
import authValidateRequest from '../../middleware/authValidation';
import { USER_ROLE } from '../user/user.constant';

const route = express.Router();
route.get(
  '/me',
  authValidateRequest(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.hr),
  getMe,
);
route.post(
  '/login',

  validateRequest(loginZodValidationSchema.loginValidationSchema),
  loginUser,
);

route.post('/verify-otp', validateRequest(verifyOtpZodSchema), verifyOTP);
// route.post(
//   '/refresh-token',
//   validateRequest(loginZodValidationSchema.refreshTokenValidationSchema),

// );

route.get('/audit-logs', authValidateRequest(USER_ROLE.admin), getAuditLogs);

route.patch(
  '/2fa/toggle',
  authValidateRequest(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.hr),
  toggleTwoFactor,
);
route.post('/logout', logout);

export const authRoute = route;
