import nodemailer from 'nodemailer';

import { logger } from '@/lib/logger';
import { SendEmailRequest } from '@/lib/server/api/endpoints';

import { defaultTemplate } from '@/server/email/templates/default-template';

interface SendEmailInput extends SendEmailRequest {
  to?: string[];
  template?: string;
}

export const sendEmail = async ({ subject, orderData, to, template }: SendEmailInput) => {
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

  const emailTemplate = template
    ? template
    : defaultTemplate
        .replace(/{{order_url}}/gm, orderUrl)
        .replace(/{{txi_number}}/gm, orderData.internalId)
        .replace(/{{client_name}}/, orderData.clientName);

  const receiver =
    to && to.length > 0
      ? `${process.env.EMAIL_RECEIVER},${to?.join(',')}`
      : process.env.EMAIL_RECEIVER;

  const mail = {
    from: process.env.EMAIL_FROM,
    to: receiver,
    subject: subject || 'TXI App',
    html: emailTemplate,
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
