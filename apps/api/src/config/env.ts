import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const rawRefreshSecret = process.env.JWT_REFRESH_SECRET || process.env.REFRESH_SECRET;
const rawRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || process.env.REFRESH_EXPIRES_IN || '30d';

const rawEnv = {
  ...process.env,
  REFRESH_SECRET: rawRefreshSecret,
  JWT_REFRESH_SECRET: rawRefreshSecret,
  REFRESH_EXPIRES_IN: rawRefreshExpiresIn,
  JWT_REFRESH_EXPIRES_IN: rawRefreshExpiresIn,
};

const DUMMY_JWT_SECRETS = [
  'bunkerstroy_default_jwt_secret_dev_environment_key',
  'super_secret_bunker_jwt_key_change_in_production_min_32_chars',
  'default_secret',
  'secret',
  'changeme',
];

const DUMMY_REFRESH_SECRETS = [
  'bunkerstroy_default_refresh_secret_dev_environment_key',
  'super_secret_bunker_refresh_jwt_key_min_32_chars',
  'default_refresh_secret',
  'refresh_secret',
];

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform((val) => {
    const num = parseInt(val, 10);
    return isNaN(num) ? 4000 : num;
  }),
  DATABASE_URL: z.string().default('postgresql://bunker_user:bunker_secret_pass@localhost:5432/bunkerstroy_db?schema=public'),
  JWT_SECRET: z.string().default('bunkerstroy_default_jwt_secret_dev_environment_key'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_SECRET: z.string().default('bunkerstroy_default_refresh_secret_dev_environment_key'),
  JWT_REFRESH_SECRET: z.string().default('bunkerstroy_default_refresh_secret_dev_environment_key'),
  REFRESH_EXPIRES_IN: z.string().default('30d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  PAYME_SECRET_KEY: z.string().default('bunker_payme_test_secret_key_2026'),
  PAYME_MERCHANT_ID: z.string().default('bunker_payme_merchant_id'),
  CLICK_SECRET_KEY: z.string().default('bunker_click_test_secret_key_2026'),
  CLICK_SERVICE_ID: z.string().default('38491'),
  CLICK_MERCHANT_ID: z.string().default('29182'),
  ESKIZ_EMAIL: z.string().optional(),
  ESKIZ_PASSWORD: z.string().optional(),
  ESKIZ_FROM: z.string().default('4546'),
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === 'production') {
    // 1. DATABASE_URL must be explicitly provided in production and not use dev fallback credentials
    const rawDbUrl = process.env.DATABASE_URL;
    if (!rawDbUrl || rawDbUrl.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DATABASE_URL environment variable is REQUIRED in production!',
        path: ['DATABASE_URL'],
      });
    } else if (rawDbUrl.includes('bunker_secret_pass')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'DATABASE_URL contains unsafe default fallback password ("bunker_secret_pass"). Configure a secure database password in production!',
        path: ['DATABASE_URL'],
      });
    }

    // 2. JWT_SECRET must be strong and non-default in production
    const rawJwtSecret = process.env.JWT_SECRET;
    if (!rawJwtSecret || rawJwtSecret.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_SECRET environment variable is REQUIRED in production!',
        path: ['JWT_SECRET'],
      });
    } else if (DUMMY_JWT_SECRETS.includes(rawJwtSecret)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_SECRET cannot use insecure default development secret in production! Generate a secure secret with at least 32 characters.',
        path: ['JWT_SECRET'],
      });
    } else if (rawJwtSecret.length < 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `JWT_SECRET must be at least 32 characters long for production security (current length: ${rawJwtSecret.length}).`,
        path: ['JWT_SECRET'],
      });
    }

    // 3. JWT_REFRESH_SECRET / REFRESH_SECRET must be strong and non-default in production
    const rawRefresh = process.env.JWT_REFRESH_SECRET || process.env.REFRESH_SECRET;
    if (!rawRefresh || rawRefresh.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_REFRESH_SECRET (or REFRESH_SECRET) is REQUIRED in production!',
        path: ['JWT_REFRESH_SECRET'],
      });
    } else if (DUMMY_REFRESH_SECRETS.includes(rawRefresh)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'JWT_REFRESH_SECRET cannot use insecure default development secret in production! Generate a secure secret with at least 32 characters.',
        path: ['JWT_REFRESH_SECRET'],
      });
    } else if (rawRefresh.length < 32) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `JWT_REFRESH_SECRET must be at least 32 characters long for production security (current length: ${rawRefresh.length}).`,
        path: ['JWT_REFRESH_SECRET'],
      });
    }

    // 4. REDIS_URL validation in production
    const rawRedisUrl = process.env.REDIS_URL;
    if (!rawRedisUrl || rawRedisUrl.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'REDIS_URL environment variable is REQUIRED in production!',
        path: ['REDIS_URL'],
      });
    }
  }
});

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error('\n' + '='.repeat(80));
  console.error('⛔ [CRITICAL CONFIGURATION ERROR] API Server cannot start due to invalid configuration:');
  parsed.error.issues.forEach((issue) => {
    console.error(`  ❌ [${issue.path.join('.') || 'CONFIG'}]: ${issue.message}`);
  });
  console.error('\nPlease verify your environment variables or .env file before starting the server.');
  console.error('='.repeat(80) + '\n');
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
