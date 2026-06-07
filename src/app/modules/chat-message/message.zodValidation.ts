import { z } from 'zod';

export const createMessageValidation = z.object({
  body: z.object({
    receiverId: z.string(),
    applicationId: z.string(),

    message: z.string().optional(),

    attachment: z.string().optional(),

    attachmentType: z.enum(['image', 'pdf', 'doc']).optional(),
  }),
});
