import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import translationEN from './en.json'
import translationFR from './fr.json'
import {useSettings} from '@bluecentury/stores'

const language = useSettings.getState().language
const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
}
i18n.use(initReactI18next).init({
  resources,
  lng: useSettings.getState().language,
  // fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})
