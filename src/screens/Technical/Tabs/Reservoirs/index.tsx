import React, {useEffect} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {Box, HStack, Progress, ScrollView, Text, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {formatNumber} from '@bluecentury/constants'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {LoadingIndicator} from '@bluecentury/components'

const Reservoirs = () => {
  const navigation = useNavigation()
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

  const onPullRefresh = () => {
    getVesselReservoirs(physicalVesselId)
  }

  if (isTechnicalLoading) return <LoadingIndicator />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            onRefresh={onPullRefresh}
            refreshing={isTechnicalLoading}
          />
        }
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
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Measurements', {
                  data: reservoir,
                  routeFrom: 'reservoir'
                })
              }
            >
              <Box
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
                  <Text
                    color={Colors.azure}
                    fontSize={ms(16)}
                    fontWeight="bold"
                  >
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
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </Box>
  )
}

export default Reservoirs
