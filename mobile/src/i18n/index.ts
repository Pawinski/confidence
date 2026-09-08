import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { translations } from './translations';

const i18n = new I18n(translations);

i18n.defaultLocale = 'fr';
i18n.locale = 'fr';
i18n.enableFallback = true;

export function initializeLocale(savedLocale?: string | null) {
  if (savedLocale && (savedLocale === 'fr' || savedLocale === 'en')) {
    i18n.locale = savedLocale;
  } else {
    const deviceLocales = Localization.getLocales();
    const deviceLang = deviceLocales[0]?.languageCode ?? 'fr';
    i18n.locale = deviceLang === 'en' ? 'en' : 'fr';
  }
}

export function setLocale(locale: 'fr' | 'en') {
  i18n.locale = locale;
}

export function getLocale(): 'fr' | 'en' {
  return i18n.locale as 'fr' | 'en';
}

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

export { i18n };
