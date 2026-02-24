
import { prisma } from '../../../packages/database/src/index';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from apps/web/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function createUsers() {
    const password = "Anushtan@2026";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Users to create
    // Sravani, Bhavani, Kavitha, Bhargavi, CC1, CC2, CC3
    // Bhargavi -> HRM
    // Others -> Counselor

    const users = [
        { name: "Sravani", role: "Counselor", email: "sravani@anushtan.com" },
        { name: "Bhavani", role: "Counselor", email: "bhavani@anushtan.com" },
        { name: "Kavitha", role: "Counselor", email: "kavitha@anushtan.com" },
        { name: "Bhargavi", role: "HRM", email: "bhargavi@anushtan.com" },
        { name: "CC1", role: "Counselor", email: "cc1@anushtan.com" },
        { name: "CC2", role: "Counselor", email: "cc2@anushtan.com" },
        { name: "CC3", role: "Counselor", email: "cc3@anushtan.com" },
    ];

    console.log("Starting user creation...");

    for (const u of users) {
        try {
            // Check if exists
            const existing = await prisma.user.findUnique({
                where: { email: u.email }
            });

            if (existing) {
                console.log(`User ${u.name} already exists. Updating role/password...`);
                await prisma.user.update({
                    where: { email: u.email },
                    data: {
                        role: u.role as any,
                        passwordHash: hashedPassword,
                        name: u.name
                    }
                });
                console.log(`Updated ${u.name}`);
            } else {
                await prisma.user.create({
                    data: {
                        name: u.name,
                        email: u.email,
                        role: u.role as any,
                        passwordHash: hashedPassword,
                        emailVerified: new Date(),
                    }
                });
                console.log(`Created ${u.name}`);
            }
        } catch (error) {
            console.error(`Failed to process ${u.name}:`, error);
        }
    }

    console.log("Done.");
}

createUsers()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
