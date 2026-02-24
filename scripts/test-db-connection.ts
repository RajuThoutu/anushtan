/**
 * One-off DB connection test.
 * Run: DATABASE_URL="..." npx ts-node scripts/test-db-connection.ts
 */
import { PrismaClient } from '@prisma/client';

const DB_URL = 'postgres://n8n_admin:Vedansh%402023@72.62.230.141:5432/n8n_prod?sslmode=disable';

const prisma = new PrismaClient({
    datasources: { db: { url: DB_URL } },
    log: ['error'],
});

async function main() {
    console.log('\n🔌 Connecting to:', DB_URL.replace(/:\/\/[^@]+@/, '://***@'));

    const result = await prisma.$queryRaw<
        { current_database: string; current_user: string; version: string }[]
    >`SELECT current_database(), current_user, split_part(version(), ' ', 1) || ' ' || split_part(version(), ' ', 2) AS version`;

    const row = result[0];
    console.log('✅ Connected successfully!\n');
    console.log('  Database :', row.current_database);
    console.log('  User     :', row.current_user);
    console.log('  Server   :', row.version);

    // Show existing tables
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
        SELECT tablename FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename
    `;

    if (tables.length === 0) {
        console.log('\n  Tables   : (none — fresh database)');
    } else {
        console.log('\n  Tables   :');
        tables.forEach(t => console.log('    •', t.tablename));
    }

    console.log('');
}

main()
    .catch(e => {
        console.error('\n❌ Connection failed:', e.message, '\n');
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
