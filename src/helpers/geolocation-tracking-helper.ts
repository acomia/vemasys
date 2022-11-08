import {useEntity, useMap} from '@bluecentury/stores'
// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import {Alert, Platform} from 'react-native'
import BackgroundGeolocation, {
  Location,
  Subscription,
} from 'react-native-background-geolocation'

// export function InitializeTrackingService() {
//   // Configuration
//   BackgroundGeolocation.configure({
//     desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
//     stationaryRadius: 50,
//     distanceFilter: 50,
//     notificationTitle: 'VEMASYS Tracking',
//     notificationText: 'Enabled',
//     debug: __DEV__ ? true : false,
//     startOnBoot: false,
//     stopOnTerminate: true,
//     locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
//     interval: 10000,
//     fastestInterval: 5000,
//     activitiesInterval: 10000,
//     stopOnStillActivity: false,
//     saveBatteryOnBackground: false
//     // notificationsEnabled: false
//   })
//
//   BackgroundGeolocation.on('location', location => {
//     const entityId = useEntity.getState().entityId as string
//     if (Platform.OS === 'ios') {
//       BackgroundGeolocation.startTask(taskKey => {
//         useMap.getState().sendCurrentPosition(entityId, location)
//         BackgroundGeolocation.endTask(taskKey)
//       })
//     } else {
//       useMap.getState().sendCurrentPosition(entityId, location)
//     }
//   })
//
//   BackgroundGeolocation.on('stationary', stationaryLocation => {
//     const entityId = useEntity.getState().entityId as string
//     console.log('Vessel is currently stationary...')
//     if (Platform.OS === 'ios') {
//       BackgroundGeolocation.startTask(taskKey => {
//         useMap.getState().sendCurrentPosition(entityId, stationaryLocation)
//         BackgroundGeolocation.endTask(taskKey)
//       })
//     } else {
//       useMap.getState().sendCurrentPosition(entityId, stationaryLocation)
//     }
//   })
//
//   BackgroundGeolocation.on('error', error => {
//     console.log('[ERROR] BackgroundGeolocation error:', error)
//   })
//
//   BackgroundGeolocation.on('start', () => {
//     console.log('[INFO] BackgroundGeolocation service has been started')
//   })
//
//   BackgroundGeolocation.on('stop', () => {
//     console.log('[INFO] BackgroundGeolocation service has been stopped')
//   })
//
//   BackgroundGeolocation.on('authorization', status => {
//     console.log('[INFO] BackgroundGeolocation authorization status: ' + status)
//     if (status !== BackgroundGeolocation.AUTHORIZED) {
//       // we need to set delay or otherwise alert may not be shown
//       setTimeout(
//         () =>
//           Alert.alert(
//             'App requires location tracking permission',
//             'Would you like to open app settings?',
//             [
//               {
//                 text: 'Yes',
//                 onPress: () => BackgroundGeolocation.showAppSettings()
//               },
//               {
//                 text: 'No',
//                 onPress: () => console.log('No Pressed'),
//                 style: 'cancel'
//               }
//             ]
//           ),
//         1000
//       )
//     }
//   })
//
//   BackgroundGeolocation.on('background', () => {
//     console.log('[INFO] App is in background')
//   })
//
//   BackgroundGeolocation.on('foreground', () => {
//     console.log('[INFO] App is in foreground')
//   })
//
//   BackgroundGeolocation.on('abort_requested', () => {
//     console.log('[INFO] Server responded with 285 Updates Not Required')
//
//     // Here we can decide whether we want stop the updates or not.
//     // If you've configured the server to return 285, then it means the server does not require further update.
//     // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
//     // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
//   })
//
//   BackgroundGeolocation.on('http_authorization', () => {
//     console.log('[INFO] App needs to authorize the http requests')
//   })
//
//   BackgroundGeolocation.checkStatus(status => {
//     console.log(
//       '[INFO] BackgroundGeolocation service is running',
//       status.isRunning
//     )
//     console.log(
//       '[INFO] BackgroundGeolocation services enabled',
//       status.locationServicesEnabled
//     )
//   })
// }
//
// export function StopTrackingService() {
//   BackgroundGeolocation.removeAllListeners()
// }
export const InitializeTrackingService = () => {
  const entityId = useEntity.getState().entityId as string
  BackgroundGeolocation.onLocation((location) => {
    console.log('[onLocation]', location)
    useMap.getState().sendCurrentPosition(entityId, location.coords)
  })

  BackgroundGeolocation.onMotionChange((event) => {
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

  BackgroundGeolocation.onActivityChange((event) => {
    console.log('[onMotionChange]', event)
  })

  BackgroundGeolocation.onProviderChange((event) => {
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
    stopTimeout: 5,
    // Application config
    debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
    startOnBoot: true, // <-- Auto start tracking when device is powered-up.
    // HTTP / SQLite config
    // url: 'http://yourserver.com/locations',
    // batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
    // autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
    // headers: {
    //   // <-- Optional HTTP headers
    //   'X-FOO': 'bar',
    // },
    // params: {
    //   // <-- Optional HTTP params
    //   auth_token: 'maybe_your_server_authenticates_via_token_YES?',
    // },
  }).then(state => {
    console.log(
      '- BackgroundGeolocation is configured and ready: ',
      state.enabled
    )
  })
}
