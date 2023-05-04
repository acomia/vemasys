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
  maxDraught: string | undefined
  draughtValues: any
  tonnage: number
}

export default ({
  buttonSelected,
  maxDraught,
  draughtValues,
  tonnage,
}: Props) => {
  const {t} = useTranslation()
  const [avearageDraught, setAvearageDraught] = useState<number>(0)

  const leftObject = [
    {
      label: 'BBV',
      value:
        maxDraught && draughtValues?.BBV
          ? Math.abs(draughtValues?.BBV - maxDraught)
          : draughtValues?.BBV,
    },
    {
      label: 'BBM',
      value:
        maxDraught && draughtValues?.BBM
          ? Math.abs(draughtValues?.BBM - maxDraught)
          : draughtValues?.BBM,
    },
    {
      label: 'BBA',
      value:
        maxDraught && draughtValues?.BBA
          ? Math.abs(draughtValues?.BBA - maxDraught)
          : draughtValues?.BBA,
    },
  ]

  const rightObject = [
    {
      label: 'SBV',
      value:
        maxDraught && draughtValues?.SBV
          ? Math.abs(draughtValues?.SBV - maxDraught)
          : draughtValues?.SBV,
    },
    {
      label: 'SBM',
      value:
        maxDraught && draughtValues?.SBM
          ? Math.abs(draughtValues?.SBM - maxDraught)
          : draughtValues?.SBM,
    },
    {
      label: 'SBA',
      value:
        maxDraught && draughtValues?.SBA
          ? Math.abs(draughtValues?.SBA - maxDraught)
          : draughtValues?.SBA,
    },
  ]

  useEffect(() => {
    if (draughtValues) {
      const values = Object.values(draughtValues)
      const total = values.reduce(
        (acc, val) => parseInt(acc) + parseInt(val),
        0
      )
      const average = total / values.length
      setAvearageDraught(average)
    }
  }, [draughtValues])

  return (
    <Box backgroundColor={Colors.black} width={'100%'}>
      <HStack justifyContent={'space-evenly'} space={ms(5)}>
        <VStack justifyContent={'space-evenly'}>
          {leftObject.map((item, index) => {
            return (
              <Button
                key={`left-${index}`}
                backgroundColor={'transparent'}
                onPress={() => buttonSelected(item.label)}
              >
                <Text color={Colors.white} textAlign={'left'}>
                  {item.value}
                </Text>
                <Text color={Colors.white} textAlign={'left'}>
                  {item.label}
                </Text>
              </Button>
            )
          })}
        </VStack>
        <Image source={Images.ship} />
        <VStack justifyContent={'space-evenly'}>
          {rightObject.map((item, index) => {
            return (
              <Button
                key={`right-${index}`}
                backgroundColor={'transparent'}
                onPress={() => buttonSelected(item.label)}
              >
                <Text color={Colors.white} textAlign={'left'}>
                  {item.value}
                </Text>
                <Text color={Colors.white} textAlign={'left'}>
                  {item.label}
                </Text>
              </Button>
            )
          })}
        </VStack>
      </HStack>
      <HStack justifyContent={'space-evenly'} space={ms(5)}>
        <VStack alignItems={'center'} justifyItems={'center'} py={ms(10)}>
          <Text color={Colors.white}>{t('averageDraught')}</Text>
          <Text color={Colors.white}>
            {formatNumber(avearageDraught, 2, ' ')}
          </Text>
        </VStack>
        <VStack alignItems={'center'} justifyItems={'center'} py={ms(10)}>
          <Text color={Colors.white}>Nu geladen</Text>
          <Text color={Colors.white}>{formatNumber(tonnage, 2, ' ')} t</Text>
        </VStack>
      </HStack>
    </Box>
  )
}
