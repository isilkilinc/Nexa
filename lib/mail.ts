import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// The "from" address must be from a domain you've verified in Resend.
// During development you can use onboarding@resend.dev to send to your own email only.
const FROM_ADDRESS = process.env.RESEND_FROM ?? 'Nexa <onboarding@resend.dev>';
const APP_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: 'Verify your Nexa account ✔',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your Nexa account</title>
      </head>
      <body style="margin:0;padding:0;background:#0d0d1a;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d1a;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(139,92,246,0.3);border-radius:16px;overflow:hidden;">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(59,130,246,0.2));padding:32px 40px;text-align:center;border-bottom:1px solid rgba(139,92,246,0.3);">
                    <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:4px;color:#a78bfa;text-transform:uppercase;">NEXA</h1>
                    <p style="margin:6px 0 0;color:rgba(255,255,255,0.5);font-size:13px;letter-spacing:1px;">FIND YOUR PERFECT DUO</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 12px;color:#ffffff;font-size:22px;font-weight:700;">Verify your email address</h2>
                    <p style="margin:0 0 28px;color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;">
                      Welcome to Nexa! Click the button below to verify your email and activate your account. This link expires in <strong style="color:#a78bfa;">24 hours</strong>.
                    </p>
                    <div style="text-align:center;margin:32px 0;">
                      <a href="${verifyUrl}"
                         style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#3b82f6);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 40px;border-radius:10px;box-shadow:0 0 24px rgba(139,92,246,0.4);">
                        Verify Email
                      </a>
                    </div>
                    <p style="margin:28px 0 0;color:rgba(255,255,255,0.35);font-size:13px;line-height:1.6;">
                      If you didn't create a Nexa account, you can safely ignore this email.
                      <br/><br/>
                      Or copy this link into your browser:<br/>
                      <a href="${verifyUrl}" style="color:#a78bfa;word-break:break-all;">${verifyUrl}</a>
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                    <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;">© ${new Date().getFullYear()} Nexa. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
