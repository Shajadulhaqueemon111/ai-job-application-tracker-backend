"use strict";
// src/modules/job/job.zodvalidation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobZodValidationSchema = void 0;
const zod_1 = require("zod");
// ---------------- JOB VALIDATION ----------------
const createJobValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: 'Job title is required' }),
        company: zod_1.z.string().min(1, { message: 'Company name is required' }),
        location: zod_1.z.string().min(1, { message: 'Location is required' }),
        category: zod_1.z.string().min(1, { message: 'Category is required' }),
        description: zod_1.z.string().min(1, { message: 'Job description is required' }),
    }),
});
// ---------------- APPLICATION VALIDATION ----------------
const createApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: 'Name is required' }),
        email: zod_1.z.string().email({ message: 'Invalid email format' }),
        resumeLink: zod_1.z.string().url({ message: 'Resume must be a valid URL' }),
        coverNote: zod_1.z.string().optional(),
        jobId: zod_1.z.string().min(1, { message: 'Job ID is required' }),
    }),
});
exports.JobZodValidationSchema = {
    createJobValidationSchema,
    createApplicationValidationSchema,
};
