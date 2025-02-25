import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

if (!process.env.EMAIL_FROM) {
  throw new Error('EMAIL_FROM is not defined in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM;

export async function sendVerificationEmail(email: string, token: string) {
  try {
    console.log('Sending verification email to:', email);
    console.log('Using RESEND_API_KEY:', process.env.RESEND_API_KEY);
    console.log('Using EMAIL_FROM:', EMAIL_FROM);
    console.log('Verification URL:', `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`);
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    const emailData = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>If you didn't request this verification, you can safely ignore this email.</p>
      `,
    };

    console.log('Sending email with data:', emailData);

    const data = await resend.emails.send(emailData);

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send verification email. Details:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      email,
      apiKey: process.env.RESEND_API_KEY ? 'Present' : 'Missing',
      from: EMAIL_FROM,
    });
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    console.log('Sending password reset email to:', email);
    
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const emailData = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
      `,
    };

    console.log('Sending password reset email with data:', emailData);

    const data = await resend.emails.send(emailData);

    console.log('Password reset email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send password reset email. Details:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      email,
      apiKey: process.env.RESEND_API_KEY ? 'Present' : 'Missing',
      from: EMAIL_FROM,
    });
    throw error;
  }
} 