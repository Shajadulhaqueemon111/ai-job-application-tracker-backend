import { z } from 'zod';

// ---------------- COMPANY ----------------
const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  logo: z.string().optional(),
  website: z.string().url().optional(),
});

// ---------------- CREATE HR ----------------
const createHRValidationSchema = z.object({
  body: z.object({
    password: z.string().min(6, { message: 'Password is required' }),

    hr: z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      email: z.string().email({ message: 'Invalid email format' }),

      company: companySchema,

      isVerified: z.boolean().optional(),
    }),
  }),
});

// ---------------- UPDATE HR ----------------
const updateHRValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),

    hr: z.object({
      name: z.string().min(1, { message: 'Name is required' }).optional(),
      email: z.string().email({ message: 'Invalid email format' }).optional(),

      company: companySchema.optional(),

      isVerified: z.boolean().optional(),
    }),
  }),
});

export const HRValidationSchema = {
  createHRValidationSchema,
  updateHRValidationSchema,
};
