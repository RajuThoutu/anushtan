import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Load .env.local ──────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '../apps/admin/.env.local');
if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) {
            const key = m[1].trim();
            const val = m[2].trim().replace(/^"(.*)"$/, '$1');
            if (!process.env[key]) process.env[key] = val;
        }
    }
}

let PrismaClient;
try {
    ({ PrismaClient } = require('@prisma/client'));
} catch (_) {
    ({ PrismaClient } = require(
        '/Applications/anushtan/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client'
    ));
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

const DRY_RUN = process.argv.includes('--dry-run');

const mappings = [
    { canonical: 'Meridian School', variants: ['MERIDIAN SCHOOL', 'MERIDIAN HIGH SCHOOL', 'MERIDIAN'] },
    { canonical: 'Sri Chaitanya School', variants: ['SRI CHAITHANYA', 'SRI CHAITANYA', 'SRI CHAITANYA SCHOOL', 'Sri Chaitanya school', 'SRI CHAITHANYA SCHOOL', 'SRI CHAITANYA PRIMARY SCHOOL'] },
    { canonical: 'Aadhya School', variants: ['AADHYA SCHOOL', 'AADHYA THE SCHOOL', 'AADHYA', 'AADYA', 'AADHYAA SCHOOL', 'Adhya SCHOOL', 'ADHYA SCHOOL', 'Aadhya school', 'AADYA THE SCHOOL', 'AADYAA THE SCHOOL'] },
    { canonical: 'Kranthi School', variants: ['KRANTHI SCHOOL', 'KRANTHI HIGH SCHOOL', 'KRANTHI'] },
    { canonical: 'Narayana School', variants: ['NARAYANA SCHOOL', 'NARAYANA', 'SRI NARAYANA HIGH SCHOOL, NZBD'] },
    { canonical: 'St. Paul\'s School', variants: ['ST.PAULS', 'ST PAULS'] },
    { canonical: 'Kendriya Vidyalaya', variants: ['KENDRIYA VIDYALAYA', 'KENDRIYA  VIDYALAYA', 'PM SHRI KENDRIYA VIDYALAYA'] },
    { canonical: 'Ambitus School', variants: ['AMBITUS SCHOOL', 'AMBITUS'] },
    { canonical: 'Iris Florets School', variants: ['IRIS FLORETS', 'IRIS FLORETS SCHOOL', 'IRIS'] },
    { canonical: 'Sahasra School', variants: ['SAHASRA', 'SAHASRA SCHOOL'] },
    { canonical: 'Rao\'s School', variants: ['RAO\'S HIGH SCHOOL', 'RAO\'S SCHOOL', 'RAOS INNOVIOUS SCHOOL'] },
    { canonical: 'S.R. Digi School', variants: ['S.R.DIGI', 'S.R.DIGI SCHOOL'] },
    { canonical: 'The Master Minds School', variants: ['THE MASTER MINDS SCHOOL', 'MASERMINDS SCHOOL', 'MASTER MINDS SCHOOL', 'THE MASTER MINDS'] },
    { canonical: 'Delhi Public School', variants: ['DELHI PUBLIC SCHOOL', 'DPSS'] },
    { canonical: 'Government School', variants: ['Government school', 'GOVERNMENT SCHOOL'] },
    { canonical: null, variants: ['TEst school', 'test', 'Na', 'est', 'na', 'none'] }
];

async function main() {
    console.log(`\n${DRY_RUN ? '🔍 DRY RUN — No DB writes' : '🚀 LIVE RUN — Updating DB'}\n`);

    let totalUpdates = 0;

    for (const group of mappings) {
        const canonical = group.canonical;
        const variants = group.variants;

        let matchCount = 0;

        const countRes = await prisma.inquiry.count({
            where: { currentSchool: { in: variants } }
        });
        matchCount = countRes;

        if (matchCount > 0) {
            console.log(`Group: -> ${canonical ?? 'NULL (clear)'}`);
            console.log(`  Found ${matchCount} matching records from variants: ${variants.join(', ')}`);

            if (!DRY_RUN) {
                const res = await prisma.inquiry.updateMany({
                    where: { currentSchool: { in: variants } },
                    data: { currentSchool: canonical }
                });
                console.log(`  ✅ Updated ${res.count} records.\n`);
                totalUpdates += res.count;
            } else {
                console.log(`  (Dry run skipped update)\n`);
            }
        }
    }

    if (!DRY_RUN) {
        console.log(`\n🎉 Total records updated: ${totalUpdates}`);
    } else {
        console.log(`\n✅ Dry run complete. Pass no args to run live updates.`);
    }

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
