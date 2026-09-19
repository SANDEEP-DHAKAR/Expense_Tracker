const nodemailer = require("nodemailer");

/**
 * Sends a password reset email to the user if SMTP credentials are provided,
 * or logs it to the server console in development.
 * @param {{ to: string, resetLink: string, userName?: string }} options
 * @returns {Promise<{ success: boolean, sent: boolean, error?: string }>}
 */
const sendPasswordResetEmail = async ({ to, resetLink, userName = "User" }) => {
    if (!process.env.EMAIL_USER) {
        try {
            require("dotenv").config({ override: true });
        } catch {
            // Ignore if already loaded
        }
    }

    const user = process.env.EMAIL_USER || process.env.SMTP_USER;
    const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);

    // If SMTP is not configured, gracefully log to console and return
    if (!user || !pass) {
        console.log(`\n======================================================`);
        console.log(`🔑 PASSWORD RESET LINK FOR: ${to}`);
        console.log(`🔗 Link: ${resetLink}`);
        console.log(`💡 Set EMAIL_USER and EMAIL_PASS in backend/.env to send real emails.`);
        console.log(`======================================================\n`);
        return { success: true, sent: false, reason: "smtp_not_configured" };
    }

    try {
        const transporterConfig = host
            ? {
                  host,
                  port,
                  secure: port === 465,
                  auth: { user, pass },
              }
            : {
                  service: "gmail",
                  auth: { user, pass },
              };

        const transporter = nodemailer.createTransport(transporterConfig);

        const mailOptions = {
            from: `"${process.env.APP_NAME || "Expense Tracker"}" <${user}>`,
            to,
            subject: "Reset Your Expense Tracker Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #070a0f; color: #f1f5f9; padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #10b981; margin: 0; font-size: 24px;">Expense Tracker</h1>
                        <p style="color: #94a3b8; font-size: 14px; margin-top: 6px;">Password Reset Request</p>
                    </div>
                    <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">Hello ${userName},</p>
                    <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
                        We received a request to reset the password for your Expense Tracker account. Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.
                    </p>
                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${resetLink}" style="background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 10px; display: inline-block;">
                            Reset My Password
                        </a>
                    </div>
                    <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
                        If the button above doesn't work, copy and paste this URL into your browser:<br/>
                        <a href="${resetLink}" style="color: #34d399; word-break: break-all;">${resetLink}</a>
                    </p>
                    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
                    <p style="font-size: 12px; color: #475569; text-align: center; margin: 0;">
                        If you didn't request a password reset, you can safely ignore this email.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent to ${to}`);
        return { success: true, sent: true };
    } catch (error) {
        console.error("❌ Failed to send password reset email:", error.message);
        return { success: false, sent: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail,
};

