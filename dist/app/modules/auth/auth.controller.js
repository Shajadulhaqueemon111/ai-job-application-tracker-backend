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
exports.logout = exports.verifyOTP = exports.loginUser = void 0;
const config_1 = __importDefault(require("../../config"));
const authMediware_1 = require("../../middleware/authMediware");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_audit_model_1 = __importDefault(require("./auth.audit.model"));
const auth_service_1 = require("./auth.service");
const http_status_1 = __importDefault(require("http-status"));
// export const loginUser = catchAsync(async (req, res) => {
//   const result = await AuthServices.LoginUser(req.body);
//   const { accessToken, refreshToken } = result;
//   res.cookie('refreshToken', refreshToken, {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: 'none',
//     path: '/',
//   });
//   res.cookie('accessToken', accessToken, {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: 'none',
//     path: '/',
//   });
//   sendResponse(res, {
//     statusCode: httpSattus.OK,
//     success: true,
//     message: 'user login successfully',
//     data: result,
//   });
// });
exports.loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.LoginUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP sent successfully',
        data: result,
    });
}));
exports.verifyOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const result = yield auth_service_1.AuthServices.verifyOTP(email, otp);
    const { ip, browser, os, device } = (0, authMediware_1.GetAuditLogger)(req);
    yield auth_audit_model_1.default.create({
        userId: result.userId.toString(),
        email: email,
        action: 'LOGIN_SUCCESS',
        ip,
        browser,
        os,
        device,
    });
    res.cookie('accessToken', result.accessToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });
    res.cookie('refreshToken', result.refreshToken, {
        secure: config_1.default.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'OTP verified successfully',
        data: result,
    });
}));
exports.logout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { ip, browser, os, device } = (0, authMediware_1.GetAuditLogger)(req);
    const userId = ((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || 'unknown';
    const email = ((_c = req.user) === null || _c === void 0 ? void 0 : _c.email) || 'unknown';
    yield auth_audit_model_1.default.create({
        userId,
        email,
        action: 'LOGOUT',
        ip,
        browser,
        os,
        device,
    });
    const result = yield auth_service_1.AuthServices.logoutUser(res);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
}));
