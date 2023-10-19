export const removeCountriesFromLocationString = (text?: string) => {
  const arrayOfTexts = [
    ', Polska',
    ', Czechy',
    ', Niemcy',
    ', Słowacja',
    ', Litwa',
    ', Białoruś',
    ', Bialorus',
  ].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(arrayOfTexts.join('|'), 'g');

  if (!text) return '';

  return text.replaceAll(pattern, '');
};
