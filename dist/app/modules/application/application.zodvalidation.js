"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationZodValidationSchema = void 0;
const zod_1 = require("zod");
const createApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobId: zod_1.z.string().min(1, { message: 'Job ID is required' }),
        name: zod_1.z.string().min(1, { message: 'Name is required' }),
        email: zod_1.z.string().email({ message: 'Invalid email format' }),
        resumeLink: zod_1.z.string().url({ message: 'Resume must be a valid URL' }),
        coverNote: zod_1.z.string().optional(),
    }),
});
exports.ApplicationZodValidationSchema = {
    createApplicationValidationSchema,
};
