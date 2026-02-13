import { getAllInquiries } from '@repo/database';

async function checkUnassigned() {
    try {
        const inquiries = await getAllInquiries();
        const unassigned = inquiries.filter(inq => !inq.counselorName || inq.counselorName.trim() === '');
        console.log(`Unassigned inquiries remaining: ${unassigned.length}`);

        const counts = {};
        inquiries.forEach(inq => {
            const name = inq.counselorName || 'Unassigned';
            counts[name] = (counts[name] || 0) + 1;
        });
        console.log('Distribution:', counts);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Check if run directly
if (require.main === module) {
    checkUnassigned();
}

export { checkUnassigned };
