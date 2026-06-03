import { z } from 'zod';

const createApplicationValidationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, 'Job ID is required'),

    fullName: z.string().min(1, 'Full name is required'),

    email: z.string().email('Invalid email format'),

    phone: z.string().min(10, 'Phone number is required'),

    experience: z.string().min(1, 'Experience is required'),

    coverLetter: z.string().min(10, 'Cover letter is required'),

    // resumeUrl: z.string().url('Resume must be a valid URL'),

    linkedin: z.string().url().optional(),
    portfolio: z.string().url().optional(),

    agreement: z.coerce.boolean().refine((val) => val === true, {
      message: 'You must accept the agreement',
    }),
  }),
});

export const ApplicationZodValidationSchema = {
  createApplicationValidationSchema,
};
