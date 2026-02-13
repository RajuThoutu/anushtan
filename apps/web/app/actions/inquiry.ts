'use server';

import { createInquiry } from "@repo/database";
import { sendQuestionnaire } from "@repo/utils/src/twilio";

interface InquiryData {
    studentName: string;
    email?: string;  // Made optional
    phone: string;
    course: string;
    message: string;
}

export async function submitInquiry(data: InquiryData): Promise<{ success: boolean; error?: string }> {
    try {
        await createInquiry({
            studentName: data.studentName,
            // Form doesn't collect parent name, use placeholder
            parentName: "Not Provided",
            email: data.email || "",
            phone: data.phone,
            // Map 'course' (Grade) to 'currentClass'
            currentClass: data.course,
            notes: data.message,
            howHeard: "Website",
            createdBy: "Website Form",
            source: "Website",
            status: "New"
        });

        // Trigger Twilio Workflow (Fire and forget to not block UI)
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER) {
            sendQuestionnaire(data.phone, data.studentName, {
                accountSid: process.env.TWILIO_ACCOUNT_SID,
                authToken: process.env.TWILIO_AUTH_TOKEN,
                fromForSms: process.env.TWILIO_FROM_NUMBER
            }).catch(err => console.error("Background Twilio Error:", err));
        } else {
            console.warn("Twilio credentials missing, skipping SMS.");
        }

        return { success: true };
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error. Please check your connection and try again.'
        };
    }
}
