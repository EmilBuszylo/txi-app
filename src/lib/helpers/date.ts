import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

import { dateFormats } from '@/constant/date-formats';

type Ranges = {
  [key in Intl.RelativeTimeFormatUnit]: number;
};

export function formatDate(date: string | Date | undefined, dateFormat: string): string {
  if (!date) {
    return '';
  }
  return format(new Date(date), dateFormat, {
    locale: pl,
  });
}

export function relativeDate(input: string | Date): string {
  const date = new Date(input);
  const formatter = new Intl.RelativeTimeFormat('pl');
  const ranges: Partial<Ranges> = {
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };

  const secondsElapsed = (date.getTime() - Date.now()) / 1000;

  for (const key in ranges) {
    const range = ranges[key as keyof typeof ranges];

    if (range && range < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / range;

      if (key === 'seconds' && Math.abs(delta) < 10) {
        return 'Przed chwilą';
      }

      // return regular date for more than "10 days ago"
      if (key === 'days' && Math.abs(delta) > 10) {
        return format(date, dateFormats.date, {
          locale: pl,
        });
      }

      return formatter.format(Math.round(delta), key as Intl.RelativeTimeFormatUnit);
    }
  }

  return format(date, dateFormats.date, {
    locale: pl,
  });
}

export const todayWithoutTimeZone = new Date().toISOString().slice(0, -8);
