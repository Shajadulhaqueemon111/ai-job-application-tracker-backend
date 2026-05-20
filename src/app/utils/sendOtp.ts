import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const sendOTP = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // safer path resolve (works in dist/build too)
    const templatePath = path.resolve(
      process.cwd(),
      'src/app/utils/email/otp-email-template.html',
    );

    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    const htmlContent = htmlTemplate.replace(/{{OTP}}/g, otp);

    await transporter.sendMail({
      from: `"AI-JOB-TRACKER 🔐" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Verification Code',
      text: `Your OTP code is: ${otp}

This code will expire in 2 minutes.

If you did not request this, please ignore this email.

– AI-JOB-TRACKER`,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('OTP Email Send Error:', error);
    throw new Error('Failed to send OTP email');
  }
};
