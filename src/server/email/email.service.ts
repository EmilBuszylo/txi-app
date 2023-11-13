import nodemailer from 'nodemailer';

import { logger } from '@/lib/logger';
import { SendEmailRequest } from '@/lib/server/api/endpoints';

interface SendEmailInput extends SendEmailRequest {
  to?: string[];
  template: string;
}

export const sendEmail = async ({ subject, to, template }: SendEmailInput) => {
  if (!process.env.EMAILS_ENABLED || process.env.EMAILS_ENABLED == 'false') {
    return {
      success: true,
    };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const receiver =
    to && to.length > 0
      ? `${process.env.EMAIL_RECEIVER},${to?.join(',')}`
      : process.env.EMAIL_RECEIVER;

  const mail = {
    from: process.env.EMAIL_FROM,
    to: receiver,
    subject: subject || 'TXI App',
    html: template,
  };

  try {
    await transporter.sendMail(mail);

    return {
      success: true,
    };
  } catch (error) {
    logger.error({ error, stack: 'sendEmail' });
    throw error;
  }
};
