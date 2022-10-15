import React, {useEffect, useState} from 'react'
import {Box, HStack, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useNavigation} from '@react-navigation/native'

import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {
  calculateTotalIn,
  calculateTotalOut,
  formatLocationLabel,
} from '@bluecentury/constants'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {LoadingAnimated, NavigationLogType} from '@bluecentury/components'

const HistoryLogbook = ({routeIndex}: any) => {
  const navigation = useNavigation()
  const {
    isPlanningLoading,
    historyNavigationLogs,
    getVesselHistoryNavLogs,
  }: any = usePlanning()
  const {vesselId} = useEntity()
  const [currentPage, setCurrentPage] = useState(1)
  const [isPageChange, setIsPageChange] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    getVesselHistoryNavLogs(vesselId, currentPage)
  }, [vesselId, currentPage])

  useEffect(() => {
    setIsPageChange(false)
    setIsRefreshing(false)
  }, [historyNavigationLogs])

  historyNavigationLogs.sort(
    (a: any, b: any) =>
      moment(a.arrivalDatetime || a.plannedEta || a.arrivalZoneTwo).valueOf() -
      moment(b.arrivalDatetime || b.plannedEta || b.arrivalZoneTwo).valueOf()
  )
  historyNavigationLogs.reverse()

  const timeframeToLabel = (
    planned: any,
    bookedETA: any,
    start: any,
    end: any,
    current: any,
    cargoType: any,
    mode: any
  ) => {
    planned = planned ? moment(planned) : null
    bookedETA = bookedETA ? moment(bookedETA) : null
    start = start ? moment(start) : null
    end = end ? moment(end) : null
    current = current ? moment(current) : null

    if (start) {
      if (end) {
        if (
          start.isSame(end, 'day') &&
          start.format('hh:mm ') == end.format('hh:mm A')
        ) {
          if (mode === 1 && current && current.isSame(start, 'day')) {
            return `${start.format('hh:mm A')}`
          } else {
            return `${start.format('DD/MM/YYYY hh:mm A')}`
          }
        } else {
          const currentStartAndEndDayAreEqual =
            current &&
            current.isSame(start, 'day') &&
            current.isSame(end, 'day')
          if (mode === 0 && currentStartAndEndDayAreEqual) {
            return `${start.format('DD/MM/YYYY hh:mm A')} - ${end.format(
              'hh:mm A'
            )}`
          } else if (mode === 1 && currentStartAndEndDayAreEqual) {
            return `${start.format('hh:mm A')} - ${end.format('hh:mm A')}`
          } else {
            return `${start.format('DD/MM/YYYY hh:mm A')} - ${end.format(
              'DD/MM/YYYY hh:mm A'
            )}`
          }
        }
      } else {
        if (mode === 1 && current && current.isSame(start, 'day')) {
          return `${start.format('hh:mm A')} - Present`
        } else {
          return `${start.format('DD/MM/YYYY hh:mm A')} - Present`
        }
      }
    }

    if (cargoType === 'liquid_bulk') {
      if (bookedETA) {
        return `Laycan: ${bookedETA.format('DD/MM/YYYY')}`
      }

      return false
    }

    if (planned) {
      if (mode === 1 && current && current.isSame(planned, 'day')) {
        return `Planned: ${moment(planned).format('DD MMM YYYY | hh:mm A')}`
      } else {
        return `Planned: ${moment(planned).format('DD MMM YYYY | hh:mm A')}`
      }
    }

    return 'No date'
  }

  const NavLogCard = ({navigationLog, currentDate, dateChanged}: any) => {
    const itemDurationLabel = timeframeToLabel(
      navigationLog?.plannedEta ? navigationLog?.plannedEta : null,
      navigationLog?.bookedETA ? navigationLog?.bookedETA : null,
      navigationLog?.arrivalDatetime ? navigationLog?.arrivalDatetime : null,
      navigationLog?.departureDatetime
        ? navigationLog?.departureDatetime
        : null,
      currentDate,
      navigationLog?.cargoType,
      routeIndex
    )

    return (
      <Box key={navigationLog.id}>
        {dateChanged && (
          <Box
            key={`${navigationLog.id}-date`}
            borderBottomWidth={1}
            borderBottomColor={Colors.light}
            borderBottomStyle={'solid'}
            mb={ms(15)}
          >
            <Text fontWeight="bold" fontSize={ms(16)} mb={ms(5)}>
              {moment(currentDate).format('D MMM YYYY')}
            </Text>
          </Box>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{marginBottom: 14}}
          onPress={() =>
            navigation.navigate('PlanningDetails', {
              navlog: navigationLog,
              title: formatLocationLabel(navigationLog?.location),
            })
          }
        >
          <Box borderRadius={ms(5)} overflow="hidden">
            {/* Navlog Header */}
            <Box
              backgroundColor={
                navigationLog.isActive ? Colors.secondary : Colors.border
              }
              px={ms(16)}
              py={ms(10)}
            >
              <Text
                color={navigationLog.isActive ? Colors.white : Colors.text}
                fontSize={ms(15)}
                fontWeight="bold"
              >
                {formatLocationLabel(navigationLog?.location)}
              </Text>
              <Text
                color={navigationLog.isActive ? Colors.white : '#23475C'}
                fontWeight="medium"
              >
                {itemDurationLabel}
              </Text>
            </Box>
            {/* End of Header */}
            {navigationLog.bulkCargo.length < 1 ? null : (
              <Box
                px={ms(16)}
                py={ms(5)}
                pt={3}
                borderWidth={3}
                borderColor={Colors.border}
                borderStyle="dashed"
                mt={-3}
              >
                <HStack alignItems="center" my={ms(5)}>
                  <Box flex="1">
                    {navigationLog?.bulkCargo &&
                      navigationLog?.bulkCargo.length > 0 && (
                        <Box>
                          {navigationLog?.bulkCargo.map(
                            (cargo: any, i: number) => {
                              return (
                                <Text
                                  key={i}
                                  color={Colors.highlighted_text}
                                  fontWeight="bold"
                                >
                                  {`${Math.ceil(cargo.tonnage)} MT - ${
                                    cargo.type ? cargo.type.nameEn : 'Unknown'
                                  }  `}
                                  <Image
                                    alt="navlogs-tags"
                                    source={Icons.tags}
                                    mx={ms(5)}
                                    resizeMode="contain"
                                  />
                                </Text>
                              )
                            }
                          )}
                        </Box>
                      )}
                    <HStack alignItems="center" mt={ms(5)}>
                      <Text color={Colors.highlighted_text} fontWeight="bold">
                        {calculateTotalOut(navigationLog)} MT
                      </Text>
                      <Image
                        alt="triple-arrow-navlogs"
                        source={Icons.triple_arrow}
                        mx={ms(5)}
                        resizeMode="contain"
                      />
                      <Text color={Colors.highlighted_text} fontWeight="bold">
                        {calculateTotalIn(navigationLog)} MT
                      </Text>
                    </HStack>
                  </Box>
                  <NavigationLogType navigationLog={navigationLog} />
                </HStack>
              </Box>
            )}
          </Box>
        </TouchableOpacity>
      </Box>
    )
  }

  const shouldLoadNextPage = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 50
  }

  const loadNextPage = () => {
    setIsPageChange(true)
    setCurrentPage(currentPage + 1)
  }

  const onPullRefresh = () => {
    setIsRefreshing(true)
    setCurrentPage(1)
    getVesselHistoryNavLogs(vesselId, 1)
  }

  if (isPlanningLoading && !isPageChange) return <LoadingAnimated />

  return (
    <Box flex="1" bg={Colors.white}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        onScroll={({nativeEvent}) => {
          if (shouldLoadNextPage(nativeEvent)) {
            loadNextPage()
          }
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl onRefresh={onPullRefresh} refreshing={isRefreshing} />
        }
        pointerEvents={isPageChange ? 'none' : 'auto'}
        px={ms(12)}
        py={ms(15)}
      >
        {historyNavigationLogs.map((navigationLog: any, i: number) => {
          const previousNavigationLog =
            i > 0 ? historyNavigationLogs[i - 1] : null
          const previousDate = previousNavigationLog
            ? moment(
                previousNavigationLog.arrivalDatetime ||
                  previousNavigationLog.plannedEta ||
                  previousNavigationLog.arrivalZoneTwo
              )
            : null
          const currentDate =
            navigationLog.arrivalDatetime ||
            navigationLog.plannedEta ||
            navigationLog.arrivalZoneTwo

          const dateChanged =
            !previousDate || !previousDate.isSame(currentDate, 'day')

          return (
            <NavLogCard
              key={i}
              navigationLog={navigationLog}
              currentDate={currentDate}
              dateChanged={dateChanged}
            />
          )
        })}
      </ScrollView>
      {isPageChange && (
        <Box h={ms(30)} justifyContent="center" style={{zIndex: 999}}>
          <LoadingAnimated />
        </Box>
      )}
    </Box>
  )
}

export default HistoryLogbook
