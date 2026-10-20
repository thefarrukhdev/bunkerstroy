import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform(Number),
  DATABASE_URL: z.string().optional().default('postgresql://bunker_user:bunker_secret_pass@localhost:5432/bunkerstroy_db?schema=public'),
  JWT_SECRET: z.string().default('bunkerstroy_default_jwt_secret_dev_environment_key'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_SECRET: z.string().default('bunkerstroy_default_refresh_secret_dev_environment_key'),
  REFRESH_EXPIRES_IN: z.string().default('30d'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  PAYME_SECRET_KEY: z.string().default('bunker_payme_test_secret_key_2026'),
  PAYME_MERCHANT_ID: z.string().default('bunker_payme_merchant_id'),
  CLICK_SECRET_KEY: z.string().default('bunker_click_test_secret_key_2026'),
  CLICK_SERVICE_ID: z.string().default('38491'),
  CLICK_MERCHANT_ID: z.string().default('29182'),
  GEMINI_API_KEY: z.string().optional(),
  ESKIZ_EMAIL: z.string().optional(),
  ESKIZ_PASSWORD: z.string().optional(),
  ESKIZ_FROM: z.string().default('4546')
});

export const env = envSchema.parse(process.env);

