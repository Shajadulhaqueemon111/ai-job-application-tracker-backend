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
const hr_moduels_1 = require("../hr/hr.moduels");
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
const createHRIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userData = {
        role: 'hr',
        email: payload.email,
        name: payload.name,
        profileImage: ((_a = payload.company) === null || _a === void 0 ? void 0 : _a.logo) || undefined,
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
        const hrPayload = Object.assign(Object.assign({}, payload), { user: newUser[0]._id, logo: ((_b = payload.company) === null || _b === void 0 ? void 0 : _b.logo) || undefined });
        console.log(hrPayload);
        const newHR = yield hr_moduels_1.HRModel.create([hrPayload], { session });
        if (!newHR.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'hr created failed');
        }
        yield session.commitTransaction();
        session.endSession();
        return newHR[0];
    }
    catch (err) {
        console.log(err);
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
exports.userService = {
    createUserIntoDB,
    getAllUserIntoDB,
    getSingleUserIntoDB,
    updateUserIntoDB,
    deleteUserIntoDB,
    createAdminIntoDB,
    createHRIntoDB,
};
