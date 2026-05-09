import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().nonempty('Id is required'),
    password: z.string().nonempty('password is required'),
  }),
});
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().nonempty('Refresh token is required !'),
  }),
});

export const loginZodValidationSchema = {
  loginValidationSchema,
  refreshTokenValidationSchema,
};
