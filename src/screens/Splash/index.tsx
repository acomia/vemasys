import React, {useEffect} from 'react'
import {ActivityIndicator} from 'react-native'
import {Box, Center, Image} from 'native-base'
import {Images} from '@bluecentury/assets'
import {useAuth, useEntity, useSettings} from '@bluecentury/stores'
// import {} from '@bluecentury/utils'
import {
  CommonActions,
  NavigationProp,
  useNavigation
} from '@react-navigation/native'

export default function Splash() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {hasAuthHydrated, token} = useAuth(state => state)
  const {hasEntityHydrated, entityId} = useEntity(state => state)
  const {hasSettingsRehydrated, apiUrl} = useSettings(state => state)

  useEffect(() => {
    if (hasAuthHydrated && hasEntityHydrated && hasSettingsRehydrated) {
      if (typeof apiUrl === 'undefined') {
        navigation.navigate('SelectEnvironment')
      } else {
        if (token && entityId) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Main'}]
            })
          )
        } else if (token) {
          navigation.navigate('SelectEntity')
        } else {
          navigation.navigate('Login')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasAuthHydrated,
    hasEntityHydrated,
    hasSettingsRehydrated,
    token,
    entityId
  ])

  return (
    <Box flex="1" justifyContent="center" safeArea>
      <Center>
        <Image alt="Company Logo" source={Images.logo} />
        <ActivityIndicator size="small" />
      </Center>
    </Box>
  )
}
