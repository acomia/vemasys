import React from 'react'
import * as Sentry from '@sentry/react-native'
import {SENTRY_DSN} from '@bluecentury/env'
import {AppContainer} from '@bluecentury/components'
import {useRefreshTokenOnSessionExpiry} from '@bluecentury/hooks'
import {RootNavigator} from '@bluecentury/navigation'
import {enableLatestRenderer} from 'react-native-maps'

enableLatestRenderer()

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0
})

const App = () => {
  // monitor for expired session then refresh the token
  useRefreshTokenOnSessionExpiry()
  return (
    <AppContainer>
      <RootNavigator />
    </AppContainer>
  )
}

export default Sentry.wrap(App)
