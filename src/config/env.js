import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().max(65535).default(4000),
    DATABASE_URL: z.url(),
    DB_POOL_MIN: z.coerce.number().int().nonnegative().default(2),
    DB_POOL_MAX: z.coerce.number().int().positive().default(10),
    DB_IDLE_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
    DB_CONNECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(5_000),
    REDIS_USERNAME: z.string().min(1),
    REDIS_HOST: z.string().min(1),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_PORT: z.coerce.number().int().positive(),
    REDIS_MAX_RETRIES: z.coerce.number().int().nonnegative(),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
});

const res = envSchema.safeParse(process.env);

if (!res.success) {
    throw new Error(`Invalid environment configuration: ${z.prettifyError(res.error)}`);
}
const env = Object.freeze(res.data);
export { env };
