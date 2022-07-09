/**
 * @format
 */

import 'react-native-gesture-handler'
import {AppRegistry, LogBox} from 'react-native'
import App from './src'
import {name as appName} from './app.json'

LogBox.ignoreLogs([
  '`Image`',
  'ViewPropTypes will be removed from React Native.'
])

AppRegistry.registerComponent(appName, () => App)
