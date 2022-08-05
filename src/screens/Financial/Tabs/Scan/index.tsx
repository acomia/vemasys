import React from 'react'
import {Box, Button, Image, Text} from 'native-base'
import {Animated} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'

const Scan = () => {
  return (
    <Box flex="1" bg={Colors.white} px={ms(12)} py={ms(20)}>
      <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
        Scan Invoice
      </Text>
      <Image
        alt="Financial-invoice-logo"
        source={Animated.invoice}
        style={{
          width: 224,
          height: 229,
          alignSelf: 'center'
        }}
        my={ms(20)}
        resizeMode="contain"
      />
      <Button bg={Colors.primary} size="md">
        Upload image
      </Button>
      <Text
        style={{
          fontSize: 16,
          color: '#ADADAD',
          fontWeight: '700',
          marginVertical: 30,
          textAlign: 'center'
        }}
      >
        or
      </Text>
      <Button
        bg={Colors.primary}
        size="md"
        // onPress={() => this.uploadDocument()}
      >
        Open camera
      </Button>
    </Box>
  )
}

export default Scan
