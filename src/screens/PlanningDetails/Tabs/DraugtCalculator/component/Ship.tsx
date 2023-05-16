import React from 'react'
import {Image} from 'react-native'
import {Box, HStack, VStack, Text, Button} from 'native-base'
import {Images} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {formatNumber} from '@bluecentury/constants'
import {useTranslation} from 'react-i18next'

interface Props {
  buttonSelected: (selected: string) => void
  draughtValues: any
  tonnage: number | string
  isBefore?: boolean
  averageDraught?: any
}

export default ({
  buttonSelected,
  draughtValues,
  tonnage,
  isBefore,
  averageDraught,
}: Props) => {
  const {t} = useTranslation()

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
          backgroundColor={'transparent'}
          justifyContent={key === 'left' ? 'flex-start' : 'flex-end'}
          width={'full'}
          onPress={() => buttonSelected(item.label)}
        >
          <Box
            bgColor={
              draughtValues[item.label]?.didUpdate
                ? Colors.azure
                : 'transparent'
            }
            borderColor={Colors.primary}
            borderWidth={draughtValues[item.label]?.didUpdate ? 1 : 0}
            width={ms(100)}
          >
            <Text
              backgroundColor={'blue'}
              color={Colors.white}
              fontSize={ms(20)}
              textAlign={key}
              width={'full'}
            >
              {draughtValues[item.label]?.draught}
            </Text>
          </Box>
          <Text color={Colors.white} textAlign={key}>
            {item.label}
          </Text>
        </Button>
      )
    })
  }

  return (
    <Box backgroundColor={Colors.black} flex={1}>
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
          <Text color={Colors.white} fontSize={ms(20)}>
            {t('averageDraught')}
          </Text>
          <Text color={Colors.white} fontSize={ms(20)}>
            {averageDraught && averageDraught > 0
              ? formatNumber(averageDraught, 2, ' ')
              : '0,00'}
          </Text>
        </VStack>
        <VStack alignItems={'center'} justifyItems={'center'} py={ms(10)}>
          <Text color={Colors.white} fontSize={ms(20)}>
            Nu geladen
          </Text>
          <Text color={Colors.white} fontSize={ms(20)}>
            {tonnage ? formatNumber(tonnage, 2, ' ') : '0,00'} t
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}
