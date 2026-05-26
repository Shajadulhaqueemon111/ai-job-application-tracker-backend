import config from '../../config';
import { GetAuditLogger } from '../../middleware/authMediware';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import UserModel from '../user/user.modle';
import AuditLogModel from './auth.audit.model';
import { AuthServices } from './auth.service';
import httpSattus from 'http-status';
// export const loginUser = catchAsync(async (req, res) => {
//   const result = await AuthServices.LoginUser(req.body);

//   const { accessToken, refreshToken } = result;
//   res.cookie('refreshToken', refreshToken, {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: 'none',
//     path: '/',
//   });
//   res.cookie('accessToken', accessToken, {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: 'none',
//     path: '/',
//   });

//   sendResponse(res, {
//     statusCode: httpSattus.OK,
//     success: true,
//     message: 'user login successfully',
//     data: result,
//   });
// });
export const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.LoginUser(req.body);

  sendResponse(res, {
    statusCode: httpSattus.OK,
    success: true,
    message: 'OTP sent successfully',
    data: result,
  });
});

export const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const result = await AuthServices.verifyOTP(email, otp);
  const { ip, browser, os, device } = GetAuditLogger(req);

  await AuditLogModel.create({
    userId: result.userId.toString(),
    email: email,
    action: 'LOGIN_SUCCESS',
    ip,
    browser,
    os,
    device,
  });

  res.cookie('accessToken', result.accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    path: '/',
  });

  res.cookie('refreshToken', result.refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    path: '/',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP verified successfully',
    data: result,
  });
});
export const getMe = catchAsync(async (req, res) => {
  const userId = (req as any).user._id;
  const user = await UserModel.findById(userId);

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  sendResponse(res, {
    statusCode: httpSattus.OK,
    success: true,
    message: 'User fetched successfully',
    data: { user },
  });
});
export const getAuditLogs = catchAsync(async (req, res) => {
  const logs = await AuditLogModel.find().sort({ createdAt: -1 }).limit(100);

  sendResponse(res, {
    statusCode: httpSattus.OK,
    success: true,
    message: 'Audit logs fetched successfully',
    data: logs,
  });
});
export const toggleTwoFactor = catchAsync(async (req, res) => {
  const userId = (req as any).user._id;
  const { enable } = req.body;

  const result = await AuthServices.toggleTwoFactor(userId, enable);

  sendResponse(res, {
    statusCode: httpSattus.OK,
    success: true,
    message: '2FA updated successfully',
    data: {
      twoFactorEnabled: result.twoFactorEnabled,
    },
  });
});
export const logout = catchAsync(async (req, res) => {
  const { ip, browser, os, device } = GetAuditLogger(req);

  const userId = (req as any).user?._id?.toString() || 'unknown';
  const email = (req as any).user?.email || 'unknown';

  await AuditLogModel.create({
    userId,
    email,
    action: 'LOGOUT',
    ip,
    browser,
    os,
    device,
  });

  const result = await AuthServices.logoutUser(res);

  sendResponse(res, {
    statusCode: httpSattus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});
