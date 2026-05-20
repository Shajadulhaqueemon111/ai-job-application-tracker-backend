import { z } from 'zod';

export const verifyOtpZodSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().min(4).max(6),
  }),
});
