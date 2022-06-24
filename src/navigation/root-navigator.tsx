import React, {useRef, useEffect} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {CommonActions, useNavigation} from '@react-navigation/native'
import MainNavigator from './main-navigator'
import {GPSTracker} from '@bluecentury/components'
import {useAuth} from '@bluecentury/stores'
import {
  Login,
  Splash,
  Entity,
  QRScanner,
  Formations,
  CharterDetails,
  PDFView
} from '@bluecentury/screens'
import {Colors} from '@bluecentury/styles'

const {Navigator, Screen, Group} =
  createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const navigation = useNavigation()
  const {token} = useAuth()

  let timeout = useRef<any>()
  useEffect(() => {
    if (token) {
      timeout.current = setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'SelectEntity'}]
          })
        )
      }, 1500)
    } else {
      timeout.current = setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}]
          })
        )
      }, 1500)
    }

    return () => clearTimeout(timeout.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerStyle: {backgroundColor: Colors.light},
        headerTitleStyle: {fontSize: 16, fontWeight: 'bold'}
      }}
    >
      <Group>
        <Screen name="Splash" component={Splash} />
        <Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Screen
          name="SelectEntity"
          component={Entity}
          options={{
            title: 'Select your role',
            headerStyle: {backgroundColor: '#F0F0F0'}
          }}
        />
        <Screen
          name="Main"
          component={MainNavigator}
          options={{headerShown: false}}
        />
        <Screen
          name="QRScanner"
          component={QRScanner}
          options={{headerShown: false}}
        />
        <Screen
          name="Formations"
          component={Formations}
          options={{
            title: 'Active Formations',
            headerShown: true
          }}
        />
        <Screen
          name={'CharterDetails'}
          component={CharterDetails}
          options={{headerShown: true}}
        />
        <Screen
          name={'PDFView'}
          component={PDFView}
          options={{headerShown: true}}
        />
      </Group>
      <Group>
        <Screen
          name="GPSTracker"
          component={GPSTracker}
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom'
          }}
        />
      </Group>
    </Navigator>
  )
}
