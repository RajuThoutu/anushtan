/**
 * @repo/utils — Resend email helper
 *
 * Sends a greeting + school brochure email when a parent submits an inquiry
 * and provides an email address.
 *
 * Brochure file location (place PDF here before going live):
 *   apps/web/public/brochure.pdf
 *   apps/admin/public/brochure.pdf
 *
 * Required env vars:
 *   RESEND_API_KEY     — from https://resend.com/api-keys
 *   RESEND_FROM_EMAIL  — verified sender e.g. "Anushtan School <admissions@anushtanschool.in>"
 */

import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

function getResend() {
    const apiKey = process.env.RESEND_API_KEY ?? '';
    if (!apiKey) return null;
    return new Resend(apiKey);
}

function getFromEmail() {
    return process.env.RESEND_FROM_EMAIL ?? 'Anushtan School <admissions@anushtanschool.in>';
}

/** Tries to read brochure.pdf from the running app's public/ folder. Returns null if not found. */
function readBrochure(): Buffer | null {
    try {
        const filePath = path.join(process.cwd(), 'public', 'brochure.pdf');
        return fs.readFileSync(filePath);
    } catch {
        return null;
    }
}

function buildHtml(parentName: string, studentName: string, grade: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You — Anushtan School</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a,#7c3aed);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:0.5px;">
                Anushtan School
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:1px;text-transform:uppercase;">
                Excellence in Education
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;font-size:16px;color:#374151;">
                Dear <strong>${parentName}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
                Thank you for expressing interest in Anushtan School for
                <strong>${studentName}</strong>${grade ? ` (${grade})` : ''}.
                We are delighted to receive your inquiry and look forward to welcoming your family
                to our school community.
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
                Our admissions team will review your inquiry and reach out to you shortly to discuss
                the next steps, including a campus visit and any questions you may have.
              </p>

              <!-- Highlight box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background:#f0f4ff;border-left:4px solid #6366f1;border-radius:0 8px 8px 0;padding:18px 20px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#4338ca;text-transform:uppercase;letter-spacing:0.5px;">
                      What happens next?
                    </p>
                    <ul style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:2;">
                      <li>Our admissions counsellor will call you within <strong>1–2 business days</strong></li>
                      <li>You will be invited for a <strong>campus visit &amp; interaction</strong></li>
                      <li>We will guide you through the <strong>admission process</strong> step by step</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
                We have attached our school brochure to this email. Please feel free to share it
                with your family. If you have any immediate questions, do not hesitate to contact us.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,#1e3a8a,#7c3aed);border-radius:8px;padding:14px 28px;">
                    <a href="https://anushtanschool.in" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">
                      Visit Our Website →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
                Warm regards,<br />
                <strong>Admissions Team</strong><br />
                Anushtan School
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                This email was sent because a school inquiry was submitted for ${studentName}.<br />
                Anushtan School, Siddipet, Telangana, India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export interface EmailSendResult {
    success: boolean;
    messageId?: string;
    skipped?: boolean;  // true if no API key or no email address
    error?: string;
}

export async function sendInquiryBrochureEmail(
    toEmail: string,
    parentName: string,
    studentName: string,
    grade: string
): Promise<EmailSendResult> {
    const resend = getResend();
    if (!resend) {
        console.log('[Email] Skipped — RESEND_API_KEY not configured');
        return { success: true, skipped: true };
    }

    const brochure = readBrochure();
    const attachments = brochure
        ? [{ filename: 'Anushtan-School-Brochure.pdf', content: brochure }]
        : [];

    if (!brochure) {
        console.warn('[Email] Brochure PDF not found at public/brochure.pdf — sending without attachment');
    }

    try {
        const { data, error } = await resend.emails.send({
            from:        getFromEmail(),
            to:          [toEmail],
            subject:     `Thank you for your inquiry — Anushtan School`,
            html:        buildHtml(parentName, studentName, grade),
            attachments,
        });

        if (error) {
            console.error('[Email] Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log(`[Email] Brochure sent to ${toEmail} | id: ${data?.id}`);
        return { success: true, messageId: data?.id };
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[Email] Send failed:', msg);
        return { success: false, error: msg };
    }
}
