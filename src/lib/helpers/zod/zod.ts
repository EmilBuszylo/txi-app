import i18next from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

// Import your language translation files
import translation from './zod_pl.json';

// lng and resources key depend on your locale.
i18next.init({
  lng: 'pl',
  resources: {
    pl: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

export default z;
