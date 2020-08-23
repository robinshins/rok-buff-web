import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import translationEn from './translation.en';
import translationKo from './translation.ko';
import translationJa from './translation.ja';
import translationVm from './translation.vm';
import translationGm from './translation.gm';
import translationIn from './translation.in';
import translationPo from './translation.po';
const resources = {
    en: {
        translation: translationEn
    },
    ko: {
        translation: translationKo
    },
    ja:{
        translation: translationJa
    },
    vm:{
        translation: translationVm
    },
    gm:{
        translation: translationGm
    },
    in:{
        translation: translationIn
    },
    po:{
        translation: translationPo
    },
};

i18n.use(detector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        detection:{
            // order and from where user language should be detected
            order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
          
            // keys or params to lookup language from
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',
            lookupFromPathIndex: 0,
            lookupFromSubdomainIndex: 0,
          
            // cache user language on
            caches: ['localStorage', 'cookie'],
            excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
          
            // optional expire and domain for set cookie
            cookieMinutes: 10,
            cookieDomain: 'myDomain',
          
            // optional htmlTag with lang attribute, the default is:
            htmlTag: document.documentElement,
          
            // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
            cookieOptions: {path:'/'}
          },
        resources,
        lng: "en",
        fallbackLng: 'en',
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

    i18n.changeLanguage()

export default i18n;