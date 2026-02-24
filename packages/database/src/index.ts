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
