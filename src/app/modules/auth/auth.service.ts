import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import config from '../../config';
import { TLogin } from './auth.interface';
import { checkPassword, validUserForLogin } from './auth.utils';
import { createToken } from './auth.jwtutils';
import { sendOTP } from '../../utils/sendOtp';
import UserModel from '../user/user.modle';

const LoginUser = async (payload: TLogin) => {
  const { email, password } = payload;

  if (!email) throw new AppError(httpStatus.BAD_REQUEST, 'Email is required');
  if (!password)
    throw new AppError(httpStatus.BAD_REQUEST, 'Password is required');

  const user = await validUserForLogin(email);

  if (user.lockUntil && user.lockUntil > new Date()) {
    throw new AppError(httpStatus.FORBIDDEN, 'Account locked');
  }

  const isPasswordMatched = await checkPassword(password, user.password);

  if (!isPasswordMatched) {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { $inc: { loginAttempts: 1 } },
      { new: true },
    );

    if ((updatedUser?.loginAttempts ?? 0) >= 3) {
      await UserModel.findByIdAndUpdate(user._id, {
        lockUntil: new Date(Date.now() + 10 * 60 * 1000),
        loginAttempts: 0,
      });
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Too many attempts. Account locked for 10 minutes.',
      );
    }

    throw new AppError(httpStatus.BAD_REQUEST, 'Password does not match');
  }

  await UserModel.findByIdAndUpdate(user._id, {
    lastLogin: new Date(),
    loginAttempts: 0,
    lockUntil: null,
  });

  // ✅ 2FA disabled হলে সরাসরি token দাও
  if (!user.twoFactorEnabled) {
    const jwtPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      status: user.status || 'active',
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expirense_in,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expirense_in,
    );

    return {
      twoFactorEnabled: false,
      accessToken,
      refreshToken,
      userId: user._id.toString(),
      email: user.email,
    };
  }

  // ✅ 2FA enabled হলে OTP পাঠাও
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();
  await sendOTP(user.email, otp);

  return {
    twoFactorEnabled: true,
    message: 'OTP sent successfully',
    email: user.email,
    userId: user._id.toString(),
  };
};

// =========================
// 🔐 VERIFY OTP → JWT GENERATE (NEW FUNCTION)
// =========================

const verifyOTP = async (email: string, otp: string) => {
  const user = await validUserForLogin(email);

  // check OTP
  if (user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  // check expiry
  if (user.otpExpire && user.otpExpire < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired');
  }

  // clear OTP
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  // JWT payload
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    status: user.status || 'active',
  };

  // generate tokens
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expirense_in,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expirense_in,
  );

  return {
    accessToken,
    refreshToken,
    userId: user._id.toString(),
  };
};

// =========================
// 🔁 REFRESH TOKEN
// =========================

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized');
  }

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(
      token,
      config.jwt_refresh_secret as string,
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Refresh Token!');
  }

  const { email } = decoded;

  if (!email) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Token Payload!');
  }

  const user = await validUserForLogin(email);

  const jwtPayload = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    status: user.status || 'active',
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expirense_in,
  );

  return {
    accessToken: newAccessToken,
  };
};

// =========================
// 🚪 LOGOUT
// =========================
const toggleTwoFactor = async (userId: string, enable: boolean) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { twoFactorEnabled: enable },
    { new: true },
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return {
    message: `Two-factor authentication ${enable ? 'enabled' : 'disabled'}`,
    twoFactorEnabled: user.twoFactorEnabled,
  };
};

const logoutUser = async (res: any) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  return {
    message: 'Successfully logged out',
  };
};

// =========================
// EXPORT
// =========================

export const AuthServices = {
  LoginUser,
  verifyOTP,
  refreshToken,
  logoutUser,
  toggleTwoFactor,
};
