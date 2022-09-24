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
  const {hasSettingsRehydrated, apiUrl, setEnv} = useSettings(state => state)
  useEffect(() => {
    if (hasSettingsRehydrated) {
      console.log('apiUrl ', apiUrl)
      if (typeof apiUrl === 'undefined') {
        console.log('setting default env to PROD')
        setEnv('PROD')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSettingsRehydrated])
  useEffect(() => {
    if (hasAuthHydrated && hasEntityHydrated) {
      // non-authenticated
      if (typeof token === 'undefined') {
        navigation.navigate('Login')
        return
      }

      // no entity selected
      if (typeof entityId === 'undefined') {
        navigation.navigate('SelectEntity')
        return
      }

      // authenticted and has entity selected
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}]
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAuthHydrated, hasEntityHydrated, token, entityId])

  return (
    <Box flex="1" justifyContent="center" safeArea>
      <Center>
        <Image alt="Company Logo" source={Images.logo} />
        <ActivityIndicator size="small" />
      </Center>
    </Box>
  )
}
