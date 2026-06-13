import { TAdmin } from '../admin/admin.interface';
import { IUser } from './user.interface';
import UserModel from './user.modle';
import mongoose, { startSession } from 'mongoose';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import AdminModle from '../admin/admin.modle';
import { HRModel } from '../hr/hr.moduels';
import { THR } from '../hr/hr.interface';

const createUserIntoDB = async (payload: IUser) => {
  const result = await UserModel.create(payload);
  return result;
};

const getAllUserIntoDB = async () => {
  const result = await UserModel.find();
  return result;
};

const getSingleUserIntoDB = async (_id: string) => {
  const result = await UserModel.findById(_id);
  return result;
};

const updateUserIntoDB = async (_id: string, payload: Partial<IUser>) => {
  const result = await UserModel.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteUserIntoDB = async (_id: string) => {
  const user = await UserModel.findById(_id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role === 'admin') {
    throw new AppError(httpStatus.FORBIDDEN, 'Admin cannot be deleted');
  }

  const result = await UserModel.findByIdAndUpdate(
    _id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

// create admin
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<IUser> = {
    role: 'admin',
    email: payload.email,
    name: payload.name,
    profileImage: payload.profileImage || undefined,
    password,
  };

  console.log(userData);

  const session = await mongoose.startSession();
  session.startTransaction();
  console.log(session);

  try {
    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'user create failed');
    }

    const adminPayload = {
      ...payload,
      user: newUser[0]._id,
      profileImage: payload.profileImage || undefined,
    };

    console.log(adminPayload);

    const newAdmin = await AdminModle.create([adminPayload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'admin created failed');
    }

    await session.commitTransaction();
    session.endSession();

    return newAdmin[0];
  } catch (err) {
    console.log(err);

    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
const createHRIntoDB = async (password: string, payload: THR) => {
  const userData: Partial<IUser> = {
    role: 'hr',
    email: payload.email,
    name: payload.name,
    profileImage: payload.company?.logo || undefined,
    password,
  };

  console.log(userData);

  const session = await mongoose.startSession();
  session.startTransaction();
  console.log(session);

  try {
    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'user create failed');
    }

    const hrPayload = {
      ...payload,
      user: newUser[0]._id,
      logo: payload.company?.logo || undefined,
    };

    console.log(hrPayload);

    const newHR = await HRModel.create([hrPayload], { session });

    if (!newHR.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'hr created failed');
    }

    await session.commitTransaction();
    session.endSession();

    return newHR[0];
  } catch (err) {
    console.log(err);

    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const userService = {
  createUserIntoDB,
  getAllUserIntoDB,
  getSingleUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
  createAdminIntoDB,
  createHRIntoDB,
};
