import React from 'react'
import {Box, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {Linking} from 'react-native'
import {PROD_URL} from '@bluecentury/env'

const CargoHolds = () => {
  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
      >
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          Cargo Hold
        </Text>
        <Box
          borderRadius={ms(5)}
          bg={Colors.white}
          shadow={1}
          py={ms(12)}
          px={ms(15)}
          mt={ms(15)}
        >
          <Text fontWeight="medium" color={Colors.azure}>
            No cargo hold configured for this vessel
          </Text>
          <Text fontSize={ms(13)} color={Colors.azure} mt={ms(10)}>
            You can manage your cargo hold in the technical module of the web
            app at &nbsp;
            <Text
              color={Colors.highlighted_text}
              onPress={() => Linking.openURL(PROD_URL)}
            >
              {PROD_URL}!
            </Text>
          </Text>
        </Box>
      </ScrollView>
    </Box>
  )
}

export default CargoHolds
