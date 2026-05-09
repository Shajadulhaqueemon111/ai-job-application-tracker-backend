import { z } from 'zod';

const createApplicationValidationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, { message: 'Job ID is required' }),
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email format' }),
    resumeLink: z.string().url({ message: 'Resume must be a valid URL' }),
    coverNote: z.string().optional(),
  }),
});

export const ApplicationZodValidationSchema = {
  createApplicationValidationSchema,
};
