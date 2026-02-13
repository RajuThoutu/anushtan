import { NextResponse } from 'next/server';
import { getAllInquiries, updateCounselorActions } from '@repo/database';

export async function GET() {
    try {
        const inquiries = await getAllInquiries();

        // Filter for unassigned inquiries (empty counselorName)
        const unassigned = inquiries.filter(inq => !inq.counselorName || inq.counselorName.trim() === '');

        const counselors = ['Bhargavi', 'Bhavani'];
        const results = [];

        for (const inq of unassigned) {
            // Pick random counselor
            const randomCounselor = counselors[Math.floor(Math.random() * counselors.length)];

            // Update
            await updateCounselorActions(inq.id, {
                updatedBy: randomCounselor,
                // Preserve existing values by not passing them (updateCounselorActions handles this logic partially, 
                // but we need to be careful. client.ts implementation of updateCounselorActions reads current values if undefined)
                // However, updatedBy (Column V) IS the counselor name.
            });

            results.push({
                id: inq.id,
                assignedTo: randomCounselor
            });

            // Add delay to avoid rate limits (1s)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return NextResponse.json({
            success: true,
            totalUpdated: results.length,
            details: results
        });

    } catch (error) {
        console.error('Backfill API Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error', stack: error instanceof Error ? error.stack : undefined },
            { status: 500 }
        );
    }
}
