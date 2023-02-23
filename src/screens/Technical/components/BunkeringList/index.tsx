import React from 'react'
import {Box, HStack, Pressable, Text, VStack} from 'native-base'
import {useNavigation} from '@react-navigation/native'

import {Colors} from '@bluecentury/styles'
import moment from 'moment'
import {ms} from 'react-native-size-matters'
import {formatNumber} from '@bluecentury/constants'
import {useTranslation} from 'react-i18next'

const BunkeringList = ({bunkering}: any) => {
  const {t} = useTranslation()
  const navigation = useNavigation()

  const renderBunkeringList = (bunk: any, index: number) => {
    return (
      <Pressable
        key={index}
        onPress={() => navigation.navigate('BunkeringDetails', {bunk})}
      >
        <HStack
          alignItems="center"
          bg={Colors.white}
          borderColor={Colors.light}
          borderRadius={ms(5)}
          borderWidth={1}
          mt={ms(10)}
          p={ms(10)}
          shadow={2}
        >
          <VStack flex="1">
            <Text color={Colors.text} fontWeight="medium">
              {bunk.entity.alias}
            </Text>
            <Text color={Colors.disabled}>
              {moment(bunk.date).format('DD/MM/YYYY - HH:mm')}
            </Text>
          </VStack>
          <Text bold color={Colors.highlighted_text}>
            {formatNumber(bunk.value, 2, ' ')} L
          </Text>
        </HStack>
      </Pressable>
    )
  }

  return (
    <Box>
      <HStack alignItems="center">
        <Text bold color={Colors.text} flex="1" fontSize={ms(16)}>
          {t('details')}
        </Text>
        <Text bold color={Colors.text} fontSize={ms(16)}>
          {t('amount')}
        </Text>
      </HStack>
      {/* Bunkering List */}
      {bunkering?.length > 0 ? (
        bunkering?.map((bunk: any, index: number) =>
          renderBunkeringList(bunk, index)
        )
      ) : (
        <Box py={ms(10)}>
          <Text
            color={Colors.text}
            fontSize={ms(15)}
            fontWeight="semibold"
            textAlign="justify"
          >
            {t('noBunkeringItemsYet')}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default BunkeringList
