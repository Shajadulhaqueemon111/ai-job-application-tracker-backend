import jwt, { SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: Record<string, unknown>,
  secret: string,
  expiresIn: SignOptions['expiresIn'], // ✅ এটাই best practice
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(jwtPayload, secret, options);
};
