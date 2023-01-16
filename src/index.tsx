import React from 'react'
import * as Sentry from '@sentry/react-native'
import {SENTRY_DSN} from '@vemasys/env'
import {AppContainer} from '@bluecentury/components'
import {RootNavigator} from '@bluecentury/navigation'
import {enableLatestRenderer} from 'react-native-maps'
import {NativeBaseProvider} from 'native-base'
import {theme} from '@bluecentury/styles'
import './constants/localization/i18n'
import {useEntity, useAuth, useSettings} from '@bluecentury/stores'
import i18next from 'i18next'
import * as RNLocalize from 'react-native-localize'

enableLatestRenderer()

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0
})

const App = () => {
  const token = useAuth().token
  const languageFromStore = useSettings().language

  const preferredLanguage = () => {
    const devicePreferredLanguage = RNLocalize.getLocales()[0].languageCode
    if (devicePreferredLanguage === 'fr') {
      return devicePreferredLanguage
    } else {
      return 'en'
    }
  }

  if (!token) {
    if (languageFromStore) {
      i18next.changeLanguage(languageFromStore)
    } else {
      i18next.changeLanguage(preferredLanguage())
    }
  }

  return (
    <NativeBaseProvider theme={theme}>
      <AppContainer>
        <RootNavigator />
      </AppContainer>
    </NativeBaseProvider>
  )
}

export default Sentry.wrap(App)
