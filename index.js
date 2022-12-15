/**
 * @format
 */

import 'react-native-gesture-handler'
import {AppRegistry, LogBox} from 'react-native'
import App from './src'
import {name as appName} from './app.json'
import BackgroundGeolocation from 'react-native-background-geolocation'
import {useEntity, useMap} from '@bluecentury/stores'
import BackgroundFetch from 'react-native-background-fetch'

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  '`Image`',
  '`new NativeEventEmitter()`',
  'Unsupported dashed',
  'Task orphaned'
])

AppRegistry.registerComponent(appName, () => App)

let HeadlessTask = async (event) => {
  const entityId = useEntity.getState().entityId
  let params = event.params
  console.log('[BackgroundGeolocation HeadlessTask] EVENT', event)

  event.name === 'location'
    ? useMap.getState().sendCurrentPosition(entityId, params.coords)
    : console.log('HAVE_NO_COORDS')
}

BackgroundGeolocation.registerHeadlessTask(HeadlessTask)

let HeadlessTaskStationary = async (event) => {
  console.log('[BackgroundFetch HeadlessTask] EVENT:', event)
  let taskId = event.taskId
  let isTimeout = event.timeout
  if (isTimeout) {
    // This task has exceeded its allowed running-time.
    // You must stop what you're doing immediately finish(taskId)
    console.log('[BackgroundFetch HeadlessTask] TIMEOUT:', taskId)
    BackgroundFetch.finish(taskId)
    return
  }

  const entityId = useEntity.getState().entityId
  console.log('[BackgroundFetch HeadlessTask] start: ', taskId)

  let location = await BackgroundGeolocation.getCurrentPosition()
  console.log('[BackgroundFetch HeadlessTask] - getCurrentPosition:', location)
  useMap.getState().sendCurrentPosition(entityId, location.coords)
  BackgroundFetch.finish(taskId)
}
BackgroundFetch.registerHeadlessTask(HeadlessTaskStationary)
