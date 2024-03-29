import React, {useCallback, useEffect, useState} from 'react'
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
import {
  Sidebar,
  IconButton,
  GPSTracker,
  HeaderRight,
} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'

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
import {
  useAuth,
  useCharters,
  useEntity,
  useMap,
  useSettings,
} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {navigationRef} from './navigationRef'
import {GPSAnimated} from '@bluecentury/components/gps-animated'
import {InitializeTrackingService} from '@bluecentury/helpers'
import {
  MainStackParamList,
  RootStackParamList,
} from '@bluecentury/types/nav.types'

const {Navigator, Screen} = createDrawerNavigator<MainStackParamList>()

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

export default function MainNavigator({navigation}: Props) {
  const {t} = useTranslation()
  const isMobileTracking = useSettings(state => state.isMobileTracking)
  const isQrScanner = useSettings(state => state.isQrScanner)
  const token = useAuth(state => state.token)
  // const activeFormations = useMap(state => state.activeFormations)
  // const getActiveFormations = useMap(state => state.getActiveFormations)
  const {activeFormations, getActiveFormations, isGPSOpen, setGPSOpen} =
    useMap()
  const {getCharters} = useCharters()

  useFocusEffect(
    useCallback(() => {
      getActiveFormations()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  useEffect(() => {
    const initializeTrackingService = async () => {
      InitializeTrackingService()
    }

    if (isMobileTracking) {
      BackgroundGeolocation.start()
      if (Platform.OS === 'android') {
        initBackgroundFetch()
      }
    } else {
      BackgroundGeolocation.stop()
      BackgroundFetch.stop()
    }

    initializeTrackingService()
  }, [isMobileTracking])

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
    const id = useEntity.getState().vesselId
    useEntity.getState().getUserInfo()
    useSettings.getState().getDraughtTable(id)
    getCharters()
  }, [])

  const initBackgroundFetch = async () => {
    const entityId = useEntity.getState().entityId as string
    // BackgroundFetch event handler.
    const onEvent = async (taskId: string) => {
      // Do your background work...
      BackgroundGeolocation.getCurrentPosition({
        samples: 1,
        persist: true,
      }).then((location: Location) => {
        useMap.getState().sendCurrentPosition(entityId, location.coords)
      })
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId)
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
    const onTimeout = async (taskId: string) => {
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
    <>
      <Navigator
        screenOptions={{
          drawerStyle: {
            width: ms(220),
          },
          headerTitleAlign: 'left',
          headerTitleStyle: {fontSize: 16, fontWeight: 'bold'},
          headerStyle: {backgroundColor: Colors.light},
          headerShadowVisible: false,
          headerRight: () => <HeaderRight />,
          headerLeft: () => (
            <Box ml={ms(20)}>
              <IconButton
                size={ms(20)}
                source={Icons.menu}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            </Box>
          ),
        }}
        drawerContent={props => <Sidebar {...props} />}
        initialRouteName={Screens.Planning}
      >
        <Screen
          component={Map}
          name={Screens.MapView}
          options={{title: t(Screens.MapView)}}
        />
        <Screen
          component={Notification}
          name={Screens.Notifications}
          options={{title: t(Screens.Notifications)}}
        />
        <Screen
          component={Planning}
          name={Screens.Planning}
          options={{title: t(Screens.Planning)}}
        />
        <Screen
          component={Charters}
          name={Screens.Charters}
          options={{title: t(Screens.Charters)}}
        />
        <Screen
          component={Technical}
          name={Screens.Technical}
          options={{title: t(Screens.Technical)}}
        />
        <Screen
          component={Financial}
          name={Screens.Financial}
          options={{title: t(Screens.Financial)}}
        />
        <Screen
          component={Information}
          name={Screens.Information}
          options={{title: t(Screens.Information)}}
        />
        <Screen
          component={Crew}
          name={Screens.Crew}
          options={{title: t(Screens.Crew)}}
        />
        <Screen
          options={{
            headerTitle: t('selectYourRole'),
          }}
          component={Entity}
          name={Screens.ChangeRole}
        />
        <Screen component={Settings} name={Screens.Settings} />
      </Navigator>
      <GPSTracker close={() => setGPSOpen(false)} isOpen={isGPSOpen} />
    </>
  )
}
