import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import httpSattus from 'http-status';
export const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.LoginUser(req.body);

  const { accessToken, refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    path: '/',
  });
  res.cookie('accessToken', accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    path: '/',
  });

  sendResponse(res, {
    statusCode: httpSattus.OK,
    success: true,
    message: 'user login successfully',
    data: result,
  });
});

export const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpSattus.OK,
    success: true,
    message: 'accessToken is retrive successfully',
    data: result,
  });
});

export const logout = catchAsync(async (req, res) => {
  const result = await AuthServices.logoutUser(res);
  sendResponse(res, {
    statusCode: httpSattus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});
