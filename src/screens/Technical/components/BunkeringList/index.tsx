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
          p={ms(10)}
          borderWidth={1}
          borderColor={Colors.light}
          borderRadius={ms(5)}
          alignItems="center"
          mt={ms(10)}
          bg={Colors.white}
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
          <Text color={Colors.highlighted_text} bold>
            {formatNumber(bunk.value, 0, ' ')} L
          </Text>
        </HStack>
      </Pressable>
    )
  }

  return (
    <Box>
      <HStack alignItems="center">
        <Text flex="1" color={Colors.text} fontSize={ms(16)} bold>
          {t('details')}
        </Text>
        <Text color={Colors.text} fontSize={ms(16)} bold>
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
            fontWeight="semibold"
            fontSize={ms(15)}
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
