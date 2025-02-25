import { Resend } from 'resend';

const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const resend = new Resend(process.env.RESEND_API_KEY);

function verificationEmailTemplate(verificationUrl: string) {
  return `
    <h1>Email Verification</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>If you didn't request this verification, you can safely ignore this email.</p>
  `;
}

function passwordResetEmailTemplate(resetUrl: string) {
  return `
    <h1>Password Reset</h1>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you didn't request this password reset, you can safely ignore this email.</p>
  `;
}

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const emailData = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Verify your email address',
      html: verificationEmailTemplate(`${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`),
    };

    const data = await resend.emails.send(emailData);
    return data;
  } catch (error) {
    console.error('Failed to send verification email. Details:', {
      error,
      email,
    });
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const emailData = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Reset your password',
      html: passwordResetEmailTemplate(`${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`),
    };

    const data = await resend.emails.send(emailData);
    return data;
  } catch (error) {
    console.error('Failed to send password reset email. Details:', {
      error,
      email,
    });
    throw error;
  }
} 