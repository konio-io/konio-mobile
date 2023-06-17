import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './en';
import it from './it';
import fr from './fr';
import de from './de';
import es from './es';
import pt from './pt';
import zh from './zh';

const locales = {
  en,
  it,
  fr,
  de,
  es,
  pt,
  zh
};
const i18n = new I18n(locales);
const systemLocale = getLocales()[0].languageCode;
const defaultLocale = 'en';

i18n.locale = Object.keys(locales).includes(systemLocale) ?
  systemLocale :
  defaultLocale;

export default i18n;