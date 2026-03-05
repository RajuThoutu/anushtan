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
    const firstName = parentName.split(' ')[0];
    const gradeLabel = grade ? grade : 'the upcoming academic year';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thank You for Your Inquiry — Anushtan School</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

          <!-- ── Header banner ── -->
          <tr>
            <td style="background:linear-gradient(120deg,#1e3a8a 0%,#4f46e5 60%,#7c3aed 100%);padding:44px 40px 36px;text-align:center;">
              <!-- School name badge -->
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.30);border-radius:50px;padding:6px 18px;margin-bottom:18px;">
                <span style="color:rgba(255,255,255,0.90);font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Anushtan School · Siddipet</span>
              </div>
              <h1 style="margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:700;line-height:1.2;">
                Thank You for Reaching Out!
              </h1>
              <p style="margin:0;color:rgba(255,255,255,0.80);font-size:15px;line-height:1.5;">
                We have received your inquiry for <strong style="color:#ffffff;">${studentName}</strong>${grade ? ` — ${gradeLabel}` : ''}.
              </p>
            </td>
          </tr>

          <!-- ── Greeting ── -->
          <tr>
            <td style="padding:36px 40px 0;">
              <p style="margin:0 0 16px;font-size:16px;color:#1e293b;line-height:1.6;">
                Dear <strong>${firstName}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.75;">
                We are truly delighted to receive your inquiry and grateful for the confidence you have shown
                in Anushtan School. Providing quality education that nurtures every child's potential is at
                the heart of everything we do, and we look forward to being part of
                <strong style="color:#1e293b;">${studentName}'s</strong> journey.
              </p>
              <p style="margin:0 0 0;font-size:15px;color:#475569;line-height:1.75;">
                Our admissions team has been notified and will be in touch with you shortly.
              </p>
            </td>
          </tr>

          <!-- ── Divider ── -->
          <tr>
            <td style="padding:28px 40px 0;">
              <div style="height:1px;background:linear-gradient(to right,transparent,#e2e8f0,transparent);"></div>
            </td>
          </tr>

          <!-- ── Next steps ── -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 18px;font-size:13px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:1px;">
                What Happens Next
              </p>

              <!-- Step 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td width="40" valign="top">
                    <div style="width:32px;height:32px;border-radius:50%;background:#ede9fe;display:flex;align-items:center;justify-content:center;text-align:center;line-height:32px;">
                      <span style="font-size:15px;">📞</span>
                    </div>
                  </td>
                  <td valign="top" style="padding-left:12px;">
                    <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#1e293b;">Counsellor Call</p>
                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">
                      Our admissions counsellor will call you within <strong>1–2 business days</strong> to answer any questions.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td width="40" valign="top">
                    <div style="width:32px;height:32px;border-radius:50%;background:#dbeafe;text-align:center;line-height:32px;">
                      <span style="font-size:15px;">🏫</span>
                    </div>
                  </td>
                  <td valign="top" style="padding-left:12px;">
                    <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#1e293b;">Campus Visit</p>
                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">
                      You will be invited for a personal <strong>campus tour and student interaction</strong> at your convenience.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="40" valign="top">
                    <div style="width:32px;height:32px;border-radius:50%;background:#dcfce7;text-align:center;line-height:32px;">
                      <span style="font-size:15px;">✅</span>
                    </div>
                  </td>
                  <td valign="top" style="padding-left:12px;">
                    <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#1e293b;">Admission Guidance</p>
                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">
                      We will walk you through the <strong>complete admission process</strong> step by step — no guesswork.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Brochure note ── -->
          <tr>
            <td style="padding:28px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;">
                    <p style="margin:0;font-size:14px;color:#92400e;line-height:1.6;">
                      📎 &nbsp;<strong>School Brochure Attached</strong> — We have included our latest school brochure with this email.
                      Please feel free to review it and share with your family.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── CTA ── -->
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(120deg,#1e3a8a,#7c3aed);border-radius:10px;padding:0;">
                    <a href="https://anushtanschool.in"
                       style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                      Visit Our Website &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Sign-off ── -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;font-size:15px;color:#475569;line-height:1.75;">
                We look forward to welcoming <strong style="color:#1e293b;">${studentName}</strong> to the
                Anushtan family. If you have any immediate questions, please do not hesitate to reach out to us.
              </p>
              <p style="margin:20px 0 0;font-size:15px;color:#1e293b;line-height:1.6;">
                Warm regards,<br />
                <strong>Admissions Team</strong><br />
                <span style="color:#4f46e5;">Anushtan School, Siddipet</span>
              </p>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="padding:32px 40px;margin-top:32px;">
              <div style="height:1px;background:#e2e8f0;margin-bottom:24px;"></div>
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7;text-align:center;">
                This email was sent in response to a school inquiry submitted for <strong>${studentName}</strong>.<br />
                Anushtan School &nbsp;·&nbsp; Siddipet, Telangana, India &nbsp;·&nbsp;
                <a href="https://anushtanschool.in" style="color:#6366f1;text-decoration:none;">anushtanschool.in</a>
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
            subject:     `We received your inquiry for ${studentName} — Anushtan School`,
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
