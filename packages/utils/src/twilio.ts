
import twilio from 'twilio';

interface TwilioConfig {
    accountSid: string;
    authToken: string;
    fromForSms: string; // The specific verified phone number from user
}

export async function sendQuestionnaire(
    phone: string,
    studentName: string,
    config: TwilioConfig
): Promise<{ success: boolean; error?: any }> {
    try {
        const client = twilio(config.accountSid, config.authToken);

        // Ensure phone number has country code (default to +91 if missing)
        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+91' + formattedPhone;
        }

        const messageBody = `Namaste ${studentName}, thank you for your inquiry at Anushtan. To help us understand your child's needs better, please fill out this quick form: https://forms.gle/your-form-link-here`;

        const message = await client.messages.create({
            body: messageBody,
            from: config.fromForSms,
            to: formattedPhone,
        });

        console.log(`Twilio Message Sent: ${message.sid}`);
        return { success: true };
    } catch (error) {
        console.error('Twilio Error:', error);
        return { success: false, error };
    }
}
