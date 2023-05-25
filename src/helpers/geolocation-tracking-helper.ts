import {useEntity, useMap} from '@bluecentury/stores'
import BackgroundGeolocation from 'react-native-background-geolocation'

export const InitializeTrackingService = () => {
  const entityId = useEntity.getState().entityId as string
  BackgroundGeolocation.onLocation(location => {
    console.log('[onLocation]', location)
    useMap.getState().sendCurrentPosition(entityId, location.coords)
  })

  BackgroundGeolocation.onMotionChange(event => {
    console.log('[onMotionChange]', event)
  })

  BackgroundGeolocation.onHeartbeat(() => {
    BackgroundGeolocation.getCurrentPosition({
      samples: 1,
      persist: true,
    }).then(location => {
      console.log('[onHeartBeat_getCurrentPosition] ', location)
      useMap.getState().sendCurrentPosition(entityId, location.coords)
    })
  })

  BackgroundGeolocation.onActivityChange(event => {
    console.log('[onMotionChange]', event)
  })

  BackgroundGeolocation.onProviderChange(event => {
    console.log('[onProviderChange]', event)
  })

  /// 2. ready the plugin.
  BackgroundGeolocation.ready({
    // Geolocation Config
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    heartbeatInterval: 60, // Time between heartbeats, in seconds
    preventSuspend: true,
    // Activity Recognition
    stopTimeout: 1,
    // Application config
    debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
    startOnBoot: true, // <-- Auto start tracking when device is powered-up.
    enableHeadless: true,
  }).then(state => {
    console.log(
      '- BackgroundGeolocation is configured and ready: ',
      state.enabled
    )
  })
}
