import i18n from "@/i18n";

const translations = {
  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(",");
  },
  set currentLocale(newLocale: any) {
    i18n.global.locale.value = newLocale;
  },
  async switchLanguage(newLocale: string) {
    this.currentLocale = newLocale;
    console.log("newLocale", newLocale);
    document.querySelector("html")?.setAttribute("lang", newLocale);
  },
};
export default translations;
