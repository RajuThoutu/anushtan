/**
 * WhatsApp Client Service
 * 
 * Handles sending WhatsApp messages to parents.
 * Currently designed to specific provider APIs but abstracted for easy swapping.
 */

// Configuration for Brochure
const BROCHURE_LINK = "https://www.anushtan.in/brochure.pdf"; // TODO: Update with actual link if different
const SCHOOL_NAME = "Anushtan Indic School";

/**
 * Sends a welcome message with brochure link to a parent via WhatsApp.
 * 
 * @param phone The parent's phone number
 * @param parentName The parent's name
 * @param studentName The student's name
 */
export async function sendBrochure(phone: string, parentName: string, studentName: string) {
    console.log(`[WhatsApp] Preparing to send brochure to ${parentName} (${phone}) for student ${studentName}`);

    try {
        // Normalize phone number (remove spaces, dashes)
        const cleanPhone = phone.replace(/[^0-9]/g, '');

        // Log the action (placeholder for actual API call)
        // TODO: Replace with actual Provider API call (Twilio/Interakt/Meta)
        // Example for future implementation:
        // await fetch('https://api.whatsapp.provider.com/send', { ... })

        const messageBody = `Namaste ${parentName} ji,\n\nThank you for your interest in ${SCHOOL_NAME} for ${studentName}.\n\nWe are delighted to share our brochure with you: ${BROCHURE_LINK}\n\nOur admissions team will reach out to you shortly.\n\nRegards,\n${SCHOOL_NAME} Team`;

        console.log(`[WhatsApp] MESSAGE TO SEND:\n${messageBody}`);

        // Return success for now to allow flow to continue
        return { success: true, mock: true };
    } catch (error) {
        console.error('[WhatsApp] Failed to send message:', error);
        // Don't throw, just return failure so we don't block the main flow
        return { success: false, error };
    }
}
