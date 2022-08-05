/**
 * @format
 */

import 'react-native-gesture-handler'
import {AppRegistry, LogBox} from 'react-native'
import App from './src'
import {name as appName} from './app.json'

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  '`Image`',
  '`new NativeEventEmitter()`',
  'Unsupported dashed',
  'Task orphaned'
])

AppRegistry.registerComponent(appName, () => App)
