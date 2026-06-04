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
exports.AuthServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("./auth.utils");
const auth_jwtutils_1 = require("./auth.jwtutils");
const sendOtp_1 = require("../../utils/sendOtp");
const user_modle_1 = __importDefault(require("../user/user.modle"));
const LoginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = payload;
    if (!email)
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Email is required');
    if (!password)
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Password is required');
    const user = yield (0, auth_utils_1.validUserForLogin)(email);
    if (user.status === 'blocked') {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Your account has been blocked 🚫');
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Account locked');
    }
    const isPasswordMatched = yield (0, auth_utils_1.checkPassword)(password, user.password);
    if (!isPasswordMatched) {
        const updatedUser = yield user_modle_1.default.findByIdAndUpdate(user._id, { $inc: { loginAttempts: 1 } }, { new: true });
        if (((_a = updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.loginAttempts) !== null && _a !== void 0 ? _a : 0) >= 3) {
            yield user_modle_1.default.findByIdAndUpdate(user._id, {
                lockUntil: new Date(Date.now() + 10 * 60 * 1000),
                loginAttempts: 0,
            });
            throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Too many attempts. Account locked for 10 minutes.');
        }
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Password does not match');
    }
    yield user_modle_1.default.findByIdAndUpdate(user._id, {
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
        const accessToken = (0, auth_jwtutils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expirense_in);
        const refreshToken = (0, auth_jwtutils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expirense_in);
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
    yield user.save();
    yield (0, sendOtp_1.sendOTP)(user.email, otp);
    return {
        twoFactorEnabled: true,
        message: 'OTP sent successfully',
        email: user.email,
        userId: user._id.toString(),
    };
});
// =========================
// 🔐 VERIFY OTP → JWT GENERATE (NEW FUNCTION)
// =========================
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_utils_1.validUserForLogin)(email);
    // check OTP
    if (user.otp !== otp) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid OTP');
    }
    // check expiry
    if (user.otpExpire && user.otpExpire < new Date()) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'OTP expired');
    }
    // clear OTP
    user.otp = undefined;
    user.otpExpire = undefined;
    yield user.save();
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
    const accessToken = (0, auth_jwtutils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expirense_in);
    const refreshToken = (0, auth_jwtutils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expirense_in);
    return {
        accessToken,
        refreshToken,
        userId: user._id.toString(),
    };
});
// =========================
// 🔁 REFRESH TOKEN
// =========================
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not Authorized');
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    }
    catch (err) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Refresh Token!');
    }
    const { email } = decoded;
    if (!email) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Token Payload!');
    }
    const user = yield (0, auth_utils_1.validUserForLogin)(email);
    const jwtPayload = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        status: user.status || 'active',
    };
    const newAccessToken = (0, auth_jwtutils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expirense_in);
    return {
        accessToken: newAccessToken,
    };
});
// =========================
// 🚪 LOGOUT
// =========================
const toggleTwoFactor = (userId, enable) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_modle_1.default.findByIdAndUpdate(userId, { twoFactorEnabled: enable }, { new: true });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return {
        message: `Two-factor authentication ${enable ? 'enabled' : 'disabled'}`,
        twoFactorEnabled: user.twoFactorEnabled,
    };
});
const logoutUser = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/',
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return {
        message: 'Successfully logged out',
    };
});
// =========================
// EXPORT
// =========================
exports.AuthServices = {
    LoginUser,
    verifyOTP,
    refreshToken,
    logoutUser,
    toggleTwoFactor,
};
