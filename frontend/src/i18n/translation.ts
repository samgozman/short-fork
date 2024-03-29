import i18n from "@/i18n";
import type { RouteLocationNamedRaw } from "vue-router";

/** The idea for this realization comes from https://lokalise.com/blog/vue-i18n/ post */
const translations = {
  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(",");
  },
  get defaultLocale() {
    return import.meta.env.VITE_DEFAULT_LOCALE;
  },
  set currentLocale(newLocale: any) {
    i18n.global.locale.value = newLocale;
  },
  async switchLanguage(newLocale: string) {
    this.currentLocale = newLocale;
    document.querySelector("html")?.setAttribute("lang", newLocale);
    localStorage.setItem("user-locale", newLocale);
  },
  isLocaleSupported(locale: string) {
    return this.supportedLocales.includes(locale);
  },
  getUserLocale() {
    const locale = window.navigator.language || this.defaultLocale;
    return {
      locale: locale,
      localeNoRegion: locale.split("-")[0],
    };
  },
  getPersistedLocale() {
    const persistedLocale = localStorage.getItem("user-locale");
    if (persistedLocale && this.isLocaleSupported(persistedLocale)) {
      return persistedLocale;
    } else {
      return null;
    }
  },
  guessDefaultLocale() {
    const userPersistedLocale = this.getPersistedLocale();
    if (userPersistedLocale) {
      return userPersistedLocale;
    }
    const userPreferredLocale = this.getUserLocale();
    if (this.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale;
    }
    if (this.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion;
    }

    return this.defaultLocale;
  },
  get currentLocale(): string {
    return i18n.global.locale.value;
  },
  /** Helper to create navigation links with locale */
  i18nRoute(to: RouteLocationNamedRaw): RouteLocationNamedRaw {
    return {
      ...to,
      params: {
        locale: this.currentLocale,
        ...to.params,
      },
    };
  },
};
export default translations;
