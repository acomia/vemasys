import React, {useState} from 'react'
import {Box, Text, Divider, Select, HStack, Button} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {BeforeAfterComponent, Ship} from './component'
import {useTranslation} from 'react-i18next'
import {PageScroll} from '@bluecentury/components'

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
        <HStack>
          <Text color={Colors.disabled}>Select measurement </Text>
          <Text color={Colors.danger}>*</Text>
        </HStack>
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
      <Box>
        <Ship />
      </Box>
      <HStack mt={ms(10)} space={ms(5)}>
        <Button colorScheme={'white'} flex={1}>
          <Text color={Colors.disabled}>End loading</Text>
        </Button>
        <Button flex={1}>
          <Text>Save</Text>
        </Button>
      </HStack>
    </PageScroll>
  )
}
