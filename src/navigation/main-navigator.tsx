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
      BackgroundGeolocation.start()
    }
    if (!isMobileTracking) {
      BackgroundGeolocation.stop()
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
