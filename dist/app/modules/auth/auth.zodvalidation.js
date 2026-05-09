"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginZodValidationSchema = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().nonempty('Id is required'),
        password: zod_1.z.string().nonempty('password is required'),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string().nonempty('Refresh token is required !'),
    }),
});
exports.loginZodValidationSchema = {
    loginValidationSchema,
    refreshTokenValidationSchema,
};
