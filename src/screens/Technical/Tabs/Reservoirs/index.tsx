import React, {useEffect} from 'react'
import {Box, HStack, Progress, ScrollView, Text, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {formatNumber} from '@bluecentury/constants'
import {useEntity, useTechnical} from '@bluecentury/stores'
import moment from 'moment'
import {LoadingIndicator} from '@bluecentury/components'

const Reservoirs = () => {
  const {
    isTechnicalLoading,
    reservoirs,
    lastWaterMeasurements,
    getVesselReservoirs
  } = useTechnical()
  const {physicalVesselId} = useEntity()

  useEffect(() => {
    getVesselReservoirs(physicalVesselId)
  }, [])

  if (isTechnicalLoading) return <LoadingIndicator />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
      >
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          Water Tanks
        </Text>
        {reservoirs?.map((reservoir, index) => {
          let fillPct = 0
          let value = 0
          let capacity = 0
          if (lastWaterMeasurements?.length > 0) {
            // console.log('lastM', lastWaterMeasurements[index], reservoir.id)
            value =
              typeof lastWaterMeasurements[index]?.value === 'undefined'
                ? 0
                : lastWaterMeasurements[index]?.value
            capacity = reservoir.capacity === null ? 0 : reservoir.capacity
            let used = capacity - value
            fillPct = (used / capacity) * 100 - 100
            fillPct = fillPct < 0 ? fillPct * -1 : fillPct
          }
          return (
            <Box
              key={index}
              borderRadius={ms(5)}
              borderWidth={1}
              borderColor={Colors.border}
              mt={ms(10)}
            >
              {/* Reservoir Header */}
              <HStack
                backgroundColor={Colors.border}
                px={ms(16)}
                py={ms(10)}
                alignItems="center"
              >
                <VStack flex="1">
                  <Text color={Colors.text} fontWeight="medium">
                    {reservoir.name}:
                  </Text>
                  <Text color={Colors.azure}>
                    {moment(lastWaterMeasurements[index]?.date).fromNow()}
                  </Text>
                </VStack>
                <Text color={Colors.azure} fontSize={ms(16)} fontWeight="bold">
                  {formatNumber(value, 0)} L (
                  {isNaN(fillPct) || fillPct === Infinity
                    ? 0
                    : Math.floor(fillPct)}
                  %)
                </Text>
              </HStack>
              <Box p={ms(15)}>
                <Progress
                  value={isNaN(fillPct) ? 0 : Math.floor(fillPct)}
                  size="md"
                  colorScheme={
                    fillPct <= 25
                      ? 'danger'
                      : fillPct <= 50
                      ? 'warning'
                      : 'primary'
                  }
                />
              </Box>
            </Box>
          )
        })}
      </ScrollView>
    </Box>
  )
}

export default Reservoirs
