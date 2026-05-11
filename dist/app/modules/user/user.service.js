"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_modle_1 = __importDefault(require("./user.modle"));
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = __importDefault(require("../../error/appError"));
const http_status_1 = __importDefault(require("http-status"));
const admin_modle_1 = __importDefault(require("../admin/admin.modle"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_modle_1.default.create(payload);
    return result;
});
const getAllUserIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_modle_1.default.find();
    return result;
});
const getSingleUserIntoDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_modle_1.default.findById(_id);
    return result;
});
const updateUserIntoDB = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_modle_1.default.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteUserIntoDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_modle_1.default.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
    return result;
});
// create admin
const createAdminIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        role: 'admin',
        email: payload.email,
        name: payload.name,
        profileImage: payload.profileImage || undefined,
        password,
    };
    console.log(userData);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    console.log(session);
    try {
        const newUser = yield user_modle_1.default.create([userData], { session });
        if (!newUser.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'user create failed');
        }
        const adminPayload = Object.assign(Object.assign({}, payload), { user: newUser[0]._id, profileImage: payload.profileImage || undefined });
        console.log(adminPayload);
        const newAdmin = yield admin_modle_1.default.create([adminPayload], { session });
        if (!newAdmin.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'admin created failed');
        }
        yield session.commitTransaction();
        session.endSession();
        return newAdmin[0];
    }
    catch (err) {
        console.log(err);
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
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
exports.userService = {
    createUserIntoDB,
    getAllUserIntoDB,
    getSingleUserIntoDB,
    updateUserIntoDB,
    deleteUserIntoDB,
    createAdminIntoDB,
    // createStudentIntoDB,
    // createTeacherIntoDB,
};
