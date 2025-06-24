import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'

const languages = ['en', 'kh'];
var langs =  localStorage.getItem("lang")
const lang = languages.includes(langs) ? langs : 'en';

i18n.use(initReactI18next).init({
    fallbackLng: lang,
    lng: lang,
    resources: {
        en: {
            translations: require('./locales/en/translations.json')
        },
        kh: {
            translations: require('./locales/kh/translations.json')
        }
    },
    ns: ['translations'],
    defaultNS: 'translations'
});

i18n.languages = ['en', 'kh']

export default i18n;