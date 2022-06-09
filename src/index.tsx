import React from 'react';
import * as Sentry from '@sentry/react-native';
import {SENTRY_DSN} from '@bluecentury/env';
import {AppContainer} from '@bluecentury/components';
import {RootNavigator} from '@bluecentury/navigation';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const App = () => {
  return (
    <AppContainer>
      <RootNavigator />
    </AppContainer>
  );
};

export default Sentry.wrap(App);
