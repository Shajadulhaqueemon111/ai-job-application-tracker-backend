// src/modules/job/job.zodvalidation.ts

import { z } from 'zod';

// ---------------- JOB VALIDATION ----------------
const createJobValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Job title is required' }),
    company: z.string().min(1, { message: 'Company name is required' }),
    location: z.string().min(1, { message: 'Location is required' }),
    category: z.string().min(1, { message: 'Category is required' }),
    description: z.string().min(1, { message: 'Job description is required' }),
  }),
});

// ---------------- APPLICATION VALIDATION ----------------
const createApplicationValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email format' }),
    resumeLink: z.string().url({ message: 'Resume must be a valid URL' }),
    coverNote: z.string().optional(),
    jobId: z.string().min(1, { message: 'Job ID is required' }),
  }),
});

export const JobZodValidationSchema = {
  createJobValidationSchema,
  createApplicationValidationSchema,
};
