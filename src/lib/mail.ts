import nodemailer from "nodemailer";

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false otherwise
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const year = new Date().getFullYear();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f4f4f4; border-radius: 8px; border: 1px solid #e0e0e0;">
        <h2 style="color: #1A202C;">Welcome to <span style="color:#0070f3;">Ai Interview Agent</span>, ${name} 👋</h2>
        <p>We're excited to have you on board. Your account has been successfully created.</p>
        <p>You can now explore your dashboard and get started:</p>
        <a 
          href="https://folio3-internship-project.vercel.app/dashboard"
          style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Go to Dashboard
        </a>
        <p style="margin-top: 30px; color: #555; font-size: 14px;">
          If you did not sign up, you can safely ignore this email.
        </p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #888;">&copy; ${year} Ai Interview Agent. All rights reserved.</p>
      </div>
    `;

    const plainTextContent = `
Hi ${name},

Welcome to Ai Interview Agent! Your account has been successfully created. We're excited to have you on board.

Explore your dashboard at:
https://folio3-internship-project.vercel.app/dashboard

If you have any questions, feel free to contact our team.

Best,  
Ai Interview Agent Team
    `;

    await transporter.sendMail({
      from: `"AI Interview Agent" <${process.env.SMTP_USER}>`,
      to,
      subject: `🎉 Welcome to AI Interview Agent, ${name}!`,
      text: plainTextContent,
      html: htmlContent,
    });

    console.log(`✅ Welcome email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${to}:`, error);
  }
}
