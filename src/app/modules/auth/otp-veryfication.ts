import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../user/user.modle';
import AppError from '../../error/appError';
import httpStatus from 'http-status';

const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email }).select(
    '+status +password +otp +otpExpire',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // expiry check
  if (user.otpExpire && user.otpExpire < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired');
  }

  // ✅ FIX HERE (NO bcrypt)
  if (user.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  // clear OTP
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  const jwtPayload = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    status: user.status || 'active',
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expirense_in,
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: config.jwt_refresh_expirense_in,
    },
  );

  return { accessToken, refreshToken };
};

export default verifyOTP;
