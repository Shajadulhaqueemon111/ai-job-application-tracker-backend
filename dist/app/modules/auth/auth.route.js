"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validationRequest_1 = __importDefault(require("../../middleware/validationRequest"));
const auth_zodvalidation_1 = require("./auth.zodvalidation");
const otp_zod_schema_1 = require("./otp-zod-schema");
const authValidation_1 = __importDefault(require("../../middleware/authValidation"));
const user_constant_1 = require("../user/user.constant");
const route = express_1.default.Router();
route.get('/me', (0, authValidation_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.hr), auth_controller_1.getMe);
route.post('/login', (0, validationRequest_1.default)(auth_zodvalidation_1.loginZodValidationSchema.loginValidationSchema), auth_controller_1.loginUser);
route.post('/verify-otp', (0, validationRequest_1.default)(otp_zod_schema_1.verifyOtpZodSchema), auth_controller_1.verifyOTP);
// route.post(
//   '/refresh-token',
//   validateRequest(loginZodValidationSchema.refreshTokenValidationSchema),
// );
route.get('/audit-logs', (0, authValidation_1.default)(user_constant_1.USER_ROLE.admin), auth_controller_1.getAuditLogs);
route.patch('/2fa/toggle', (0, authValidation_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.hr), auth_controller_1.toggleTwoFactor);
route.post('/logout', auth_controller_1.logout);
exports.authRoute = route;
