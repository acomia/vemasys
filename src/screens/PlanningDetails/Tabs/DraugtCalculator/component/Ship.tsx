import React from 'react'
import {Image, StyleSheet} from 'react-native'
import {Box, HStack, VStack, Text, Button} from 'native-base'
import {Images} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'

interface Props {
  buttonSelected: (selected: string) => void
  draught: StringOrNull
}

export default ({buttonSelected}: Props) => {
  return (
    <Box backgroundColor={Colors.black} width={'100%'}>
      <HStack justifyContent={'space-evenly'} space={ms(5)}>
        <VStack justifyContent={'space-evenly'}>
          <Button
            backgroundColor={'transparent'}
            onPress={() => buttonSelected('BBV')}
          >
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              BBV
            </Text>
          </Button>
          <Button
            backgroundColor={'transparent'}
            onPress={() => buttonSelected('BBM')}
          >
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              BBM
            </Text>
          </Button>
          <Button
            backgroundColor={'transparent'}
            onPress={() => buttonSelected('BBA')}
          >
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              BBA
            </Text>
          </Button>
        </VStack>
        <Image source={Images.ship} />
        <VStack justifyContent={'space-evenly'}>
          <Button
            backgroundColor={'transparent'}
            onPress={() => buttonSelected('SBV')}
          >
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              SBV
            </Text>
          </Button>
          <Button
            backgroundColor={'transparent'}
            onPress={() => buttonSelected('SBM')}
          >
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              SBM
            </Text>
          </Button>
          <Button
            backgroundColor={'transparent'}
            onPress={() => buttonSelected('SBA')}
          >
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              SBA
            </Text>
          </Button>
        </VStack>
      </HStack>
      <VStack alignItems={'center'} justifyItems={'center'} py={ms(10)}>
        <Text color={Colors.white}>Nu geladen</Text>
        <Text color={Colors.white}>738.07 t</Text>
      </VStack>
    </Box>
  )
}
