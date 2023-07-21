import { format } from 'date-fns';

import { dateFormats } from '@/constant/date-formats';

type Ranges = {
  [key in Intl.RelativeTimeFormatUnit]: number;
};

export function formatDate(date: string | Date, dateFormat: string): string {
  return format(new Date(date), dateFormat);
}

export function relativeDate(input: string | Date): string {
  const date = new Date(input);
  const formatter = new Intl.RelativeTimeFormat('en');
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
        return 'Few seconds ago';
      }

      // return regular date for more than "10 days ago"
      if (key === 'days' && Math.abs(delta) > 10) {
        return format(date, dateFormats.date);
      }

      return formatter.format(Math.round(delta), key as Intl.RelativeTimeFormatUnit);
    }
  }

  return format(date, dateFormats.date);
}
