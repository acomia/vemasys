import React, {useEffect, useState} from 'react'
import {Box, Center, HStack, Image, ScrollView, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'

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
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {
    isPlanningLoading,
    historyNavigationLogs,
    hasErrorLoadingVesselHistoryNavLogs,
  } = usePlanning()
  const getVesselHistoryNavLogs = usePlanning.getState().getVesselHistoryNavLogs
  const vesselId = useEntity(state => state.vesselId)
  const [currentPage, setCurrentPage] = useState(1)
  const [isPageChange, setIsPageChange] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (vesselId) {
      getVesselHistoryNavLogs(vesselId, currentPage)
    }
  }, [vesselId, currentPage, getVesselHistoryNavLogs])

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
            return `${start.format('HH:mm')}`
          } else {
            return `${start.format('DD/MM/YYYY HH:mm')}`
          }
        } else {
          const currentStartAndEndDayAreEqual =
            current &&
            current.isSame(start, 'day') &&
            current.isSame(end, 'day')
          if (mode === 0 && currentStartAndEndDayAreEqual) {
            return `${start.format('DD/MM/YYYY HH:mm')} - ${end.format(
              'HH:mm'
            )}`
          } else if (mode === 1 && currentStartAndEndDayAreEqual) {
            return `${start.format('HH:mm')} - ${end.format('HH:mm')}`
          } else {
            return `${start.format('DD/MM/YYYY HH:mm')} - ${end.format(
              'DD/MM/YYYY HH:mm'
            )}`
          }
        }
      } else {
        if (mode === 1 && current && current.isSame(start, 'day')) {
          return `${start.format('HH:mm')} - Present`
        } else {
          return `${start.format('DD/MM/YYYY HH:mm')} - Present`
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
        return `Planned: ${moment(planned).format('DD MMM YYYY | HH:mm')}`
      } else {
        return `Planned: ${moment(planned).format('DD MMM YYYY | HH:mm')}`
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
            borderBottomColor={Colors.light}
            borderBottomStyle={'solid'}
            borderBottomWidth={1}
            mb={ms(15)}
          >
            <Text bold fontSize={ms(16)} mb={ms(5)}>
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
                bold
                color={navigationLog.isActive ? Colors.white : Colors.text}
                fontSize={ms(15)}
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
                borderColor={Colors.border}
                borderStyle="dashed"
                borderWidth={3}
                mt={-3}
                pt={3}
                px={ms(16)}
                py={ms(5)}
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
                                  bold
                                  color={Colors.highlighted_text}
                                >
                                  {`${Math.ceil(cargo.tonnage)} MT - ${
                                    cargo.type
                                      ? cargo.type.nameEn || cargo.type.nameNl
                                      : t('unknown')
                                  }  `}
                                  <Image
                                    alt="navlogs-tags"
                                    mx={ms(5)}
                                    resizeMode="contain"
                                    source={Icons.tags}
                                  />
                                </Text>
                              )
                            }
                          )}
                        </Box>
                      )}
                    <HStack alignItems="center" mt={ms(5)}>
                      <Text bold color={Colors.highlighted_text}>
                        {calculateTotalOut(navigationLog)} MT
                      </Text>
                      <Image
                        alt="triple-arrow-navlogs"
                        mx={ms(5)}
                        resizeMode="contain"
                        source={Icons.triple_arrow}
                      />
                      <Text bold color={Colors.highlighted_text}>
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
    if (vesselId) {
      getVesselHistoryNavLogs(vesselId, 1)
    }
  }

  if (isPlanningLoading && !isPageChange) return <LoadingAnimated />

  return (
    <Box bg={Colors.white} flex="1">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onPullRefresh} />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        pointerEvents={isPageChange ? 'none' : 'auto'}
        px={ms(12)}
        py={ms(15)}
        scrollEventThrottle={16}
        onScroll={({nativeEvent}) => {
          if (shouldLoadNextPage(nativeEvent)) {
            loadNextPage()
          }
        }}
      >
        {hasErrorLoadingVesselHistoryNavLogs ? (
          <Box bgColor={Colors.white} flex="1" p="5">
            <Center>
              <Text>Failed to load the requested resource.</Text>
            </Center>
          </Box>
        ) : historyNavigationLogs.length == 0 ? (
          <Box bgColor={Colors.white} flex="1" p="2">
            <Center>
              <Text bold color={Colors.azure}>
                No results available
              </Text>
            </Center>
          </Box>
        ) : (
          historyNavigationLogs.map((navigationLog: any, i: number) => {
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
                currentDate={currentDate}
                dateChanged={dateChanged}
                navigationLog={navigationLog}
              />
            )
          })
        )}
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
