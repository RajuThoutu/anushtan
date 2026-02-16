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
        const result = await createInquiry({
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

        // Generate ID manually if capture failed? createInquiry returns { success: true, id: string }
        const inquiryId = (result as any).id || "PENDING";

        // Trigger Twilio Workflow (Fire and forget)
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER) {
            sendQuestionnaire(data.phone, data.studentName, {
                accountSid: process.env.TWILIO_ACCOUNT_SID,
                authToken: process.env.TWILIO_AUTH_TOKEN,
                fromForSms: process.env.TWILIO_FROM_NUMBER
            }).catch(err => console.error("Background Twilio Error:", err));
        }

        // Trigger n8n Automation (Fire and forget)
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://api.anushtansiddipet.in/webhook/school-inquiry';
        if (n8nWebhookUrl) {
            fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_name: data.studentName,
                    parent_name: "Not Provided", // Or map correctly if form adds it
                    email: data.email || "",
                    phone: data.phone,
                    current_class: data.course,
                    child_age: 0, // Default or derived?
                    message: data.message,
                    source: "Website",
                    inquiry_id: "", // We don't have the Google Sheet S-ID here easily unless we wait for createInquiry? 
                    // createInquiry returns { success: true, id: inquiryId }
                })
            }).catch(err => console.error("Background n8n Error:", err));
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
