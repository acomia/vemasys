/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import {Box, Button, Divider, Image, Text} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {Shadow} from 'react-native-shadow-2'
import {Images} from '@bluecentury/assets'

interface IUploadID {
  onProceed: () => void
}
export default function UploadID({onProceed}: IUploadID) {
  return (
    <Box bg={Colors.white} flex="1">
      <Box flex="1" p={ms(16)}>
        <Text
          bold
          color={Colors.primary}
          fontSize={ms(18)}
          my={ms(40)}
          textAlign="center"
        >
          Upload a copy of your valid ID
        </Text>
        <Shadow
          corners={['bottomLeft', 'bottomRight']}
          distance={5}
          sides={['bottom', 'right']}
          viewStyle={{width: '100%', borderRadius: 5}}
        >
          <Box
            borderColor={Colors.light}
            borderRadius={5}
            borderWidth={1}
            px={ms(14)}
            py={ms(10)}
          >
            <Text bold color={Colors.text} fontSize={16}>
              Identification Card
            </Text>
            <Divider bg={Colors.light} my={ms(10)} />
            <Image
              alt="selfie"
              borderRadius={10}
              h={200}
              mb={ms(10)}
              resizeMode="cover"
              source={Images.signup_sample_id}
              w="100%"
            />
          </Box>
        </Shadow>
        <Button
          _text={{
            fontWeight: 'bold',
            fontSize: 16,
            color: Colors.primary,
          }}
          bg={Colors.light}
          mt={ms(30)}
          size="md"
          onPress={onProceed}
        >
          Upload new
        </Button>
        <Button
          _text={{
            fontWeight: 'bold',
            fontSize: 16,
            color: Colors.primary,
          }}
          bg={Colors.light}
          mt={ms(15)}
          size="md"
          onPress={onProceed}
        >
          Open camera
        </Button>
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
            Next
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}
