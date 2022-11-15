import React, {useCallback, useEffect} from 'react'
import {ImageSourcePropType, Platform} from 'react-native'
import {Box, HStack, Pressable} from 'native-base'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {
  CommonActions,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import BackgroundGeolocation from 'react-native-background-geolocation'

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
// import {
//   InitializeTrackingService,
//   StopTrackingService,
// } from '@bluecentury/helpers'
import {GPSAnimated} from '@bluecentury/components/gps-animated'
import BackgroundGeolocation from 'react-native-background-geolocation'
import BackgroundService from 'react-native-background-actions'
import BackgroundFetch from 'react-native-background-fetch'

const {Navigator, Screen} = createDrawerNavigator<MainStackParamList>()

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

export default function MainNavigator({navigation}: Props) {
  const isMobileTracking = useSettings(state => state.isMobileTracking)
  const isQrScanner = useSettings(state => state.isQrScanner)
  const token = useAuth(state => state.token)
  const activeFormations = useMap(state => state.activeFormations)
  const getActiveFormations = useMap(state => state.getActiveFormations)

  const testFormations = [0, 1, 2, 3]

  useFocusEffect(
    useCallback(() => {
      getActiveFormations()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  useEffect(() => {
    if (isMobileTracking) {
      console.log('START_BG_LOCATION')
      BackgroundGeolocation.start()
      if (Platform.OS === 'android') {
        initBackgroundFetch()
      }
    }
    if (!isMobileTracking) {
      console.log('STOP_BG_LOCATION')
      BackgroundGeolocation.stop()
      BackgroundFetch.stop()
    }
  }, [isMobileTracking])

  // useEffect(() => {
  //   InitializeTrackingService()
  // }, [])

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

  const initBackgroundFetch = async () => {
    const entityId = useEntity.getState().entityId as string
    // BackgroundFetch event handler.
    const onEvent = async taskId => {
      console.log('[BackgroundFetch] task: ', taskId)
      // Do your background work...
      BackgroundGeolocation.getCurrentPosition({
        samples: 1,
        persist: true,
      }).then(location => {
        console.log('[GROUND_FETCH_LOCATION] ', location)
        useMap.getState().sendCurrentPosition(entityId, location.coords)
      })
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId)
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async taskId => {
      console.warn('[groundFetch] TIMEOUT task: ', taskId)
      BackgroundFetch.finish(taskId)
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure(
      {minimumFetchInterval: 15, enableHeadless: true, stopOnTerminate: false},
      onEvent,
      onTimeout
    )

    console.log('[groundFetch] configure status: ', status)
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
              {activeFormations.length ? (
                <IconButton
                  source={Icons.formations}
                  onPress={() => navigation.navigate(Screens.Formations)}
                  size={ms(25)}
                />
              ) : null}
              {isQrScanner ? (
                <IconButton
                  source={Icons.qr}
                  onPress={() => navigation.navigate(Screens.QRScanner)}
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
