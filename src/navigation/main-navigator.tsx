import React, {useCallback, useEffect, useRef} from 'react'
import {ImageSourcePropType, Platform} from 'react-native'
import {Box, HStack, Pressable} from 'native-base'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {
  CommonActions,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native'
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
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {Screens} from '@bluecentury/constants'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {useAuth, useEntity, useMap, useSettings} from '@bluecentury/stores'
import {navigationRef} from './navigationRef'
import {
  InitializeTrackingService,
  StopTrackingService,
} from '@bluecentury/helpers'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import {GPSAnimated} from '@bluecentury/components/gps-animated'

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
  let refreshId = useRef<any>()

  useFocusEffect(
    useCallback(() => {
      getActiveFormations()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  useEffect(() => {
    BackgroundGeolocation.checkStatus(status => {
      if (!status.isRunning && isMobileTracking) {
        BackgroundGeolocation.start()
      }

      if (status.isRunning && !isMobileTracking) {
        BackgroundGeolocation.stop()
      }
    })
    if (isMobileTracking) {
      refreshId.current = setInterval(() => {
        BackgroundGeolocation.on('location', location => {
          const entityId = useEntity.getState().entityId as string
          if (Platform.OS === 'ios') {
            BackgroundGeolocation.startTask(taskKey => {
              sendCurrentPosition(entityId, location)
              BackgroundGeolocation.endTask(taskKey)
            })
          } else {
            sendCurrentPosition(entityId, location)
          }
        })
      }, 60000)
    }

    return () => clearInterval(refreshId.current)
  }, [isMobileTracking])

  useEffect(() => {
    InitializeTrackingService()

    return () => {
      StopTrackingService()
    }
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

  // useEffect(() => {
  //   if (activeFormations?.length > 0) {
  //     scanIcon = Icons.qr
  //     scanNavigateTo = () => navigation.navigate(Screens.QRScanner)
  //   } else {
  //     scanIcon = Icons.formations
  //     scanNavigateTo = () => navigation.navigate('Formations')
  //   }
  // }, [activeFormations])

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
