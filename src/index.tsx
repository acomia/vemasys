import React from 'react'
import * as Sentry from '@sentry/react-native'
import {SENTRY_DSN} from '@vemasys/env'
import {AppContainer} from '@bluecentury/components'
import {RootNavigator} from '@bluecentury/navigation'
import {enableLatestRenderer} from 'react-native-maps'
import {NativeBaseProvider} from 'native-base'
import {theme} from '@bluecentury/styles'

enableLatestRenderer()

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0
})

const App = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <AppContainer>
        <RootNavigator />
      </AppContainer>
    </NativeBaseProvider>
  )
}

export default Sentry.wrap(App)
