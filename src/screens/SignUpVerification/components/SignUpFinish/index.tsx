import React, {useEffect} from 'react'
import {Box, Button, Image, Text} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'
import {useTranslation} from 'react-i18next'

import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {useNavigation} from '@react-navigation/native'

interface ISignUpFinish {
  email: string
  onProceed: () => void
}

export default function SignUpFinish({email, onProceed}: ISignUpFinish) {
  const {t} = useTranslation()
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])

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
            onPress={onProceed}
          >
            {t('backToLogin')}
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}
