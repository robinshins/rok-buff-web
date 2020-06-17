import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import translationEn from './translation.en';
import translationKo from './translation.ko';

const resources = {
    en: {
        translation: translationEn
    },
    ko: {
        translation: translationKo
    }
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .use(detector)
    .init({
        resources,
        lng: "en",
        fallbackLng: 'en',
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;