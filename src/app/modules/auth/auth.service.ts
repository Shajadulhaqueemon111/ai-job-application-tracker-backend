import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import config from '../../config';
import { TLogin } from './auth.interface';
import { checkPassword, validUserForLogin } from './auth.utils';
import { createToken } from './auth.jwtutils';

const LoginUser = async (payload: TLogin) => {
  const { email, password } = payload;

  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User email is undefined');
  }
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User password is undefined');
  }

  // Check if user exists
  const user = await validUserForLogin(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Match password
  const isPasswordMatched = await checkPassword(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User password is incorrect');
  }

  // Prepare JWT payload
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    status: user.status || 'active',
  };

  // Generate access & refresh token
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
  };
};

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

  const { email, role } = decoded;
  if (!email || !role) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Token Payload!');
  }

  // Validate user again (in case user is deleted or blocked)
  const user = await validUserForLogin(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    status: user.status || 'active',
  };
  console.log('Decoded JWT Payload:', jwtPayload);
  // Generate new Access Token only
  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expirense_in,
  );

  return {
    accessToken: newAccessToken,
  };
};
const logoutUser = async (res: any) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return {
    message: 'Successfully logged out',
  };
};

export const AuthServices = {
  LoginUser,
  refreshToken,
  logoutUser,
};
