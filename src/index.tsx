import React, {useEffect} from 'react'
import * as Sentry from '@sentry/react-native'
import {SENTRY_DSN} from '@vemasys/env'
import {AppContainer} from '@bluecentury/components'
import {RootNavigator} from '@bluecentury/navigation'
import {enableLatestRenderer} from 'react-native-maps'
import {NativeBaseProvider} from 'native-base'
import {theme} from '@bluecentury/styles'
import './constants/localization/i18n'
import {useAuth, useEntity, useSettings} from '@bluecentury/stores'
import i18next from 'i18next'
import * as RNLocalize from 'react-native-localize'
import {useNetInfo} from '@react-native-community/netinfo'
import {uploadComment} from '@bluecentury/utils'

enableLatestRenderer()

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: useSettings.getState().env === 'PROD' ? 'production' : 'testing',
})

const App = () => {
  const token = useAuth().token
  const languageFromStore = useSettings().language
  const env = useSettings().env
  const {isConnected, isInternetReachable} = useNetInfo()
  const setIsOnline = useSettings(state => state.setIsOnline)
  const isOnline = useSettings().isOnline
  const commentsWaitingForUpload = useEntity().commentsWaitingForUpload
  const setCommentsWaitingForUpload = useEntity().setCommentsWaitingForUpload

  const checkConnection = () => {
    if (isConnected === true && isInternetReachable === true) {
      // console.log('You are online!')
      setIsOnline(true)
    }
    if (isConnected === false && isInternetReachable === false) {
      // console.log('You are offline!')
      setIsOnline(false)
    }
  }

  console.log('WAITING_COMMENTS', commentsWaitingForUpload)

  useEffect(() => {
    isOnline ? console.log('ONLINE') : console.log('OFFLINE')
    if (isOnline && commentsWaitingForUpload.length) {
      commentsWaitingForUpload.forEach(item => {
        uploadComment(
          item.method,
          item.routeFrom,
          item.description,
          item.imgFile,
          item.attachedImgs,
          item.showToast,
          undefined,
          item.navlogId
        )
      })
      setCommentsWaitingForUpload('clear')
    }
  }, [isOnline])

  useEffect(() => {
    checkConnection()
  }, [isConnected, isInternetReachable])

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
