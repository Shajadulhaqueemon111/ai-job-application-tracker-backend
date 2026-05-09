"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminZodValidationSchema = void 0;
const zod_1 = require("zod");
const createAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().min(6, { message: 'Password is required' }),
        admin: zod_1.z.object({
            name: zod_1.z.string().min(1, { message: 'Name is required' }),
            email: zod_1.z.string().email({ message: 'Invalid email format' }),
            phoneNumber: zod_1.z.string().min(6, { message: 'Phone number is too short' }),
            profileImage: zod_1.z.string().optional(),
            address: zod_1.z.string().min(1, { message: 'Address is required' }),
        }),
    }),
});
const updateAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().max(20).optional(),
        admin: zod_1.z.object({
            name: zod_1.z.string().min(1, { message: 'Name is required' }).optional(),
            email: zod_1.z.string().email({ message: 'Invalid email format' }).optional(),
            phoneNumber: zod_1.z
                .string()
                .min(6, { message: 'Phone number is too short' })
                .optional(),
            profileImage: zod_1.z.string().url().optional(),
            address: zod_1.z.string().min(1, { message: 'Address is required' }).optional(),
        }),
    }),
});
exports.adminZodValidationSchema = {
    createAdminValidationSchema,
    updateAdminValidationSchema,
};
