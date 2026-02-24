import { PrismaClient } from '@prisma/client';
import { dbConfig } from '@repo/env-config';

const prismaClientSingleton = () => {
    let targetUrl = dbConfig.url;

    if (process.env.NODE_ENV === 'development') {
        // Enforce Dev DB in local environment to prevent accidental prod writes
        targetUrl = dbConfig.devUrl || dbConfig.url;
        console.log('🧪 [Prisma] Local Development: Using DEV Database');
    } else if (dbConfig.useProdDb && dbConfig.prodUrl) {
        targetUrl = dbConfig.prodUrl;
        console.log('🔄 [Prisma] Database override active: Using PROD Database');
    } else if (dbConfig.useProdDb === false && dbConfig.devUrl) {
        targetUrl = dbConfig.devUrl;
        console.log('🧪 [Prisma] Database override active: Using DEV Database');
    }


    return new PrismaClient({
        datasources: {
            db: {
                url: targetUrl,
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
