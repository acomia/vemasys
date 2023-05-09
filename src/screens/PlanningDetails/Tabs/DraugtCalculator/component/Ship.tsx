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
  isFreeboard?: boolean
}

export default ({
  buttonSelected,
  maxDraught,
  draughtValues,
  tonnage,
  active,
  averageDraught,
  isFreeboard,
}: Props) => {
  const {t} = useTranslation()
  const leftObject = [
    {
      label: 'BBV',
      draughtValue: draughtValues?.BBV?.draughtValue,
      baseValue: draughtValues?.BBV?.value,
    },
    {
      label: 'BBM',
      draughtValue: draughtValues?.BBM?.draughtValue,
      baseValue: draughtValues?.BBM?.value,
    },
    {
      label: 'BBA',
      draughtValue: draughtValues?.BBA?.draughtValue,
      baseValue: draughtValues?.BBA?.value,
    },
  ]

  const rightObject = [
    {
      label: 'SBV',
      draughtValue: draughtValues?.SBV?.draughtValue,
      baseValue: draughtValues?.SBV?.value,
    },
    {
      label: 'SBM',
      draughtValue: draughtValues?.SBM?.draughtValue,
      baseValue: draughtValues?.SBM?.value,
    },
    {
      label: 'SBA',
      draughtValue: draughtValues?.SBA?.draughtValue,
      baseValue: draughtValues?.SBA?.value,
    },
  ]

  const renderItems = (itemObjects: any[], key: string) => {
    return itemObjects.map((item, index) => {
      return (
        <Button
          key={`${key}-${index}`}
          backgroundColor={'transparent'}
          disabled={active === 1}
          onPress={() => buttonSelected(item.label)}
        >
          <Text color={Colors.white} textAlign={'left'}>
            {isFreeboard && active === 1 ? item.draughtValue : item.baseValue}
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
        <VStack justifyContent={'space-evenly'}>
          {renderItems(leftObject, 'left')}
        </VStack>
        <Image source={Images.ship} />
        <VStack justifyContent={'space-evenly'}>
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
