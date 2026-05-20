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
exports.UserSchema = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'block'],
        default: 'active',
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'hr'],
        default: 'user',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpire: {
        type: Date,
        default: null,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
exports.UserSchema.pre(/^find/, function (next) {
    this.where({ isDeleted: false });
    next();
});
exports.UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // ✅ এই check টা add করুন
        if (!user.isModified('password'))
            return next();
        user.password = yield bcryptjs_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
exports.UserSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
const UserModel = (0, mongoose_1.model)('User', exports.UserSchema);
exports.default = UserModel;
