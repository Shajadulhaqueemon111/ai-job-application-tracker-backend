import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().optional().nullable(),
  type: z.enum([
    'NEW_JOB',
    'INTERVIEW',
    'APPLICATION_UPDATE',
    'SHORTLISTED',
    'REJECTED',
    'AI_SUGGESTION',
    'SYSTEM',
  ]),
  title: z.string().min(3),
  message: z.string().min(5),
});
