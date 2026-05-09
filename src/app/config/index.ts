import dotenv from 'dotenv';
import path from 'path';
import { SignOptions } from 'jsonwebtoken';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_access_expirense_in: process.env
    .JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'], // ✅ EXPIRESE → EXPIRES
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_refresh_expirense_in: process.env
    .JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'], // ✅ EXPIRESE → EXPIRES
};
