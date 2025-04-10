import en from "@/locales/en.json";
import de from "@/locales/de.json";

const translations = {
  en,
  de,
};

class I18n {
  constructor(defaultLang = "en") {
    this.lang = defaultLang;
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.lang = lang;
    } else {
      console.warn(`Language "${lang}" not found. Falling back to "en".`);
      this.lang = "en";
    }
  }

  t(key, params = {}) {
    const keys = key.split(".");
    let current = translations[this.lang];

    for (const k of keys) {
      if (current?.[k] !== undefined) {
        current = current[k];
      } else {
        console.warn(`Missing translation for key: "${key}" in ${this.lang}`);
        return key;
      }
    }

    if (typeof current === "string") {
      return current.replace(/{{(.*?)}}/g, (_, p) => {
        return params[p.trim()] ?? `{{${p}}}`;
      });
    }

    return key;
  }

  getCurrentLang() {
    return this.lang;
  }
}

const i18n = new I18n();
export default i18n;
