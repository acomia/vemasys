import React, {useEffect, useState} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {Box, HStack, Progress, ScrollView, Text, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import {useNavigation} from '@react-navigation/native'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {formatNumber} from '@bluecentury/constants'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'

const Reservoirs = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {reservoirs, getVesselReservoirs} = useTechnical()
  const {physicalVesselId} = useEntity()
  const [pullRefresh, setPullRefresh] = useState(false)

  useEffect(() => {
    getVesselReservoirs(physicalVesselId)
  }, [physicalVesselId])

  const onPullRefresh = () => {
    setPullRefresh(true)
    getVesselReservoirs(physicalVesselId)
    setPullRefresh(false)
  }

  const calculateFillPct = reservoir => {
    const capacity = reservoir.capacity || 0
    const value = reservoir.lastMeasurement?.value || 0
    return (value / capacity) * 100 // Update the calculation
  }

  return (
    <Box flex="1">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={pullRefresh} onRefresh={onPullRefresh} />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          {t('waterTanks')}
        </Text>
        {reservoirs?.length > 0 ? (
          reservoirs?.map((reservoir, index) => {
            const {name, lastMeasurement, capacity} = reservoir
            const fillPct = calculateFillPct(reservoir)
            const value = lastMeasurement?.value ?? 0

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => {
                  useTechnical.setState({isTechnicalLoading: true})
                  navigation.navigate('Measurements', {
                    data: reservoir,
                    routeFrom: 'reservoir',
                  })
                }}
              >
                <Box
                  borderColor={Colors.border}
                  borderRadius={ms(5)}
                  borderWidth={1}
                  mt={ms(10)}
                >
                  {/* Reservoir Header */}
                  <HStack
                    alignItems="center"
                    backgroundColor={Colors.border}
                    px={ms(16)}
                    py={ms(10)}
                  >
                    <VStack flex="1">
                      <Text color={Colors.text} fontWeight="medium">
                        {name}:
                      </Text>
                      <Text color={Colors.azure}>
                        {moment(lastMeasurement?.date).fromNow()}
                      </Text>
                    </VStack>
                    <Text bold color={Colors.azure} fontSize={ms(16)}>
                      {formatNumber(value, 2, ' ')} L (
                      {isNaN(fillPct) || fillPct === Infinity
                        ? 0
                        : Math.floor(fillPct)}
                      %)
                    </Text>
                  </HStack>
                  <Box p={ms(15)}>
                    <Progress
                      colorScheme={
                        fillPct <= 25
                          ? 'danger'
                          : fillPct <= 50
                          ? 'warning'
                          : 'primary'
                      }
                      size="md"
                      value={isNaN(fillPct) ? 0 : Math.floor(fillPct)}
                    />
                  </Box>
                </Box>
              </TouchableOpacity>
            )
          })
        ) : (
          <LoadingAnimated />
        )}
      </ScrollView>
    </Box>
  )
}

export default Reservoirs
