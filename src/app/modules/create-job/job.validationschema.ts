import { z } from 'zod';

// ---------------- COMPANY ----------------
const companySchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional(),
  website: z.string().optional(),
});

// ---------------- SALARY ----------------
const salarySchema = z.object({
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  currency: z.string().default('USD'),
});
// ---------------- JOB VALIDATION ----------------
const createJobValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Job title is required'),

    company: companySchema,

    location: z.string().min(1, 'Location is required'),

    workType: z.enum(['Remote', 'Hybrid', 'Onsite']),

    employmentType: z.enum([
      'Full-time',
      'Part-time',
      'Internship',
      'Contract',
    ]),

    experienceLevel: z.enum(['Junior', 'Mid', 'Senior']),

    salary: salarySchema.optional(),

    skills: z.array(z.string()).optional(),

    description: z.string().min(1),

    responsibilities: z.array(z.string()).optional(),

    requirements: z.array(z.string()).optional(),

    benefits: z.array(z.string()).optional(),

    applicationDeadline: z.string().optional(),

    // createdBy: z.string(),
  }),
});

// ---------------- APPLICATION VALIDATION ----------------
const createApplicationValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    resumeLink: z.string().url(),
    coverNote: z.string().optional(),
    jobId: z.string().min(1),
  }),
});

export const JobZodValidationSchema = {
  createJobValidationSchema,
  createApplicationValidationSchema,
};
