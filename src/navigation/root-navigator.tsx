import React, {useEffect, useRef} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {Entity, Login, Splash} from '@bluecentury/screens'
import MainNavigator from './main-navigator'
import {useAuth} from '@bluecentury/stores'
import {CommonActions, useNavigation} from '@react-navigation/native'

const {Navigator, Screen} = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  const navigation = useNavigation()
  const {token} = useAuth()

  let timeout = useRef<any>()
  useEffect(() => {
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
  }, [token])

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
    </Navigator>
  )
}

export default RootNavigator
