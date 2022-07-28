import React, {useEffect} from 'react'
import {ActivityIndicator} from 'react-native'
import {Box, Center, Image} from 'native-base'
import {Images} from '@bluecentury/assets'
import {useAuth, useEntity} from '@bluecentury/stores'
import {CommonActions, useNavigation} from '@react-navigation/native'

export default function Splash() {
  const navigation = useNavigation()
  const token = useAuth(state => state.token)
  const entityId = useEntity(state => state.entityId)

  useEffect(() => {
    if (token && entityId) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}]
        })
      )
    } else if (token) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'SelectEntity'}]
        })
      )
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}]
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, entityId])

  return (
    <Box flex="1" justifyContent="center" safeArea>
      <Center>
        <Image alt="Company Logo" source={Images.logo} />
        <ActivityIndicator size="small" />
      </Center>
    </Box>
  )
}
