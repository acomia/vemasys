import React, {useEffect, useState} from 'react'
import {Box, Divider, HStack, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import _ from 'lodash'
import {useNavigation} from '@react-navigation/native'

import {useEntity, useTechnical} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {LoadingIndicator} from '@bluecentury/components'
import {formatNumber} from '@bluecentury/constants'
import {RefreshControl, TouchableOpacity} from 'react-native'

const Engines = () => {
  const navigation = useNavigation()
  const {isTechnicalLoading, engines, getVesselEngines} = useTechnical()
  const {physicalVesselId} = useEntity()
  const [pullRefresh, setPullRefresh] = useState(false)

  useEffect(() => {
    getVesselEngines(physicalVesselId)
  }, [])

  // const vesselZones = _.uniq(_.map(engines, 'vesselZone.title'))
  // const partTypes = _.uniq(_.map(engines, 'type.title'))
  let vesselZones = Object.values(
    engines.reduce((acc: any, item) => {
      const zones = item.vesselZone.title
      if (!acc[zones])
        acc[zones] = {
          zones: zones,
          data: []
        }
      acc[zones].data.push(item)
      return acc
    }, {})
  )

  const renderEngineList = (partType: any, index: number) => {
    const pLength = partType.data.length - 1

    return (
      <Box key={index} mb={ms(index === vesselZones.data?.length - 1 ? 10 : 0)}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('Measurements', {
              data: partType,
              routeFrom: 'engine'
            })
          }
        >
          <Box px={ms(12)} py={ms(5)}>
            <HStack alignItems="center" justifyContent="space-around">
              <Box width="40%">
                <Text color={Colors.text} fontWeight="medium">
                  {partType.data[pLength].type.title}
                </Text>
                <Text color={Colors.disabled}>
                  {partType.data[pLength].lastMeasurement
                    ? moment(
                        partType.data[pLength].lastMeasurement.date
                      ).format('DD/MM/YYYY')
                    : 'Loading...'}
                </Text>
              </Box>
              <Text
                flex="1"
                color={Colors.azure}
                fontSize={ms(15)}
                fontWeight="bold"
              >
                {partType.data[pLength].lastMeasurement
                  ? `${formatNumber(
                      partType.data[pLength].lastMeasurement.value,
                      0
                    )}h`
                  : 'Loading...'}
              </Text>
              <Box
                flex="1"
                py={ms(2)}
                px={ms(10)}
                borderRadius={ms(20)}
                bg={Colors.highlighted_text}
              >
                <Text color={Colors.white} fontSize={ms(11)} textAlign="center">
                  {partType.part}
                </Text>
              </Box>
            </HStack>
          </Box>
        </TouchableOpacity>
        {index === vesselZones.data?.length - 1 ? null : (
          <Divider mt={ms(10)} />
        )}
      </Box>
    )
  }

  const onPullToReload = () => {
    setPullRefresh(true)
    getVesselEngines(physicalVesselId)
    setPullRefresh(false)
  }

  if (isTechnicalLoading) return <LoadingIndicator />

  return (
    <Box flex="1" bg={Colors.white}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        px={ms(12)}
        py={ms(20)}
        refreshControl={
          <RefreshControl onRefresh={onPullToReload} refreshing={pullRefresh} />
        }
      >
        <Text
          color={Colors.azure}
          fontSize={ms(20)}
          fontWeight="bold"
          mb={ms(15)}
        >
          Engines
        </Text>
        {vesselZones.length > 0 ? (
          vesselZones.map((engine: any, index: number) => {
            const groupByPart = Object.values(
              engine.data.reduce((acc: any, item) => {
                const part = item.name
                if (!acc[part])
                  acc[part] = {
                    part: part,
                    data: []
                  }
                acc[part].data.push(item)
                return acc
              }, {})
            )
            return (
              <Box
                key={index}
                borderRadius={ms(5)}
                borderWidth={1}
                borderColor={Colors.border}
                mb={ms(25)}
              >
                {/* Engine Header */}
                <Box
                  backgroundColor={Colors.border}
                  px={ms(16)}
                  py={ms(10)}
                  justifyContent="center"
                >
                  <Text color={Colors.azure} fontWeight="medium">
                    {_.startCase(_.toLower(engine.zones))}
                  </Text>
                </Box>

                {groupByPart.map((partType: any, index: number) =>
                  renderEngineList(partType, index)
                )}
              </Box>
            )
          })
        ) : (
          <Text
            color={Colors.text}
            fontWeight="semibold"
            fontSize={ms(15)}
            textAlign="center"
            mt={ms(20)}
          >
            No available data.
          </Text>
        )}
      </ScrollView>
    </Box>
  )
}

export default Engines
