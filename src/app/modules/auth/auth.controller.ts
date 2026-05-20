import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
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
  console.log('Login Result:', result);
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

  res.cookie('accessToken', result.accessToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  res.cookie('refreshToken', result.refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP verified successfully',
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
