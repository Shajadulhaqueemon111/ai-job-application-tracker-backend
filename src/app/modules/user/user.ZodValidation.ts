import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty('Name is required'),
    profileImage: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['user', 'student', 'teacher', 'parent', 'admin']).optional(),
    status: z.enum(['active', 'block']).optional(),
    isDelete: z.boolean().default(false),
  }),
});

const updateUserZodSchema = z.object({
  name: z.string().optional(),
  profileImage: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['students', 'teachers', 'parents', 'admin']).optional(),
  status: z.enum(['active', 'block']).optional(),
  isDelete: z.boolean().optional(),
});

export const UserzodValidationSchema = {
  createUserZodSchema,
  updateUserZodSchema,
};
