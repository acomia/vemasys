/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react'
import {RefreshControl, StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Center, HStack, Image, ScrollView, Text, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment, {Moment} from 'moment'
import {useNavigation} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import Svg, {Circle} from 'react-native-svg'
import _ from 'lodash'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import TextTicker from 'react-native-text-ticker'

import {Colors} from '@bluecentury/styles'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {
  calculateTotalIn,
  calculateTotalOut,
  formatLocationLabel,
  titleCase,
} from '@bluecentury/constants'
import {
  LoadingAnimated,
  NavigationLogType,
  Blink,
} from '@bluecentury/components'
import {BulkCargo, NavigationLog} from '@bluecentury/models'
import {RootStackParamList} from '@bluecentury/types/nav.types'

interface INavlogCard {
  navigationLog: NavigationLog | null
  currentDate: Date | StringOrNull
  dateChanged: boolean
}
const HistoryLogbook = () => {
  const {t} = useTranslation()
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
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
    (a: NavigationLog, b: NavigationLog) =>
      moment(a.arrivalDatetime || a.plannedEta || a.arrivalZoneTwo).valueOf() -
      moment(b.arrivalDatetime || b.plannedEta || b.arrivalZoneTwo).valueOf()
  )
  historyNavigationLogs.reverse()

  const timeframeToLabel = (
    planned: Moment | null,
    bookedETA: Moment | null,
    start: Moment | null,
    end: Moment | null,
    current: Moment | null,
    cargoType: string | undefined
  ) => {
    if (start) {
      if (end) {
        if (
          start.isSame(end, 'day') &&
          start.format('hh:mm ') === end.format('hh:mm A')
        ) {
          if (current && current.isSame(start, 'day')) {
            return `${start.format('HH:mm')}`
          } else {
            return `${start.format('DD/MM/YYYY HH:mm')}`
          }
        } else {
          const currentStartAndEndDayAreEqual =
            current &&
            current.isSame(start, 'day') &&
            current.isSame(end, 'day')
          if (currentStartAndEndDayAreEqual) {
            // before
            // return `${start.format('HH:mm')} - ${end.format('HH:mm')}`
            // after
            return start.format('HH:mm') === end.format('HH:mm')
              ? start.format('HH:mm')
              : `${start.format('HH:mm')} - ${end.format('HH:mm')}`
          } else {
            return `${start.format('DD/MM/YYYY HH:mm')} - ${end.format(
              'DD/MM/YYYY HH:mm'
            )}`
          }
        }
      } else {
        if (current && current.isSame(start, 'day')) {
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
      if (current && current.isSame(planned, 'day')) {
        return `Planned: ${moment(planned).format('DD MMM YYYY | HH:mm')}`
      } else {
        return `Planned: ${moment(planned).format('DD MMM YYYY | HH:mm')}`
      }
    }

    return 'No date'
  }

  const NavLogCard = ({
    navigationLog,
    currentDate,
    dateChanged,
  }: INavlogCard) => {
    let actualAmount = 0
    let bookedAmount = 0
    navigationLog?.bulkCargo.forEach(item => {
      if (item.amount) {
        bookedAmount += item.amount
      }
      if (item.actualAmount) {
        actualAmount += item.actualAmount
      }
    })
    // console.log('navigationLog', navigationLog)
    const itemDurationLabel = timeframeToLabel(
      navigationLog?.plannedEta ? moment(navigationLog?.plannedEta) : null,
      navigationLog?.bookedEta ? moment(navigationLog?.bookedEta) : null,
      navigationLog?.arrivalDatetime
        ? moment(navigationLog?.arrivalDatetime)
        : null,
      navigationLog?.departureDatetime
        ? moment(navigationLog?.departureDatetime)
        : null,
      moment(currentDate),
      navigationLog?.cargoType
    )

    const isOngoing =
      navigationLog?.arrivalDatetime &&
      !navigationLog?.departureDatetime &&
      !_.isNull(navigationLog.startActionDatetime) &&
      _.isNull(navigationLog.endActionDatetime)

    return (
      <Box key={navigationLog?.id}>
        {dateChanged && (
          <Box
            key={`${navigationLog?.id}-date`}
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
          style={{
            marginBottom: 14,
            paddingHorizontal: 2,
          }}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('PlanningDetails', {
              navlog: navigationLog,
              title: formatLocationLabel(navigationLog?.location),
            })
          }
        >
          <Box
            backgroundColor={
              navigationLog?.arrivalDatetime &&
              !navigationLog?.departureDatetime
                ? Colors.secondary
                : navigationLog?.departureDatetime ===
                  navigationLog?.arrivalDatetime
                ? Colors.dark_border
                : Colors.border
            }
            borderColor={
              navigationLog?.bulkCargo && navigationLog?.bulkCargo.length > 0
                ? Colors.primary_light
                : null
            }
            borderWidth={
              navigationLog?.bulkCargo && navigationLog?.bulkCargo.length > 0
                ? 3
                : 0
            }
            borderRadius={ms(5)}
            overflow="hidden"
            style={isOngoing ? styles.navLogActiveItem : null}
          >
            {/* Navlog Header */}

            <Box
              // backgroundColor={
              //   navigationLog?.isActive
              //     ? Colors.secondary
              //     : navigationLog?.departureDatetime ===
              //       navigationLog?.arrivalDatetime
              //     ? Colors.dark_border
              //     : Colors.border
              // }
              px={ms(16)}
              py={ms(10)}
            >
              <HStack alignItems="center">
                <VStack w="100%">
                  <Text
                    bold
                    color={
                      navigationLog?.arrivalDatetime &&
                      !navigationLog?.departureDatetime
                        ? Colors.white
                        : Colors.text
                    }
                    flex="1"
                    fontSize={ms(15)}
                  >
                    {formatLocationLabel(navigationLog?.location)}
                  </Text>
                  {navigationLog.bulkCargo.length < 1 ? null : (
                    <Box
                      borderColor={Colors.border}
                      borderStyle="dashed"
                      borderTopWidth={0}
                      borderWidth={isOngoing ? null : 3}
                    >
                      <HStack
                        alignItems="center"
                        justifyContent="space-between"
                        my={ms(5)}
                      >
                        <Box flex="1">
                          {navigationLog?.bulkCargo &&
                            navigationLog?.bulkCargo.length > 0 &&
                            navigationLog?.bulkCargo.map(
                              (cargo: BulkCargo, i: number) => {
                                return (
                                  <Box
                                    key={`bulkCargo-${i}`}
                                    backgroundColor={Colors.white}
                                    borderRadius={4}
                                    maxW="3/4"
                                    mb={ms(5)}
                                    // py={ms(5)}
                                    px={ms(6)}
                                  >
                                    <Text
                                      key={i}
                                      // bold
                                      color={Colors.black}
                                      ellipsizeMode="tail"
                                      numberOfLines={1}
                                    >
                                      {`${
                                        cargo.actualAmount
                                          ? Math.ceil(cargo.actualAmount)
                                          : 0
                                      } MT (${
                                        cargo.amount
                                          ? Math.ceil(cargo.amount)
                                          : 0
                                      } MT) - 
                                      `}
                                    </Text>
                                    <TextTicker
                                      animationType={'scroll'}
                                      scrollSpeed={30}
                                      // scroll={true}
                                      useNativeDriver={true}
                                    >
                                      {cargo?.type
                                        ? cargo?.type?.nameEn ||
                                          cargo?.type?.nameNl
                                        : t('unknown')}
                                    </TextTicker>
                                  </Box>
                                )
                              }
                            )}
                        </Box>
                        <Box
                          alignItems="center"
                          backgroundColor={Colors.white}
                          borderRadius={50}
                          h={ms(40)}
                          justifyContent="center"
                          w={ms(40)}
                        >
                          <NavigationLogType
                            isSmall
                            navigationLog={navigationLog}
                          />
                        </Box>
                      </HStack>
                    </Box>
                  )}
                </VStack>

                {isOngoing ? (
                  <HStack alignItems="center">
                    <Text color={Colors.secondary} fontSize={ms(12)} mr={1}>
                      Ongoing
                    </Text>
                    <Blink duration={800}>
                      <Svg height="10" viewBox="0 0 100 100" width="10">
                        <Circle
                          cx="50"
                          cy="50"
                          fill={Colors.secondary}
                          fillOpacity="1"
                          r="50"
                        />
                      </Svg>
                    </Blink>
                  </HStack>
                ) : null}
              </HStack>
              <HStack justifyContent="space-between" w="100%">
                <Text
                  color={
                    navigationLog?.arrivalDatetime &&
                    !navigationLog?.departureDatetime
                      ? Colors.white
                      : Colors.azure
                  }
                  fontWeight="medium"
                >
                  {itemDurationLabel}
                </Text>
                {renderDuration(
                  navigationLog?.departureDatetime,
                  navigationLog?.arrivalDatetime,
                )}
              </HStack>
            </Box>
            {/* End of Header */}
          </Box>
        </TouchableOpacity>
      </Box>
    )
  }

  const renderDuration = (
    startDate: StringOrNull | undefined,
    endDate: StringOrNull | undefined
  ) => {
    if (startDate === endDate) return
    const navigationDuration = moment.duration(
      moment(startDate).diff(moment(endDate))
    )

    const isActive = endDate && !startDate

    return (
      <Text
        color={isActive ? Colors.white : Colors.azure}
        // fontWeight="bold"
        textAlign="right"
      >
        {navigationDuration.days() ? `${navigationDuration.days()}d` : ''}
        {!navigationDuration.days() && !navigationDuration.hours()
          ? ''
          : ` ${Math.abs(navigationDuration.hours())}h`}
        {` ${Math.abs(navigationDuration.minutes())}m`}
      </Text>
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
                {t('noResultsAvailable')}
              </Text>
            </Center>
          </Box>
        ) : (
          historyNavigationLogs.map(
            (navigationLog: NavigationLog, i: number) => {
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
            }
          )
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

const styles = StyleSheet.create({
  navLogActiveItem: {
    borderColor: Colors.secondary,
    borderWidth: 3,
    borderRadius: ms(8),
  },
})

export default HistoryLogbook
