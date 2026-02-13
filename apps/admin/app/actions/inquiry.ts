'use server';

interface InquiryData {
    studentName: string;
    email?: string;  // Made optional
    phone: string;
    course: string;
    message: string;
}

interface GoogleSheetsResponse {
    result: string;
}

export async function submitInquiry(data: InquiryData): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(
            'https://script.google.com/macros/s/AKfycbywQ2szm_aUkWL4JeS55CD6y-m5zrYz0L98d7b_G4uAA84jefWq69QvxLqCDVYSrb4_/exec',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: GoogleSheetsResponse = await response.json();

        if (result.result === 'Success') {
            return { success: true };
        } else {
            return { success: false, error: 'Submission failed. Please try again.' };
        }
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error. Please check your connection and try again.'
        };
    }
}
