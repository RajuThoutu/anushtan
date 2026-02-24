import { PrismaClient } from '@prisma/client';
import { dbConfig } from '@repo/env-config';

const prismaClientSingleton = () => {
    let targetUrl: string | undefined = undefined;

    if (process.env.NODE_ENV === 'development') {
        // Enforce Dev DB in local environment if devUrl is explicit
        if (dbConfig.devUrl) {
            targetUrl = dbConfig.devUrl;
            console.log('🧪 [Prisma] Local Development: Using DEV Database override');
        }
    } else if (dbConfig.useProdDb && dbConfig.prodUrl) {
        targetUrl = dbConfig.prodUrl;
        console.log('🔄 [Prisma] Database override active: Using PROD Database');
    } else if (dbConfig.useProdDb === false && dbConfig.devUrl) {
        targetUrl = dbConfig.devUrl;
        console.log('🧪 [Prisma] Database override active: Using DEV Database');
    }

    if (targetUrl) {
        // Strip any accidental quotes from the connection string
        targetUrl = targetUrl.replace(/^["']|["']$/g, '');
        return new PrismaClient({
            datasources: {
                db: {
                    url: targetUrl,
                },
            },
        });
    }

    // Default to natural Prisma resolution, explicitly passing the generic DATABASE_URL
    // This is required in some serverless environments where `env("DATABASE_URL")` fails to resolve at runtime
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
