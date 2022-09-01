import React, {useEffect, useState} from 'react'
import {RefreshControl} from 'react-native'
import {Box, ScrollView, Text} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {
  VictoryLine,
  VictoryChart,
  VictoryZoomContainer,
  VictoryAxis
} from 'victory-native'
import moment from 'moment'
import {ms} from 'react-native-size-matters'

import {useInformation} from '@bluecentury/stores'
import {LoadingIndicator} from '@bluecentury/components'
import {Colors} from '@bluecentury/styles'

type Props = NativeStackScreenProps<RootStackParamList>
const InformationPegelDetails = ({navigation, route}: Props) => {
  const {pegelId} = route.params
  const {isInformationLoading, pegelDetails, getPegelDetails} = useInformation()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    getPegelDetails(pegelId)
  }, [])

  const getChartData = (history: any) => {
    const chartData = {
      axis: [
        {x: 0, y: 0},
        {x: 1, y: 1}
      ],
      initialZoomDomain: [0, 1]
    }

    if (!history || history.length === 0) {
      return null
    }

    let lowerBoundry: number | null = 0
    let upperBoundry: number | null = 0

    chartData.axis = history
      ? history.map(
          (
            measurement: {
              measureValue: number
              measureTime: string | number | Date
            },
            idx: any
          ) => {
            const y = Math.round(measurement.measureValue)
            if (null === lowerBoundry || y < lowerBoundry) {
              lowerBoundry = y
            }
            if (null === upperBoundry || y > upperBoundry) {
              upperBoundry = y
            }
            return {
              x: new Date(measurement.measureTime),
              y
            }
          }
        )
      : null

    if (chartData.axis) {
      const firstDataPoint = chartData.axis[0]
      const lastDataPoint = chartData.axis[chartData.axis.length - 1]
      chartData.initialZoomDomain =
        lastDataPoint && firstDataPoint
          ? {
              x: [
                moment.max(
                  moment(lastDataPoint.x).subtract(3, 'days'),
                  moment(firstDataPoint)
                ),
                moment(lastDataPoint.x)
              ],
              y: [lowerBoundry - 10, upperBoundry + 10]
            }
          : chartData.initialZoomDomain
    }

    return chartData
  }

  const setDimensions = (event: {
    nativeEvent: {
      layout: {
        width: React.SetStateAction<number>
        height: React.SetStateAction<number>
      }
    }
  }) => {
    setWidth(event.nativeEvent.layout.width)
    setHeight(event.nativeEvent.layout.height)
  }

  const chartData = getChartData(pegelDetails)

  const onPullRefresh = () => {
    getPegelDetails(pegelId)
  }

  if (isInformationLoading) return <LoadingIndicator />

  return (
    <Box flex="1" px={ms(12)} py={ms(15)} bg={Colors.white}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            onRefresh={onPullRefresh}
            refreshing={isInformationLoading}
          />
        }
        onLayout={setDimensions}
      >
        {chartData && typeof chartData === 'object' && !isInformationLoading ? (
          <VictoryChart
            scale={{
              x: 'time'
            }}
            height={height}
            width={width}
            containerComponent={
              <VictoryZoomContainer
                zoomDimension="x"
                zoomDomain={chartData.initialZoomDomain}
              />
            }
          >
            <VictoryLine
              data={chartData.axis}
              style={{
                data: {
                  stroke: Colors.primary
                }
              }}
            />
            <VictoryAxis
              dependentAxis
              label="Water level (cm)"
              style={{
                axisLabel: {padding: 40}
              }}
            />
            <VictoryAxis label="Timestamp" />
          </VictoryChart>
        ) : !isInformationLoading && pegelDetails?.length === 0 ? (
          <Box flex="1" alignItems="center" mt={ms(20)}>
            <Text
              fontSize={ms(15)}
              fontWeight="medium"
              textAlign="center"
              color={Colors.azure}
            >
              Insufficient data to generate pegel information graph
            </Text>
          </Box>
        ) : null}
      </ScrollView>
    </Box>
  )
}

export default InformationPegelDetails
