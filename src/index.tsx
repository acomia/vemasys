import React, {useEffect} from 'react'
import * as Sentry from '@sentry/react-native'
import {SENTRY_DSN} from '@vemasys/env'
import {AppContainer} from '@bluecentury/components'
import {RootNavigator} from '@bluecentury/navigation'
import {enableLatestRenderer} from 'react-native-maps'
import {NativeBaseProvider} from 'native-base'
import {theme} from '@bluecentury/styles'
import './constants/localization/i18n'
import {useAuth, useSettings} from '@bluecentury/stores'
import i18next from 'i18next'
import * as RNLocalize from 'react-native-localize'
import {useNetInfo} from '@react-native-community/netinfo'

enableLatestRenderer()

// Sentry.init({
//   dsn: SENTRY_DSN,
//   tracesSampleRate: 1.0
// })

const App = () => {
  const token = useAuth().token
  const languageFromStore = useSettings().language
  const env = useSettings().env

  useEffect(() => {
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: env === 'PROD' ? 'production' : 'testing',
    })
  }, [])
  const isOnline = useSettings().isOnline
  const netInfo = useNetInfo()
  const setIsOnline = useSettings(state => state.setIsOnline)
  // const headerHeight = useHeaderHeight()

  const checkConnection = () => {
    if (netInfo.isConnected && netInfo.isInternetReachable) {
      console.log('You are online!')
      // console.log('HEADER_HEIGHT', NativeStackHeaderProps)
      setIsOnline(true)
    } else {
      console.log('You are offline!')
      // console.log('HEADER_HEIGHT', headerHeight || 0)
      setIsOnline(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [netInfo])

  useEffect(() => {
    console.log('IS_ONLINE_FROM_STORE:', isOnline)
  }, [isOnline])

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
