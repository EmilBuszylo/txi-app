import { UrlObject } from 'url';

export const isLocalLink = (href: string | UrlObject): boolean => {
  if (typeof href !== 'string') return true;

  return (
    href.startsWith('/') ||
    (!!process.env.NEXT_PUBLIC_SITE_URL && href.includes(process.env.NEXT_PUBLIC_SITE_URL))
  );
};
