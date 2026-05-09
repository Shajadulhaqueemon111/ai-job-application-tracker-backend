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
const LoginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    if (!email) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'User email is undefined');
    }
    if (!password) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'User password is undefined');
    }
    // Check if user exists
    const user = yield (0, auth_utils_1.validUserForLogin)(email);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Match password
    const isPasswordMatched = yield (0, auth_utils_1.checkPassword)(password, user.password);
    if (!isPasswordMatched) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'User password is incorrect');
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
    const accessToken = (0, auth_jwtutils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expirense_in);
    const refreshToken = (0, auth_jwtutils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expirense_in);
    return {
        accessToken,
        refreshToken,
    };
});
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
    const { email, role } = decoded;
    if (!email || !role) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Token Payload!');
    }
    // Validate user again (in case user is deleted or blocked)
    const user = yield (0, auth_utils_1.validUserForLogin)(email);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        status: user.status || 'active',
    };
    // Generate new Access Token only
    const newAccessToken = (0, auth_jwtutils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expirense_in);
    return {
        accessToken: newAccessToken,
    };
});
const logoutUser = (res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    return {
        message: 'Successfully logged out',
    };
});
exports.AuthServices = {
    LoginUser,
    refreshToken,
    logoutUser,
};
