/**
 * @repo/env-config — Centralized Environment Validation
 *
 * Validates all required environment variables at startup using Zod.
 * If any variable is missing or invalid, the app fails fast with a
 * clear error message — no "ghost" data errors in production.
 *
 * Usage:
 *   import { env, isProd, dbConfig, sheetsConfig } from '@repo/env-config';
 */

import { z } from 'zod';

// ─── Schema ──────────────────────────────────────────────────────────────────

const envSchema = z.object({
    // ── Database (PostgreSQL) ─────────────────────────────────────────────
    DATABASE_URL: z
        .string({ required_error: 'DATABASE_URL is required' })
        .min(1, 'DATABASE_URL cannot be empty'),

    USE_PROD_DB: z
        .enum(['true', 'false'])
        .default('false')
        .transform(v => v === 'true'),

    PROD_DATABASE_URL: z.string().default(''),
    DEV_DATABASE_URL: z.string().default(''),

    // ── Google Sheets (downstream mirror) ─────────────────────────────────
    SHEETS_SYNC_ENABLED: z
        .enum(['true', 'false'])
        .default('false')
        .transform(v => v === 'true'),

    // Feature flag: master switch for all Sheets/n8n sync. Default false.
    ENABLE_GOOGLE_SHEETS_SYNC: z
        .enum(['true', 'false'])
        .default('false')
        .transform(v => v === 'true'),

    GOOGLE_SHEET_ID: z
        .string()
        .default(''),

    GOOGLE_SHEETS_CLIENT_EMAIL: z
        .string()
        .default(''),

    GOOGLE_SHEETS_PRIVATE_KEY: z
        .string()
        .default(''),

    // ── n8n (optional — for non-Sheets workflows) ─────────────────────────
    N8N_WEBHOOK_URL: z
        .string()
        .default(''),

    // ── Google Forms Webhook ──────────────────────────────────────────────
    FORMS_WEBHOOK_SECRET: z
        .string()
        .default(''),

    // ── Environment ───────────────────────────────────────────────────────
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),

    // ── NextAuth ──────────────────────────────────────────────────────────
    NEXTAUTH_URL: z.string().default('http://localhost:3000'),
    NEXTAUTH_SECRET: z.string().default(''),

    // ── Twilio / WhatsApp ─────────────────────────────────────────────────
    TWILIO_ACCOUNT_SID: z.string().default(''),
    TWILIO_AUTH_TOKEN: z.string().default(''),
    TWILIO_FROM_NUMBER: z.string().default(''),
});

// ─── Validate ────────────────────────────────────────────────────────────────

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('');
    console.error('╔══════════════════════════════════════════════════════════╗');
    console.error('║  ❌  INVALID ENVIRONMENT VARIABLES — APP CANNOT START  ║');
    console.error('╚══════════════════════════════════════════════════════════╝');
    console.error('');

    const formatted = parsed.error.format();
    for (const [key, value] of Object.entries(formatted)) {
        if (key === '_errors') continue;
        const errors = (value as { _errors: string[] })._errors;
        if (errors?.length) {
            console.error(`  • ${key}: ${errors.join(', ')}`);
        }
    }

    console.error('');
    console.error('  → Check your .env / .env.local file or Vercel env vars.');
    console.error('');
    throw new Error('Invalid environment variables — see console output above');
}

export const env = parsed.data;

// ─── Convenience Exports ─────────────────────────────────────────────────────

/** true when NODE_ENV === 'production' */
export const isProd = env.NODE_ENV === 'production';

/** true when NODE_ENV === 'development' */
export const isDev = env.NODE_ENV === 'development';

/** Structured PostgreSQL connection config */
export const dbConfig = {
    url: env.DATABASE_URL,
    useProdDb: env.USE_PROD_DB,
    prodUrl: env.PROD_DATABASE_URL,
    devUrl: env.DEV_DATABASE_URL,
    isProd,
} as const;

/** Structured Google Sheets config */
export const sheetsConfig = {
    enabled: env.SHEETS_SYNC_ENABLED,
    enableGoogleSheetsSync: env.ENABLE_GOOGLE_SHEETS_SYNC,
    sheetId: env.GOOGLE_SHEET_ID,
    clientEmail: env.GOOGLE_SHEETS_CLIENT_EMAIL,
    privateKey: env.GOOGLE_SHEETS_PRIVATE_KEY,
} as const;

/** n8n webhook config */
export const n8nConfig = {
    webhookUrl: env.N8N_WEBHOOK_URL,
} as const;

/** Google Forms Webhook config */
export const formsWebhookConfig = {
    secret: env.FORMS_WEBHOOK_SECRET,
} as const;

/** Twilio / WhatsApp config */
export const twilioConfig = {
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    fromNumber: env.TWILIO_FROM_NUMBER,
} as const;
