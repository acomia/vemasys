import React, {useEffect, useRef} from 'react'
import {ActivityIndicator} from 'react-native'
import {Box, Center, Image} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {CommonActions} from '@react-navigation/native'
import {Images} from '@bluecentury/assets'
import {useAuth} from '@bluecentury/stores'

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>

export default function Splash({navigation}: Props) {
  const {token, logout} = useAuth()
  // uncomment below to logout user
  useEffect(() => {
    logout()
  }, [])

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
  }, [])

  return (
    <Box flex="1" justifyContent="center" safeArea>
      <Center>
        <Image alt="Company Logo" source={Images.logo} />
        <ActivityIndicator size="small" />
      </Center>
    </Box>
  )
}
