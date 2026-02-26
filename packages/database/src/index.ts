import { PrismaClient } from '@prisma/client';
import { dbConfig } from '@repo/env-config';

const prismaClientSingleton = () => {
    // Rely exclusively on the standard DATABASE_URL environment variable
    // We explicitly pass it to handle Vercel serverless environment quirks
    return new PrismaClient({
        datasources: {
            db: {
                url: dbConfig.url.replace(/^["']|["']$/g, ''),
            },
        },
    });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ӕNV !== 'production') globalThis.prisma = prisma;

export * from '@prisma/client';
export * from './client/client'; // Export existing Google Sheets client

// ─── AppConfig helpers ────────────────────────────────────────────────────────

export async function getAppConfigValue(key: string): Promise<string | null> {
    try {
        const row = await prisma.appConfig.findUnique({ where: { key } });
        return row?.value ?? null;
    } catch {
        return null;
    }
}

export async function setAppConfigValue(key: string, value: string): Promise<void> {
    await prisma.appConfig.upsert({
        where:  { key },
        update: { value },
        create: { key, value },
    });
}
