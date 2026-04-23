import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"JobFlow" <${ENV.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, firstName, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'Verify your JobFlow email address',
    html: `
      <h1>Welcome to JobFlow, ${firstName}!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  await sendEmail({
    to: email,
    subject: 'Reset your JobFlow password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};

export const sendWelcomeEmail = async (email, firstName) => {
  await sendEmail({
    to: email,
    subject: 'Welcome to JobFlow 🎉',
    html: `
      <h1>Welcome aboard, ${firstName}!</h1>
      <p>Your email has been successfully verified. You can now start tracking your jobs and building premium resumes.</p>
    `,
  });
};
