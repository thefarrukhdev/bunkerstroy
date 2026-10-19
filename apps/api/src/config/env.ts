import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform(Number),
  DATABASE_URL: z.string().optional().default('postgresql://bunker_user:bunker_secret_pass@localhost:5432/bunkerstroy_db?schema=public'),
  JWT_SECRET: z.string().default('bunkerstroy_default_jwt_secret_dev_environment_key'),
  GEMINI_API_KEY: z.string().optional(),
  ESKIZ_EMAIL: z.string().optional(),
  ESKIZ_PASSWORD: z.string().optional(),
  ESKIZ_FROM: z.string().default('4546')
});

export const env = envSchema.parse(process.env);
