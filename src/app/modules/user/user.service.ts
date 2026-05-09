import { TAdmin } from '../admin/admin.interface';
import { IUser } from './user.interface';
import UserModel from './user.modle';
import mongoose, { startSession } from 'mongoose';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import AdminModle from '../admin/admin.modle';

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

// const createStudentIntoDB = async (password: string, payload: TStudent) => {
//   const userData: Partial<IUser> = {
//     role: 'student',
//     name: payload.name,
//     email: payload.email,
//     password,
//   };
//   console.log(userData);

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   console.log(session);
//   try {
//     const newUser = await UserModel.create([userData], { session });

//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'user create failed');
//     }

//     const studentPayload = {
//       ...payload,
//       user: newUser[0]._id,
//       profileImage: payload.profileImage || undefined,
//     };
//     console.log(studentPayload);

//     const newStudent = await StudentModle.create([studentPayload], { session });
//     if (!newStudent.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'student created failed');
//     }
//     await session.commitTransaction();
//     session.endSession();
//     console.log(newStudent);
//   } catch (err) {
//     console.log(err);
//     await session.abortTransaction();
//     session.endSession();
//     throw err;
//   }
// };

// const createTeacherIntoDB = async (password: string, payload: TTeacher) => {
//   const userData: Partial<IUser> = {
//     role: 'teacher',
//     name: payload.name,
//     email: payload.email,
//     password,
//   };

//   const session = await mongoose.startSession();
//   session.startTransaction();
//   console.log(session);

//   try {
//     const newUser = await UserModel.create([userData], { session });
//     if (!newUser.length) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'user not create');
//     }

//     const techerPayload = {
//       ...payload,
//       user: newUser[0]._id,
//       profieImage: payload.profileImage || undefined,
//     };

//     console.log(techerPayload);

//     const newTeacher = await TeacherModle.create([techerPayload], { session });
//     console.log(newTeacher);

//     if (!newTeacher.length) {
//       throw new AppError(httpStatus.OK, 'teacher not created');
//     }
//     await session.commitTransaction();
//     session.endSession();
//     return newTeacher[0];
//   } catch (err) {
//     console.log(err);
//     await session.abortTransaction();
//     session.endSession();
//   }
// };
export const userService = {
  createUserIntoDB,
  getAllUserIntoDB,
  getSingleUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB,
  createAdminIntoDB,
  // createStudentIntoDB,
  // createTeacherIntoDB,
};
