import React from 'react'
import {Box, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {Linking} from 'react-native'
import {PROD_URL} from '@vemasys/env'
import {useTranslation} from 'react-i18next'

const CargoHolds = () => {
  const {t} = useTranslation()
  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
      >
        <Text fontSize={ms(20)} bold color={Colors.azure}>
          {t('cargoHold')}
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
            {t('noCargoHold')}
          </Text>
          <Text fontSize={ms(13)} color={Colors.azure} mt={ms(10)}>
            {t('manageCargoInWeb')}
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
