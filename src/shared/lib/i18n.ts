import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslation from "../locales/en.json";
import ruTranslation from "../locales/ru.json";

const resources = {
	en: {
		translation: enTranslation,
	},
	ru: {
		translation: ruTranslation,
	},
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		debug: false,

		interpolation: {
			escapeValue: false,
		},

		detection: {
			order: ["localStorage", "navigator", "htmlTag"],
			caches: ["localStorage"],
		},
	});

export default i18n;
