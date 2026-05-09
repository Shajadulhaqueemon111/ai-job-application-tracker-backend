import express from 'express';
import { loginUser, logout, refreshToken } from './auth.controller';
import validateRequest from '../../middleware/validationRequest';
import { loginZodValidationSchema } from './auth.zodvalidation';

const route = express.Router();

route.post(
  '/login',
  validateRequest(loginZodValidationSchema.loginValidationSchema),
  loginUser,
);
route.post(
  '/refresh-token',
  validateRequest(loginZodValidationSchema.refreshTokenValidationSchema),
  refreshToken,
);
route.post('/logout', logout);

export const authRoute = route;
