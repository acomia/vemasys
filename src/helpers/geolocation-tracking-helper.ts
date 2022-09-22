import {useEntity, useMap} from '@bluecentury/stores'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import {Alert, Platform} from 'react-native'

export function InitializeTrackingService() {
  // Configuration
  BackgroundGeolocation.configure({
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50,
    notificationTitle: 'VEMASYS Tracking',
    notificationText: 'Enabled',
    debug: true,
    startOnBoot: false,
    stopOnTerminate: true,
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
    stopOnStillActivity: false
  })

  BackgroundGeolocation.on('location', location => {
    const entityId = useEntity.getState().entityId as string
    if (Platform.OS === 'ios') {
      BackgroundGeolocation.startTask(taskKey => {
        useMap.getState().sendCurrentPosition(entityId, location)
        BackgroundGeolocation.endTask(taskKey)
      })
    } else {
      useMap.getState().sendCurrentPosition(entityId, location)
    }
  })

  BackgroundGeolocation.on('stationary', stationaryLocation => {
    const entityId = useEntity.getState().entityId as string
    console.log('Vessel is currently stationary...')
    if (Platform.OS === 'ios') {
      BackgroundGeolocation.startTask(taskKey => {
        useMap.getState().sendCurrentPosition(entityId, stationaryLocation)
        BackgroundGeolocation.endTask(taskKey)
      })
    } else {
      useMap.getState().sendCurrentPosition(entityId, stationaryLocation)
    }
  })

  BackgroundGeolocation.on('error', error => {
    console.log('[ERROR] BackgroundGeolocation error:', error)
  })

  BackgroundGeolocation.on('start', () => {
    console.log('[INFO] BackgroundGeolocation service has been started')
  })

  BackgroundGeolocation.on('stop', () => {
    console.log('[INFO] BackgroundGeolocation service has been stopped')
  })

  BackgroundGeolocation.on('authorization', status => {
    console.log('[INFO] BackgroundGeolocation authorization status: ' + status)
    if (status !== BackgroundGeolocation.AUTHORIZED) {
      // we need to set delay or otherwise alert may not be shown
      setTimeout(
        () =>
          Alert.alert(
            'App requires location tracking permission',
            'Would you like to open app settings?',
            [
              {
                text: 'Yes',
                onPress: () => BackgroundGeolocation.showAppSettings()
              },
              {
                text: 'No',
                onPress: () => console.log('No Pressed'),
                style: 'cancel'
              }
            ]
          ),
        1000
      )
    }
  })

  BackgroundGeolocation.on('background', () => {
    console.log('[INFO] App is in background')
  })

  BackgroundGeolocation.on('foreground', () => {
    console.log('[INFO] App is in foreground')
  })

  BackgroundGeolocation.on('abort_requested', () => {
    console.log('[INFO] Server responded with 285 Updates Not Required')

    // Here we can decide whether we want stop the updates or not.
    // If you've configured the server to return 285, then it means the server does not require further update.
    // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
    // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
  })

  BackgroundGeolocation.on('http_authorization', () => {
    console.log('[INFO] App needs to authorize the http requests')
  })

  BackgroundGeolocation.checkStatus(status => {
    console.log(
      '[INFO] BackgroundGeolocation service is running',
      status.isRunning
    )
    console.log(
      '[INFO] BackgroundGeolocation services enabled',
      status.locationServicesEnabled
    )
    console.log(
      '[INFO] BackgroundGeolocation auth status: ' + status.authorization
    )
  })
}

export function StopTrackingService() {
  BackgroundGeolocation.removeAllListeners()
}
