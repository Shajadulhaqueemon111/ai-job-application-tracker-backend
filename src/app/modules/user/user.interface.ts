import { USER_ROLE } from './user.constant';

export interface IUser {
  name: string;
  profileImage: string;
  status?: 'active' | 'blocked';
  email: string;
  password: string;
  role: 'user' | 'admin' | 'hr';
  isDeleted: boolean;
  otp?: string;
  otpExpire?: Date;
  lastLogin?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  twoFactorEnabled?: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
