import { UrlObject } from 'url';

export const ensureLocalLink = (href: string | UrlObject): string | UrlObject => {
  if (typeof href !== 'string') return href;

  let link = href;

  if (process.env.NEXT_PUBLIC_SITE_URL && link.includes(process.env.NEXT_PUBLIC_SITE_URL)) {
    link = link.replace(process.env.NEXT_PUBLIC_SITE_URL, '');
  }

  return link;
};
