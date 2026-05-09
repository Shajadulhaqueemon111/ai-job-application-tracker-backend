import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import AppError from '../error/appError';
import { TUserRole } from '../modules/user/user.interface';
import config from '../config';
import { validUserForLogin } from '../modules/auth/auth.utils';
const authValidateRequest = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Autorized !');
    }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    console.log('hi', decoded);

    const { role, email } = decoded;
    if (!email || !role) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Token Payload!');
    }
    const user = await validUserForLogin(email);
    console.log(user);

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You Are Not Autorized !');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default authValidateRequest;
