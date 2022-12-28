import React, {useCallback, useEffect} from 'react'
import {Platform} from 'react-native'
import {Box, HStack, Pressable} from 'native-base'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {
  CommonActions,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import BackgroundGeolocation, {
  Location,
} from 'react-native-background-geolocation'
import BackgroundFetch from 'react-native-background-fetch'
import {ms} from 'react-native-size-matters'
import {Icons} from '@bluecentury/assets'
import {Sidebar, IconButton} from '@bluecentury/components'
import {GPSAnimated} from '@bluecentury/components/gps-animated'
import {Screens} from '@bluecentury/constants'
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
import {useAuth, useEntity, useMap, useSettings} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {navigationRef} from './navigationRef'
import {InitializeTrackingService} from '@bluecentury/helpers'

const {Navigator, Screen} = createDrawerNavigator<MainStackParamList>()

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

export default function MainNavigator({navigation}: Props) {
  const isMobileTracking = useSettings(state => state.isMobileTracking)
  const isQrScanner = useSettings(state => state.isQrScanner)
  const token = useAuth(state => state.token)
  const activeFormations = useMap(state => state.activeFormations)
  const getActiveFormations = useMap(state => state.getActiveFormations)

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

  useEffect(() => {
    InitializeTrackingService()
  }, [])

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

  useEffect(() => {
    useEntity.getState().getUserInfo()
  }, [])

  const initBackgroundFetch = async () => {
    const entityId = useEntity.getState().entityId as string
    // BackgroundFetch event handler.
    const onEvent = async (taskId: string) => {
      console.log('[BackgroundFetch] task: ', taskId)
      // Do your background work...
      BackgroundGeolocation.getCurrentPosition({
        samples: 1,
        persist: true,
      }).then((location: Location) => {
        console.log('[GROUND_FETCH_LOCATION] ', location)
        useMap.getState().sendCurrentPosition(entityId, location.coords)
      })
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId)
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async (taskId: string) => {
      console.warn('[groundFetch] TIMEOUT task: ', taskId)
      BackgroundFetch.finish(taskId)
    }

    // Initialize BackgroundFetch only once when component mounts.
    const status = await BackgroundFetch.configure(
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
          <Box alignItems="center" flexDirection="row" mr={2}>
            <HStack space="3">
              {activeFormations.length ? (
                <IconButton
                  size={ms(25)}
                  source={Icons.formations}
                  onPress={() => navigation.navigate(Screens.Formations)}
                />
              ) : null}
              {isQrScanner ? (
                <IconButton
                  size={ms(25)}
                  source={Icons.qr}
                  onPress={() => navigation.navigate(Screens.QRScanner)}
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
              size={ms(20)}
              source={Icons.menu}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            />
          </Box>
        ),
      }}
      drawerContent={props => <Sidebar {...props} />}
      initialRouteName={Screens.MapView}
    >
      <Screen component={Map} name={Screens.MapView} />
      <Screen component={Notification} name={Screens.Notifications} />
      <Screen component={Planning} name={Screens.Planning} />
      <Screen component={Charters} name={Screens.Charters} />
      <Screen component={Technical} name={Screens.Technical} />
      <Screen component={Financial} name={Screens.Financial} />
      <Screen component={Information} name={Screens.Information} />
      <Screen component={Crew} name={Screens.Crew} />
      <Screen
        options={{
          headerTitle: 'Select your role',
        }}
        component={Entity}
        name={Screens.ChangeRole}
      />
      <Screen component={Settings} name={Screens.Settings} />
    </Navigator>
  )
}
