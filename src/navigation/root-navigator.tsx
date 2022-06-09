import React, {useEffect, useRef} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Login, Splash} from '@bluecentury/screens'
import MainNavigator from './main-navigator'
import {useAuth} from '@bluecentury/stores'
import {CommonActions, useNavigation} from '@react-navigation/native'

const {Navigator, Screen} = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  const navigation = useNavigation()
  const {token} = useAuth()

  let timeout = useRef<any>()
  useEffect(() => {
    console.log('token ', token)

    if (token) {
      timeout.current = setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Main'}]
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
  }, [])

  return (
    <Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false
      }}>
      <Screen name="Splash" component={Splash} />
      <Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false
        }}
      />
      <Screen name="Main" component={MainNavigator} />
    </Navigator>
  )
}

export default RootNavigator
