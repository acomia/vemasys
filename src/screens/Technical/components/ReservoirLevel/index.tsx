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

const ReservoirLevel = ({reservoir, physicalVesselId}: any) => {
  const navigation = useNavigation()
  const {gasoilReserviors} = useTechnical()

  const totalGasoil = gasoilReserviors?.reduce(
    (acc: any, reservoir: {volume: any}) =>
      acc +
      (reservoir?.lastMeasurement?.value
        ? reservoir?.lastMeasurement?.value
        : 0),
    0
  )

  const renderGasoilList = (reservoir: any, index: number) => {
    const gasoilListLength = reservoir.length - 1
    let fillPct = 0
    const capacity = reservoir?.capacity === null ? 0 : reservoir?.capacity
    const value =
      typeof reservoir?.lastMeasurement?.value === 'undefined'
        ? 0
        : reservoir?.lastMeasurement?.value
    const used = capacity - value
    fillPct = (used / capacity) * 100 - 100
    fillPct = fillPct < 0 ? fillPct * -1 : fillPct

    return (
      <Box key={index} mb={ms(index === gasoilListLength ? 10 : 0)}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('Measurements', {
              data: reservoir,
              routeFrom: 'reservoir'
            })
          }
        >
          <Box px={ms(16)} py={ms(5)}>
            <HStack alignItems="center">
              <Text flex={1} color={Colors.azure} fontWeight="medium">
                {reservoir.name}
              </Text>
              <Text color={Colors.azure} fontSize={ms(16)} fontWeight="bold">
                {formatNumber(value, 0)} L (
                {isNaN(fillPct) || fillPct === Infinity
                  ? 0
                  : Math.floor(fillPct)}
                %)
              </Text>
            </HStack>
            <Text flex={1} color={Colors.disabled} fontWeight="medium">
              {moment(reservoir?.lastMeasurement?.date).fromNow()}
            </Text>
            <Progress
              value={isNaN(fillPct) ? 0 : Math.floor(fillPct)}
              mt={ms(10)}
              size="md"
              colorScheme={
                fillPct <= 25 ? 'danger' : fillPct <= 50 ? 'warning' : 'primary'
              }
            />
          </Box>
        </TouchableOpacity>
        {index === gasoilListLength ? null : <Divider mt={ms(10)} />}
      </Box>
    )
  }

  return (
    <Box
      borderRadius={ms(5)}
      borderWidth={1}
      borderColor={Colors.border}
      mt={ms(10)}
    >
      {/* Total Gasoil Header */}
      <HStack
        backgroundColor={Colors.border}
        px={ms(16)}
        py={ms(10)}
        alignItems="center"
      >
        <Text flex={1} color={Colors.azure} fontWeight="medium">
          Total gasoil
        </Text>
        <Text color={Colors.azure} fontSize={ms(20)} fontWeight="bold">
          {formatNumber(totalGasoil, 0)} L
        </Text>
      </HStack>
      {reservoir.length > 0 ? (
        reservoir.map((reservoir: any, index: number) =>
          renderGasoilList(reservoir, index)
        )
      ) : (
        <Box px={ms(16)} py={ms(10)}>
          <Text color={Colors.azure} fontWeight="semibold" textAlign="justify">
            You can manage your gasoil reservoirs in the technical module of the
            web app at &nbsp;
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
