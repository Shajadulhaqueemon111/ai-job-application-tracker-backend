"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserzodValidationSchema = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty('Name is required'),
        profileImage: zod_1.z.string().optional(),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        role: zod_1.z.enum(['user', 'student', 'teacher', 'parent', 'admin']).optional(),
        status: zod_1.z.enum(['active', 'block']).optional(),
        isDelete: zod_1.z.boolean().default(false),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    profileImage: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    role: zod_1.z.enum(['students', 'teachers', 'parents', 'admin']).optional(),
    status: zod_1.z.enum(['active', 'block']).optional(),
    isDelete: zod_1.z.boolean().optional(),
});
exports.UserzodValidationSchema = {
    createUserZodSchema,
    updateUserZodSchema,
};
