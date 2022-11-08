import React, {useCallback, useEffect, useRef, useState} from 'react'
import {AppState, ImageSourcePropType, Platform} from 'react-native'
import {Box, HStack, Pressable} from 'native-base'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {
  CommonActions,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import {ms} from 'react-native-size-matters'
import Geolocation, {GeoPosition} from 'react-native-geolocation-service'

import {
  Notification,
  Entity,
  Map,
  Planning,
  Charters,
  Technical,
  Financial,
  Information,
  Crew,
  Settings,
} from '@bluecentury/screens'
import {Sidebar, IconButton} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Screens} from '@bluecentury/constants'
import {Colors} from '@bluecentury/styles'
import {useAuth, useEntity, useMap, useSettings} from '@bluecentury/stores'
import {navigationRef} from './navigationRef'
import {
  InitializeTrackingService,
  StopTrackingService,
} from '@bluecentury/helpers'
import {GPSAnimated} from '@bluecentury/components/gps-animated'
import BackgroundService from 'react-native-background-actions'

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time))

BackgroundService.on('expiration', () => {
  getCurrentGeolocation()
})

const backgroundTrackingTask = async (taskData: any) => {
  await new Promise<void>(async resolve => {
    const {delay} = taskData
    for (let i = 0; BackgroundService.isRunning(); i++) {
      getCurrentGeolocation()
      await BackgroundService.updateNotification({
        taskDesc: 'Running gps background tracking...',
      })
      await sleep(delay)
    }
    resolve()
  })
}

const getCurrentGeolocation = () => {
  Geolocation.getCurrentPosition(
    position => {
      const entityId = useEntity.getState().entityId as string
      useMap.getState().sendCurrentPosition(entityId, position)
    },
    error => {
      console.log(error.code, error.message)
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000}
  )
}

const options = {
  taskName: 'GPS_Background_Tracking',
  taskTitle: 'GPS background tracking enabled',
  taskDesc: 'GPS background tracking of current position',
  taskIcon: {
    name: 'ic_launcher_foreground',
    type: 'mipmap',
  },
  color: Colors.primary,
  parameters: {
    delay: 1 * 60 * 1000,
  },
}

const {Navigator, Screen} = createDrawerNavigator<MainStackParamList>()

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

export default function MainNavigator({navigation}: Props) {
  const isMobileTracking = useSettings(state => state.isMobileTracking)
  const isQrScanner = useSettings(state => state.isQrScanner)
  const token = useAuth(state => state.token)
  const activeFormations = useMap(state => state.activeFormations)
  const getActiveFormations = useMap(state => state.getActiveFormations)
  const sendCurrentPosition = useMap(state => state.sendCurrentPosition)
  // let scanIcon: ImageSourcePropType = Icons.qr
  const scanIcon: ImageSourcePropType = activeFormations.length
    ? Icons.formations
    : Icons.qr
  // let scanNavigateTo: () => void
  const scanNavigateTo = activeFormations.length
    ? () => navigation.navigate(Screens.Formations)
    : () => navigation.navigate(Screens.QRScanner)
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)
  let runningInBackground = BackgroundService.isRunning()

  useFocusEffect(
    useCallback(() => {
      getActiveFormations()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  useEffect(() => {
    if (isMobileTracking) {
      toggleBackgroundTracking()
    }
    if (!isMobileTracking) {
      BackgroundService.stop()
    }
  }, [isMobileTracking])

  // useEffect(() => {
  //   // BackgroundGeolocation.checkStatus(status => {
  //   //   if (!status.isRunning && isMobileTracking) {
  //   //     BackgroundGeolocation.start()
  //   //   }
  //   //   if (status.isRunning && !isMobileTracking) {
  //   //     BackgroundGeolocation.stop()
  //   //   }
  //   // })
  // }, [isMobileTracking])

  useEffect(() => {
    if (typeof token === 'undefined') {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Splash',
            },
          ],
        })
      )
    }
  }, [token])

  const toggleBackgroundTracking = async () => {
    runningInBackground = !runningInBackground
    if (runningInBackground) {
      try {
        await BackgroundService.start(backgroundTrackingTask, options)
      } catch (e) {
        console.log('Error', e)
      }
    }
  }

  return (
    <Navigator
      screenOptions={{
        drawerStyle: {
          width: ms(220),
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {fontSize: 16, fontWeight: 'bold'},
        headerStyle: {backgroundColor: Colors.light},
        headerShadowVisible: false,
        headerRight: () => (
          <Box flexDirection="row" alignItems="center" mr={2}>
            <HStack space="3">
              {isQrScanner ? (
                <IconButton
                  source={scanIcon}
                  onPress={scanNavigateTo}
                  size={ms(25)}
                />
              ) : null}
              <Pressable
                size={ms(40)}
                onPress={() => navigation.navigate('GPSTracker')}
              >
                <GPSAnimated />
              </Pressable>
            </HStack>
          </Box>
        ),
        headerLeft: () => (
          <Box ml={ms(20)}>
            <IconButton
              source={Icons.menu}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              size={ms(20)}
            />
          </Box>
        ),
      }}
      initialRouteName={Screens.MapView}
      drawerContent={props => <Sidebar {...props} />}
    >
      <Screen name={Screens.MapView} component={Map} />
      <Screen name={Screens.Notifications} component={Notification} />
      <Screen name={Screens.Planning} component={Planning} />
      <Screen name={Screens.Charters} component={Charters} />
      <Screen name={Screens.Technical} component={Technical} />
      <Screen name={Screens.Financial} component={Financial} />
      <Screen name={Screens.Information} component={Information} />
      <Screen name={Screens.Crew} component={Crew} />
      <Screen
        name={Screens.ChangeRole}
        component={Entity}
        options={{
          headerTitle: 'Select your role',
        }}
      />
      <Screen name={Screens.Settings} component={Settings} />
    </Navigator>
  )
}
