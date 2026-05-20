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
const route = express_1.default.Router();
route.post('/login', (0, validationRequest_1.default)(auth_zodvalidation_1.loginZodValidationSchema.loginValidationSchema), auth_controller_1.loginUser);
route.post('/verify-otp', (0, validationRequest_1.default)(otp_zod_schema_1.verifyOtpZodSchema), auth_controller_1.verifyOTP);
// route.post(
//   '/refresh-token',
//   validateRequest(loginZodValidationSchema.refreshTokenValidationSchema),
// );
route.post('/logout', auth_controller_1.logout);
exports.authRoute = route;
