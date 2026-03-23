import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";

export type Locale = (typeof LOCALES)[number];

export function isLocale(value?: string): value is Locale {
  return !!value && LOCALES.includes(value as Locale);
}

export function resolveLocale(value?: string): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}
