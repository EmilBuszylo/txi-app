import nodemailer from 'nodemailer';

import { logger } from '@/lib/logger';
import { SendEmailRequest } from '@/lib/server/api/endpoints';

import { defaultTemplate } from '@/server/email/templates/default-template';

export const sendEmail = async ({ subject, orderData }: SendEmailRequest) => {
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

  const orderUrl = `https://www.txi-zlecenia.pl/dashboard/orders/${orderData.id}/`;

  const template = defaultTemplate
    .replace(/{{order_url}}/gm, orderUrl)
    .replace(/{{txi_number}}/gm, orderData.internalId)
    .replace(/{{client_name}}/, orderData.clientName);

  const mail = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_RECEIVER,
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
