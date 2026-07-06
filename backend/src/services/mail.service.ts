import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class MailService {
  private static getTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER || 'mock',
        pass: process.env.SMTP_PASS || 'mock',
      },
    });
  }

  static async sendVerificationEmail(to: string, token: string): Promise<void> {
    const isMock = !process.env.SMTP_USER || process.env.SMTP_USER === 'mock';
    const verifyLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    if (isMock) {
      console.log(`[Mail Mock] Verification link sent to ${to}: ${verifyLink}`);
      return;
    }

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: '"NutriMind AI" <noreply@nutrimind.ai>',
        to,
        subject: 'Verify your NutriMind AI Account',
        html: `
          <h1>Welcome to NutriMind AI</h1>
          <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
          <a href="${verifyLink}" target="_blank" style="padding: 10px 20px; background-color: #16A34A; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch (error) {
      console.error('[Mail Error] Failed to send verification email:', error);
    }
  }

  static async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const isMock = !process.env.SMTP_USER || process.env.SMTP_USER === 'mock';
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    if (isMock) {
      console.log(`[Mail Mock] Password reset link sent to ${to}: ${resetLink}`);
      return;
    }

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: '"NutriMind AI" <noreply@nutrimind.ai>',
        to,
        subject: 'Reset your NutriMind AI Password',
        html: `
          <h1>Reset Password Request</h1>
          <p>You requested a password reset. Please click the link below to set a new password:</p>
          <a href="${resetLink}" target="_blank" style="padding: 10px 20px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });
    } catch (error) {
      console.error('[Mail Error] Failed to send password reset email:', error);
    }
  }
}
