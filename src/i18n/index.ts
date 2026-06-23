import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import az from "./az";
import en from "./en";
import ru from "./ru";

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  az: { translation: az },
};

export const languages = ["en", "ru", "az"] as const;
export type AppLanguage = (typeof languages)[number];

const isAppLanguage = (value: string): value is AppLanguage => {
  return languages.includes(value as AppLanguage);
};

const normalizeLanguage = (value?: string | null): AppLanguage => {
  const code = value?.split("-")[0];
  return code && isAppLanguage(code) ? code : "en";
};

const savedLanguage = localStorage.getItem("app_language");
const browserLanguage = navigator.language;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: normalizeLanguage(savedLanguage || browserLanguage),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export const changeAppLanguage = async (language: AppLanguage) => {
  localStorage.setItem("app_language", language);
  await i18n.changeLanguage(language);
};

export default i18n;
