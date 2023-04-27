import React from 'react'
import {Image, StyleSheet} from 'react-native'
import {Box, HStack, VStack, Text} from 'native-base'
import {Images} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'

export default () => {
  return (
    <Box backgroundColor={Colors.black} width={'100%'}>
      <HStack justifyContent={'space-evenly'} space={ms(5)}>
        <VStack justifyContent={'space-evenly'}>
          <Box>
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              BBV
            </Text>
          </Box>
          <Box>
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              BBM
            </Text>
          </Box>
          <Box>
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              BBA
            </Text>
          </Box>
        </VStack>
        <Image source={Images.ship} />
        <VStack justifyContent={'space-evenly'}>
          <Box>
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              SBV
            </Text>
          </Box>
          <Box>
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              SBM
            </Text>
          </Box>
          <Box>
            <Text color={Colors.white} textAlign={'left'}>
              {101.07}
            </Text>
            <Text color={Colors.white} textAlign={'left'}>
              SBA
            </Text>
          </Box>
        </VStack>
      </HStack>
      <VStack alignItems={'center'} justifyItems={'center'} py={ms(10)}>
        <Text color={Colors.white}>Nu geladen</Text>
        <Text color={Colors.white}>738.07 t</Text>
      </VStack>
    </Box>
  )
}
