import React, {useEffect, useState} from 'react'
import {Image, StyleSheet} from 'react-native'
import {Box, HStack, VStack, Text, Button} from 'native-base'
import {Images} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {formatNumber} from '@bluecentury/constants'
import {useTranslation} from 'react-i18next'

interface Props {
  buttonSelected: (selected: string) => void
  maxDraught: string | number | undefined
  draughtValues: any
  tonnage: number | string
  active?: number
  averageDraught?: any
}

export default ({
  buttonSelected,
  maxDraught,
  draughtValues,
  tonnage,
  active,
  averageDraught,
}: Props) => {
  const {t} = useTranslation()

  // console.log('draughtValues', draughtValues)

  const leftObject = [
    {
      label: 'BBV',
    },
    {
      label: 'BBM',
    },
    {
      label: 'BBA',
    },
  ]

  const rightObject = [
    {
      label: 'SBV',
    },
    {
      label: 'SBM',
    },
    {
      label: 'SBA',
    },
  ]

  const renderItems = (itemObjects: any[], key: string) => {
    return itemObjects.map((item, index) => {
      return (
        <Button
          key={`${key}-${index}`}
          // backgroundColor={item?.didUpdate ? Colors.azure : 'transparent'}
          backgroundColor={
            draughtValues[item.label]?.didUpdate ? Colors.azure : 'transparent'
          }
          disabled={active === 1}
          onPress={() => buttonSelected(item.label)}
        >
          <Text color={Colors.white} textAlign={'left'}>
            {draughtValues[item.label]?.draughtValue}
          </Text>
          <Text color={Colors.white} textAlign={'left'}>
            {item.label}
          </Text>
        </Button>
      )
    })
  }

  return (
    <Box backgroundColor={Colors.black} width={'100%'}>
      <HStack justifyContent={'space-evenly'} space={ms(5)}>
        <VStack flex={1} justifyContent={'space-evenly'} padding={ms(5)}>
          {renderItems(leftObject, 'left')}
        </VStack>
        <Image source={Images.ship} />
        <VStack flex={1} justifyContent={'space-evenly'} padding={ms(5)}>
          {renderItems(rightObject, 'right')}
        </VStack>
      </HStack>
      <HStack justifyContent={'space-evenly'} space={ms(5)}>
        <VStack alignItems={'center'} justifyItems={'center'} py={ms(10)}>
          <Text color={Colors.white}>{t('averageDraught')}</Text>
          <Text color={Colors.white}>
            {formatNumber(averageDraught, 2, ' ')}
          </Text>
        </VStack>
        <VStack alignItems={'center'} justifyItems={'center'} py={ms(10)}>
          <Text color={Colors.white}>Nu geladen</Text>
          <Text color={Colors.white}>
            {tonnage ? formatNumber(tonnage, 2, ' ') : 0} t
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}
