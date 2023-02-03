import React from 'react'
import {Box, Button, Image, Text} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {Images} from '@bluecentury/assets'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<RootStackParamList>
export default function SignUpFinish({navigation}: Props) {
  return (
    <Box bg={Colors.white} flex="1">
      <Box flex="1" justifyContent="center" p={ms(16)}>
        <Image
          alt="selfie"
          h={200}
          mb={ms(10)}
          resizeMode="contain"
          source={Images.signup_pending}
          w="100%"
        />
        <Text
          bold
          color={Colors.primary}
          fontSize={ms(20)}
          my={ms(20)}
          textAlign="center"
        >
          Pending request
        </Text>
        <Text
          bold
          alignSelf="center"
          color={Colors.text}
          maxW={200}
          textAlign="center"
        >
          We will send a confirmation email once approved to
        </Text>
        <Text bold color={Colors.primary} textAlign="center">
          email@sample.com
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
            onPress={() => navigation.navigate('Login')}
          >
            Back to Login
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}
