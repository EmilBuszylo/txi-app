import { formatDate } from '@/lib/helpers/date';

import { dateFormats } from '@/constant/date-formats';
import { Order } from '@/server/orders/order';

export const getNewOrderTemplate = (order: Order) => {
  const orderUrl = `https://www.txi-zlecenia.pl/dashboard/orders/${order.id}/`;
  let locationFrom = `${order.locationFrom.address.fullAddress} ${formatDate(
    order.locationFrom.date,
    dateFormats.dateWithTimeFull
  )} ${order.locationFrom.passenger.name} ${order.locationFrom.passenger.phone}`;
  if (
    order.locationFrom.passenger?.additionalPassengers &&
    order.locationFrom.passenger.additionalPassengers.length > 0
  ) {
    for (const p of order.locationFrom.passenger.additionalPassengers) {
      locationFrom += ' ' + p.name;
    }
  }

  let viaPoints = '';

  if (order?.locationVia) {
    for (const point of order.locationVia) {
      if (viaPoints !== '') {
        viaPoints += ' -> ';
      }
      viaPoints += `${point.address.fullAddress} ${formatDate(
        point.date,
        dateFormats.dateWithTimeFull
      )}`;

      if (point?.passenger?.name) {
        viaPoints += ` ${point?.passenger.name} ${point?.passenger?.phone || ''}`;
      }

      if (
        point.passenger?.additionalPassengers &&
        point.passenger.additionalPassengers.length > 0
      ) {
        for (const p of point.passenger.additionalPassengers) {
          viaPoints += ' ' + p.name;
        }
      }
    }
  }

  const locationTo = `${order.locationTo.address.fullAddress} ${formatDate(
    order.locationTo.date,
    dateFormats.dateWithTimeFull
  )}`;

  return `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>TXI APP - nowe zlecenie</title>
  <style>
    @media only screen and (max-width: 620px) {
      table.body h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }

      table.body p,
      table.body ul,
      table.body ol,
      table.body td,
      table.body span,
      table.body a {
        font-size: 16px !important;
      }

      table.body .wrapper,
      table.body .article {
        padding: 10px !important;
      }

      table.body .content {
        padding: 0 !important;
      }

      table.body .container {
        padding: 0 !important;
        width: 100% !important;
      }

      table.body .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }

      table.body .btn table {
        width: 100% !important;
      }

      table.body .btn a {
        width: 100% !important;
      }

      table.body .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }
    @media all {
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }

      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }

      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }

      .btn-primary table td:hover {
        background-color: #34495e !important;
      }

      .btn-primary a:hover {
        background-color: #34495e !important;
        border-color: #34495e !important;
      }
    }
  </style>
</head>
<body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
  <tr>
    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
    <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
      <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
        <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
          <tr>
            <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                <tr>
                  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                    <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Nowe zlecenie o nr {{txi_id}} zostało dodane przez klienta {{client_name}}</p>
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal;"><span style="font-weight: bold; margin-right: 4px;">Nr zlecenia:</span><span>{{txi_id}}</span></p>
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal;"><span style="font-weight: bold; margin-right: 4px;">Miejsce odbioru:</span><span>{{locationFrom}}</span></p>   
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal;"><span style="font-weight: bold; margin-right: 4px;">Punkty pośrednie:</span><span>{{locationVia}}</span></p>   
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal;"><span style="font-weight: bold; margin-right: 4px;">Miejsce docelowe:</span><span>{{locationTo}}</span></p>                        
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal;"><span style="font-weight: bold; margin-right: 4px;">Komentarz do zlecenia:</span><span>{{comment}}</span></p>
                      <a href="{{order_url}}" target="_blank" style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin-bottom: 15px; text-decoration: none;">*KLIKNIJ ABY OTWORZYĆ ZLECENIE</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </td>
    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
  </tr>
</table>
</body>
</html>`
    .replace('{{client_name}}', order.clientName)
    .replaceAll('{{txi_id}}', order.internalId)
    .replace('{{externalId}}', order.externalId)
    .replace('{{comment}}', order?.comment || '')
    .replace('{{locationFrom}}', locationFrom)
    .replace('{{locationVia}}', viaPoints)
    .replace('{{locationTo}}', locationTo)
    .replace('{{order_url}}', orderUrl)
    .replaceAll('->', `<strong>--></strong>`);
};
