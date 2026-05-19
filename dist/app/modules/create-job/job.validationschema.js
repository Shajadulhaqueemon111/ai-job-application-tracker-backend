"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobZodValidationSchema = void 0;
const zod_1 = require("zod");
// ---------------- COMPANY ----------------
const companySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    logo: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
});
// ---------------- SALARY ----------------
const salarySchema = zod_1.z.object({
    min: zod_1.z.coerce.number().optional(),
    max: zod_1.z.coerce.number().optional(),
    currency: zod_1.z.string().default('USD'),
});
// ---------------- JOB VALIDATION ----------------
const createJobValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Job title is required'),
        company: companySchema,
        location: zod_1.z.string().min(1, 'Location is required'),
        workType: zod_1.z.enum(['Remote', 'Hybrid', 'Onsite']),
        employmentType: zod_1.z.enum([
            'Full-time',
            'Part-time',
            'Internship',
            'Contract',
        ]),
        experienceLevel: zod_1.z.enum(['Junior', 'Mid', 'Senior']),
        salary: salarySchema.optional(),
        skills: zod_1.z.array(zod_1.z.string()).optional(),
        description: zod_1.z.string().min(1),
        responsibilities: zod_1.z.array(zod_1.z.string()).optional(),
        requirements: zod_1.z.array(zod_1.z.string()).optional(),
        benefits: zod_1.z.array(zod_1.z.string()).optional(),
        applicationDeadline: zod_1.z.string().optional(),
        // createdBy: z.string(),
    }),
});
// ---------------- APPLICATION VALIDATION ----------------
const createApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        email: zod_1.z.string().email(),
        resumeLink: zod_1.z.string().url(),
        coverNote: zod_1.z.string().optional(),
        jobId: zod_1.z.string().min(1),
    }),
});
exports.JobZodValidationSchema = {
    createJobValidationSchema,
    createApplicationValidationSchema,
};
