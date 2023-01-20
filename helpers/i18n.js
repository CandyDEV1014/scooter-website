import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "../src/locales/en.json";
import fr from "../src/locales/fr.json";

Vue.use(VueI18n);

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || navigator.language.substr(0, 2),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: { en, fr },
});
