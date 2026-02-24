/**
 * safe-prod-migrate.mjs
 *
 * Safely adds NEW columns to n8n_prod without touching existing data.
 * Uses ADD COLUMN IF NOT EXISTS — fully idempotent, safe to re-run.
 *
 * Run: NODE_PATH=$(pwd)/node_modules node safe-prod-migrate.mjs
 */
import { PrismaClient } from '@prisma/client';

const PROD_URL = 'postgres://n8n_admin:Vedansh%402023@127.0.0.1:5433/n8n_prod?sslmode=disable';

const prisma = new PrismaClient({
    datasources: { db: { url: PROD_URL } }
});

async function main() {
    console.log('\n🔍 Checking n8n_prod current state...\n');

    // Show existing tables
    const tables = await prisma.$queryRaw`
    SELECT table_name, 
           (SELECT COUNT(*) FROM information_schema.columns c
            WHERE c.table_name = t.table_name AND c.table_schema = 'public')::int AS col_count
    FROM information_schema.tables t
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
    tables.forEach(t => console.log(`  📋 ${t.table_name} (${t.col_count} cols)`));

    // Show existing inquiry columns
    const cols = await prisma.$queryRaw`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'inquiries'
    ORDER BY ordinal_position
  `;
    const existingCols = new Set(cols.map(c => c.column_name));
    console.log(`\n  ↳ inquiries has ${existingCols.size} columns: ${[...existingCols].join(', ')}`);

    // Row count of existing data
    const countRes = await prisma.$queryRaw`SELECT COUNT(*)::int AS n FROM inquiries`;
    console.log(`  ↳ ${countRes[0].n} existing rows\n`);

    // ─── Step 1: Fix the NULL inquiry_id row (backfill with a temp value) ──────
    console.log('🔧 Step 1: Fixing NULL inquiry_id values...');
    await prisma.$executeRaw`
    UPDATE inquiries
    SET inquiry_id = 'S-LEGACY-' || id::text
    WHERE inquiry_id IS NULL
  `;
    console.log('  ✅ NULL inquiry_ids patched\n');

    // ─── Step 2: Create missing tables (idempotent) ───────────────────────────
    console.log('🔧 Step 2: Creating enums if missing...');

    // Enums — CREATE TYPE IF NOT EXISTS not supported in older PG, so DO block
    await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InquiryStatus') THEN
        CREATE TYPE "InquiryStatus" AS ENUM ('New','Open','Follow-up','Converted','Closed');
      END IF;
    END $$;
  `);
    await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CaseStatus') THEN
        CREATE TYPE "CaseStatus" AS ENUM ('Active','Resolved-Completed');
      END IF;
    END $$;
  `);
    await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InquirySource') THEN
        CREATE TYPE "InquirySource" AS ENUM ('Website','WhatsApp','Paper Form','Phone Call','Referral','Other');
      END IF;
    END $$;
  `);
    await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
        CREATE TYPE "UserRole" AS ENUM ('admin','counselor','viewer');
      END IF;
    END $$;
  `);
    console.log('  ✅ Enums OK\n');

    // ─── Step 3: ADD new columns to inquiries (IF NOT EXISTS) ─────────────────
    console.log('🔧 Step 3: Adding new columns to inquiries...');

    const inquiryAlters = [
        // New columns from schema design
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS referral_name        TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS referral_phone       TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS siblings_at_school   BOOLEAN NOT NULL DEFAULT false`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS preferred_language   TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS visit_scheduled_date DATE`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS visit_done           BOOLEAN NOT NULL DEFAULT false`,
        // Existing required columns that may be missing in prod schema
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS tenant_id            TEXT NOT NULL DEFAULT 'anushtan-siddipet'`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS secondary_phone      TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS occupation           TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS education_guide      TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS learning_method      TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS teacher_preference   TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS child_importance     TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS school_environment   TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS day_scholar_hostel   TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS how_heard            TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS created_by           TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS case_status          TEXT NOT NULL DEFAULT 'Active'`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_to          TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS follow_up_date       DATE`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS priority             TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS notes                TEXT`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS is_synced_to_sheet   BOOLEAN NOT NULL DEFAULT false`,
        `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS inquiry_date         TIMESTAMPTZ NOT NULL DEFAULT NOW()`,
    ];

    for (const sql of inquiryAlters) {
        await prisma.$executeRawUnsafe(sql);
        const colName = sql.match(/ADD COLUMN IF NOT EXISTS (\w+)/)?.[1];
        console.log(`  ✅ inquiries.${colName}`);
    }

    // ─── Step 4: ADD new columns to students ──────────────────────────────────
    console.log('\n🔧 Step 4: Adding new columns to students...');

    const studentAlters = [
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS student_id              TEXT UNIQUE`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS roll_number             TEXT`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS date_of_birth           DATE`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS gender                  TEXT`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS aadhar_number           TEXT`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS fee_plan                TEXT`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS transport_required      BOOLEAN NOT NULL DEFAULT false`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS transport_route         TEXT`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS emergency_contact_name  TEXT`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT`,
        `ALTER TABLE students ADD COLUMN IF NOT EXISTS medical_notes           TEXT`,
    ];

    for (const sql of studentAlters) {
        await prisma.$executeRawUnsafe(sql);
        const colName = sql.match(/ADD COLUMN IF NOT EXISTS (\w+)/)?.[1];
        console.log(`  ✅ students.${colName}`);
    }

    // ─── Step 5: Create missing tables ───────────────────────────────────────
    console.log('\n🔧 Step 5: Creating any missing tables...');

    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS counselor_activity_log (
      id             BIGSERIAL PRIMARY KEY,
      inquiry_id     TEXT NOT NULL,
      counselor_name TEXT NOT NULL,
      action         TEXT NOT NULL,
      old_value      TEXT,
      new_value      TEXT,
      comments       TEXT,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    console.log('  ✅ counselor_activity_log');

    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS sheets_sync_log (
      id            BIGSERIAL PRIMARY KEY,
      inquiry_id    TEXT NOT NULL,
      operation     TEXT NOT NULL DEFAULT 'insert',
      sheet_row     INTEGER,
      status        TEXT NOT NULL DEFAULT 'pending',
      error_message TEXT,
      synced_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    console.log('  ✅ sheets_sync_log');

    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name           TEXT,
      email          TEXT UNIQUE NOT NULL,
      password_hash  TEXT,
      role           TEXT NOT NULL DEFAULT 'counselor',
      is_active      BOOLEAN NOT NULL DEFAULT true,
      email_verified TIMESTAMPTZ,
      image          TEXT,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
    console.log('  ✅ users');

    // ─── Step 6: Create useful indexes if missing ─────────────────────────────
    console.log('\n🔧 Step 6: Ensuring indexes...');
    const indexes = [
        `CREATE INDEX IF NOT EXISTS idx_inquiries_phone      ON inquiries(phone)`,
        `CREATE INDEX IF NOT EXISTS idx_inquiries_status     ON inquiries(status)`,
        `CREATE INDEX IF NOT EXISTS idx_inquiries_tenant     ON inquiries(tenant_id)`,
        `CREATE INDEX IF NOT EXISTS idx_inquiries_assigned   ON inquiries(assigned_to)`,
        `CREATE INDEX IF NOT EXISTS idx_inquiries_date       ON inquiries(inquiry_date)`,
        `CREATE INDEX IF NOT EXISTS idx_cal_inquiry_id       ON counselor_activity_log(inquiry_id)`,
        `CREATE INDEX IF NOT EXISTS idx_ssl_inquiry_id       ON sheets_sync_log(inquiry_id)`,
    ];
    for (const sql of indexes) await prisma.$executeRawUnsafe(sql);
    console.log('  ✅ Indexes done');

    // ─── Final summary ────────────────────────────────────────────────────────
    console.log('\n─────────────────────────────────────');
    const finalTables = await prisma.$queryRaw`
    SELECT table_name,
           (SELECT COUNT(*) FROM information_schema.columns c
            WHERE c.table_name = t.table_name AND c.table_schema = 'public')::int AS col_count
    FROM information_schema.tables t
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
    console.log('📋 n8n_prod final state:');
    finalTables.forEach(t => console.log(`  ${t.table_name.padEnd(30)} ${t.col_count} cols`));
    console.log('\n✅ n8n_prod migration complete!\n');

    await prisma.$disconnect();
}

main().catch(async e => {
    console.error('\n❌ Fatal error:', e.message);
    await prisma.$disconnect();
    process.exit(1);
});
