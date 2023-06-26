import React from 'react'
import {Linking, TouchableOpacity} from 'react-native'
import {Box, Divider, HStack, Progress, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useNavigation} from '@react-navigation/native'

import {Colors} from '@bluecentury/styles'
import {PROD_URL} from '@vemasys/env'
import {formatNumber} from '@bluecentury/constants'
import {useTechnical} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'

// ---- Move this renderGasoilList function outside the component to prevent re-creation on each render.
const renderGasoilList = (reservoir: any, index: number, navigation: any) => {
  const gasoilListLength = reservoir.length - 1
  const capacity = reservoir?.capacity ?? 0
  const value = reservoir?.lastMeasurement?.value ?? 0
  const used = capacity - value
  let fillPct = (used / capacity) * 100 - 100
  fillPct = fillPct < 0 ? -fillPct : fillPct
  const formattedValue = formatNumber(value, 2, ' ')
  const fillPctFloor =
    Number.isNaN(fillPct) || fillPct === Infinity ? 0 : Math.floor(fillPct)
  const isLastIndex = index === gasoilListLength
  const momentDate = moment(reservoir?.lastMeasurement?.date)

  const handlePress = () => {
    navigation.navigate('Measurements', {
      data: reservoir,
      routeFrom: 'reservoir',
    })
  }

  return (
    <Box key={index} mb={ms(isLastIndex ? 10 : 0)}>
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        <Box px={ms(16)} py={ms(5)}>
          <HStack alignItems="center">
            <Text color={Colors.azure} flex="1" fontWeight="medium">
              {reservoir.name}
            </Text>
            <Text bold color={Colors.azure} fontSize={ms(16)}>
              {formattedValue} L ({fillPctFloor}%)
            </Text>
          </HStack>
          <Text color={Colors.disabled} flex="1" fontWeight="medium">
            {momentDate.fromNow()}
          </Text>
          <Progress
            colorScheme={
              fillPct <= 25 ? 'danger' : fillPct <= 50 ? 'warning' : 'primary'
            }
            mt={ms(10)}
            size="md"
            value={fillPctFloor}
          />
        </Box>
      </TouchableOpacity>
      {!isLastIndex && <Divider mt={ms(10)} />}
    </Box>
  )
}

const ReservoirLevel = ({reservoir, physicalVesselId}: any) => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {gasoilReserviors} = useTechnical()

  const totalGasoil = gasoilReserviors?.reduce(
    (acc: number, reservoir: {lastMeasurement: {value?: number}}) =>
      acc + (reservoir.lastMeasurement?.value ?? 0),
    0
  )

  return (
    <Box
      borderColor={Colors.border}
      borderRadius={ms(5)}
      borderWidth={1}
      mt={ms(10)}
    >
      {/* Total Gasoil Header */}
      <HStack
        alignItems="center"
        backgroundColor={Colors.border}
        px={ms(16)}
        py={ms(10)}
      >
        <Text color={Colors.azure} flex="1" fontWeight="medium">
          {t('totalGasoil')}
        </Text>
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          {formatNumber(totalGasoil, 2, ' ')} L
        </Text>
      </HStack>
      {reservoir.length > 0 ? (
        reservoir.map((reservoir: any, index: number) =>
          renderGasoilList(reservoir, index, navigation)
        )
      ) : (
        <Box px={ms(16)} py={ms(10)}>
          <Text color={Colors.azure} fontWeight="semibold" textAlign="justify">
            {t('manageGasoilInWebApp')}
            <Text
              color={Colors.highlighted_text}
              onPress={() => Linking.openURL(PROD_URL)}
            >
              {PROD_URL}!
            </Text>
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default ReservoirLevel
