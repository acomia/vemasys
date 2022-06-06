import React, {useEffect} from 'react';
import * as Sentry from '@sentry/react-native';
import {SENTRY_DSN} from '@bluecentury/env';
import {AppContainer} from '@bluecentury/components';
import {MainNavigator} from '@bluecentury/navigation';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const App = () => {
  useEffect(() => {
    throw new Error('My first Sentry error!');
  }, []);
  return (
    <AppContainer>
      <MainNavigator />
    </AppContainer>
  );
};

export default Sentry.wrap(App);
