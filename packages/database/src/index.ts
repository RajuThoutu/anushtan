import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ӕNV !== 'production') globalThis.prisma = prisma;

export * from '@prisma/client';
export * from './client/client'; // Export existing Google Sheets client
