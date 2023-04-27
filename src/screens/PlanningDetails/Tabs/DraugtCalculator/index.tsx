import React, {useState} from 'react'
import {Image} from 'react-native'
import {Box, Text, Divider, Select} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {BeforeAfterComponent} from './component'
import {useTranslation} from 'react-i18next'
import {PageScroll} from '@bluecentury/components'
import {Images} from '@bluecentury/assets'

interface Props {
  navLog: any[]
}

export default (props: Props) => {
  const {t} = useTranslation()
  const [statusActive, setStatusActive] = useState(1)
  const [refreshing, setRefreshing] = useState(false)

  const measurements = [
    {value: 'freeboard', label: t('freeboardMeasurement')},
    {value: 'draught', label: t('draughtMeasurement')},
  ]

  return (
    // <Box flex={1} px={ms(12)}>
    <PageScroll refreshing={refreshing}>
      <Text bold color={Colors.azure} fontSize={ms(20)}>
        Draught Calculator
      </Text>
      <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
      <BeforeAfterComponent active={statusActive} setActive={setStatusActive} />
      <Box py={ms(10)}>
        <Select
          accessibilityLabel=""
          bg={Colors.light_grey}
          fontSize={ms(16)}
          fontWeight="medium"
          minWidth="300"
          placeholder=""
        >
          {measurements.map((measurement, index) => {
            return (
              <Select.Item
                key={index}
                label={measurement.label}
                value={measurement.value}
              />
            )
          })}
        </Select>
      </Box>
      <Box backgroundColor={Colors.black} height={ms(500)} width={'100%'}>
        <Image
          resizeMode="contain"
          source={Images.ship}
          style={{width: '100%', height: '100%'}}
        />
      </Box>
    </PageScroll>
  )
}
