import React, {useEffect} from 'react'
import {Box, Button, Image, Text} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'
import {useTranslation} from 'react-i18next'

import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {useAuth, useUser} from '@bluecentury/stores'

type Props = RouteProp<RootStackParamList, 'SignUpFinish'>

export default function SignUpFinish() {
  const {t} = useTranslation()
  const route = useRoute<Props>()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {email} = route.params
  const {resetData} = useUser()
  const {token, logout} = useAuth()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])

  useEffect(() => {
    if (!token) {
      navigation.navigate('Login')
    }
  }, [token])

  const onBackToLogin = () => {
    resetData()
    logout()
  }

  return (
    <Box bg={Colors.white} flex="1">
      <Box flex="1" justifyContent="center" p={ms(16)}>
        <Image
          alt="selfie"
          h={200}
          mb={ms(10)}
          resizeMode="contain"
          source={Icons.signup_pending}
          w="100%"
        />
        <Text
          bold
          color={Colors.primary}
          fontSize={ms(20)}
          my={ms(20)}
          textAlign="center"
        >
          {t('pendingRequest')}
        </Text>
        <Text
          bold
          alignSelf="center"
          color={Colors.text}
          maxW={200}
          textAlign="center"
        >
          {t('weWillSendEmail')}
        </Text>
        <Text bold color={Colors.primary} textAlign="center">
          {email}
        </Text>
      </Box>
      <Box bg={Colors.white}>
        <Shadow distance={8} viewStyle={{width: '100%'}}>
          <Button
            _text={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
            bg={Colors.primary}
            m={ms(16)}
            size="md"
            onPress={onBackToLogin}
          >
            {t('backToLogin')}
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}
