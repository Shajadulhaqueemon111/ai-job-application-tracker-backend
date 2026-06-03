"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationZodValidationSchema = void 0;
const zod_1 = require("zod");
const createApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobId: zod_1.z.string().min(1, 'Job ID is required'),
        fullName: zod_1.z.string().min(1, 'Full name is required'),
        email: zod_1.z.string().email('Invalid email format'),
        phone: zod_1.z.string().min(10, 'Phone number is required'),
        experience: zod_1.z.string().min(1, 'Experience is required'),
        coverLetter: zod_1.z.string().min(10, 'Cover letter is required'),
        // resumeUrl: z.string().url('Resume must be a valid URL'),
        linkedin: zod_1.z.string().url().optional(),
        portfolio: zod_1.z.string().url().optional(),
        agreement: zod_1.z.coerce.boolean().refine((val) => val === true, {
            message: 'You must accept the agreement',
        }),
    }),
});
exports.ApplicationZodValidationSchema = {
    createApplicationValidationSchema,
};
