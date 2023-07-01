import en from '../assets/locale/en.json'
import it from '../assets/locale/it.json';
import fr from '../assets/locale/fr.json';
import de from '../assets/locale/de.json';
import es from '../assets/locale/es.json';
import pt from '../assets/locale/pt.json';
import zh from '../assets/locale/zh.json';
import fa from '../assets/locale/fa.json';

const Locales = {
  en,
  it,
  fr,
  de,
  es,
  pt,
  zh,
  fa
};

export default Locales;

export const LocaleIndex : Record<string,string> = {
  "ar": "العربية",
  "de": "Deutsch",
  "en": "English",
  "es": "Español",
  "fa": "فارسی",
  "fr": "Français",
  "it": "Italiano",
  "pt": "Português",
  "ru": "Русский",
  "tr": "Türkçe",
  "zh": "中文"
};