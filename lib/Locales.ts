import en from '../assets/locale/en.json'
import it from '../assets/locale/it.json';
import fr from '../assets/locale/fr.json';
import de from '../assets/locale/de.json';
import es from '../assets/locale/es.json';
import pt from '../assets/locale/pt.json';
import zh from '../assets/locale/zh.json';
import fa from '../assets/locale/fa.json';
import ru from '../assets/locale/ru.json';
import tr from '../assets/locale/tr.json';
import ar from '../assets/locale/ar.json';
import ja from '../assets/locale/ja.json';
import hi from '../assets/locale/hi.json';
import bn from '../assets/locale/bn.json';

const Locales = {
  en,
  it,
  fr,
  de,
  es,
  pt,
  zh,
  fa,
  ru,
  tr,
  ar,
  ja,
  hi,
  bn
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
  "zh": "中文",
  "ja": "日本語",
  "hi": "हिन्दी",
  "bn": "বাঙালি"
};