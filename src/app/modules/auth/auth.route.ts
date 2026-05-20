import express from 'express';
import { loginUser, logout, verifyOTP } from './auth.controller';
import validateRequest from '../../middleware/validationRequest';
import { loginZodValidationSchema } from './auth.zodvalidation';
import { verifyOtpZodSchema } from './otp-zod-schema';

const route = express.Router();

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
route.post('/logout', logout);

export const authRoute = route;
