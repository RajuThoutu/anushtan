import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch all distinct school names
        const schools = await prisma.inquiry.findMany({
            where: {
                currentSchool: {
                    not: null,
                },
            },
            select: {
                currentSchool: true,
            },
            distinct: ['currentSchool'],
        });

        // Filter out empty strings and sort alphabetically
        const schoolNames = schools
            .map((s: { currentSchool: string | null }) => s.currentSchool)
            .filter((name: string | null): name is string => {
                const isValid = typeof name === 'string' && name.trim().length > 0;
                if (!isValid) return false;

                const lowerName = name.toLowerCase();
                if (lowerName.startsWith('test')) return false;
                if (lowerName === 'no schooling') return false;

                return true;
            })
            .sort((a: string, b: string) => a.localeCompare(b));

        return NextResponse.json(schoolNames);
    } catch (error) {
        console.error('Failed to fetch schools:', error);
        return NextResponse.json(
            { error: 'Failed to fetch schools' },
            { status: 500 }
        );
    }
}
