/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef} from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from 'react-native'
import _ from 'lodash'
import {darkenColor, formatLocationLabel} from '@bluecentury/constants'
import {Box, HStack, Image, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import moment, {Moment} from 'moment/moment'
import {useTranslation} from 'react-i18next'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

import TextTicker from 'react-native-text-ticker'

import {Icons} from '@bluecentury/assets'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {BulkCargo, NavigationLog} from '@bluecentury/models'
import {usePlanning} from '@bluecentury/stores'
import {
  NavlogActionCard,
  EtaNorButtons,
  SingleButton,
  Completed,
} from './components'

const typeIcon = (type: string, navigationLog: NavigationLog) => {
  switch (type) {
    case 'Services':
      return (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.services}
          w={ms(40)}
        />
      )
    case 'Loading/Unloading':
      return navigationLog.actionType === 'Cleaning' ? (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.broom}
          w={ms(40)}
        />
      ) : navigationLog.bulkCargo.some(cargo => cargo.isLoading === false) ? (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.navlogUnloading}
          w={ms(40)}
        />
      ) : (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.navlogLoading}
          w={ms(40)}
        />
      )

    case 'Waiting':
      return (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.waitingNavlogItem}
          w={ms(40)}
        />
      )
    case 'Passed through a Lock':
      return (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.passedThroughLock}
          w={ms(40)}
        />
      )
    case 'Bunkering':
      return (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.bunkering}
          w={ms(40)}
        />
      )
    case 'Passed a bridge':
      return (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.passedABridge}
          w={ms(40)}
        />
      )
    case 'Checkpoint':
      return (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.checkPointNavlogItem}
          w={ms(40)}
        />
      )
    case 'Waste disposal':
      return (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.wasteDisposal}
          w={ms(40)}
        />
      )
    case 'Transfer':
      return (
        <Image
          alt="navlog-type-img"
          h={ms(40)}
          resizeMode="contain"
          source={Icons.transfer}
          w={ms(40)}
        />
      )
  }
}

export const NavLogCard = (props: {
  key: number
  index: number
  navigationLog: NavigationLog
  defineFirstAndLastIndex: any[]
  itemColor: string
  lastScreen: StringOrNull
  isFinished: boolean
  onDateButtonPress: (type: string, navlogId: string) => void
  onNavlogStopActionPress: (action: any, id: string) => void
  onNavlogActionPress: (action: any, id: string) => void
  onStartActionPress: (id: string) => void
  selectedNavlogID: string
  isLoading?: boolean
  label?: string
}) => {
  const {t} = useTranslation()
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {
    index,
    navigationLog,
    defineFirstAndLastIndex,
    itemColor,
    isFinished,
    onDateButtonPress,
    onNavlogActionPress,
    onNavlogStopActionPress,
    onStartActionPress,
    selectedNavlogID,
    isLoading,
    label = '',
  } = props
  const {isPlanningActionsLoading, isUpdateNavlogDatesLoading} = usePlanning()
  const topWidth = useRef(new Animated.Value(0)).current
  const topOpacity = useRef(new Animated.Value(1)).current
  const bottomWidth = useRef(new Animated.Value(0)).current
  const bottomOpacity = useRef(new Animated.Value(1)).current
  const rightHeight = useRef(new Animated.Value(0)).current
  const rightOpacity = useRef(new Animated.Value(1)).current
  const leftHeight = useRef(new Animated.Value(0)).current
  const leftOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (
      (navigationLog?.arrivalDatetime && !navigationLog?.departureDatetime) ||
      (!_.isNull(navigationLog?.startActionDatetime) &&
        _.isNull(navigationLog?.endActionDate))
    ) {
      startAnimation()
    }
  }, [])

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(topWidth, {
          toValue: 100,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(topOpacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.timing(rightHeight, {
          toValue: 100,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(rightOpacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.timing(bottomWidth, {
          toValue: 100,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(bottomOpacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.timing(leftHeight, {
          toValue: 100,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(leftOpacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start()
  }
  const animatedStyles = {
    top: {
      width: topWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '102%'],
      }),
      opacity: topOpacity,
    },
    right: {
      height: rightHeight.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '102%'],
      }),
      opacity: rightOpacity,
    },
    bottom: {
      width: bottomWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '102%'],
      }),
      opacity: bottomOpacity,
    },
    left: {
      height: leftHeight.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '102%'],
      }),
      opacity: leftOpacity,
    },
  }

  const key = index
  const currentItemType = defineFirstAndLastIndex?.find(
    item => item?.charter?.id === navigationLog?.charter?.id
  )
  const currentItemIndex = defineFirstAndLastIndex?.findIndex(
    item => item?.charter?.id === navigationLog?.charter?.id
  )
  const previousItemType =
    defineFirstAndLastIndex?.length > 0
      ? defineFirstAndLastIndex[currentItemIndex - 1]
      : 0
  let displayLeftLine = false
  let displayRightLine = false

  if (
    currentItemIndex === 0 &&
    currentItemType?.charter?.id &&
    key <= currentItemType.lastIndex
  ) {
    displayLeftLine = navigationLog.type.title !== 'Services'
  }
  if (currentItemIndex !== 0) {
    if (key <= previousItemType.lastIndex) {
      displayLeftLine = true
      displayRightLine = navigationLog.type.title !== 'Services'
    }
    if (key > previousItemType.lastIndex && currentItemIndex % 2 !== 0) {
      displayLeftLine = false
      displayRightLine = navigationLog.type.title !== 'Services'
    }
    if (key >= previousItemType.lastIndex && currentItemIndex % 2 === 0) {
      displayLeftLine = navigationLog.type.title !== 'Services'
      displayRightLine = false
    }
  }

  const isCardLoading = isPlanningActionsLoading || isUpdateNavlogDatesLoading
  const isSelectedCardLoading =
    selectedNavlogID === navigationLog.id.toString() &&
    (isPlanningActionsLoading || isUpdateNavlogDatesLoading)

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

  const itemDurationLabel = timeframeToLabel(
    navigationLog?.plannedEta ? moment(navigationLog?.plannedEta) : null,
    navigationLog?.bookedEta ? moment(navigationLog?.bookedEta) : null,
    navigationLog?.arrivalDatetime
      ? moment(navigationLog?.arrivalDatetime)
      : null,
    navigationLog?.departureDatetime
      ? moment(navigationLog?.departureDatetime)
      : null,
    moment(
      navigationLog?.arrivalDatetime ||
        navigationLog?.plannedEta ||
        navigationLog?.arrivalZoneTwo
    ),
    navigationLog?.cargoType
  )

  const drawTheLines = item => {
    const itemType = defineFirstAndLastIndex?.find(
      typeItem => typeItem?.charter?.id === item?.charter?.id
    )
    const crossingsQuantity = defineFirstAndLastIndex.filter(
      typeItem => typeItem?.lastIndex >= index && typeItem?.firstIndex <= index
    )

    const previousItemType = defineFirstAndLastIndex.find(
      prevItem =>
        prevItem?.lastIndex >= index &&
        prevItem?.firstIndex <= index &&
        prevItem?.charter?.id !== item?.charter?.id
    )

    if (crossingsQuantity.length > 2) {
      return
    }

    if (crossingsQuantity.length === 2) {
      return (
        <>
          <Box
            borderColor={
              previousItemType && previousItemType.isLeft
                ? previousItemType.colour
                : itemType.colour
            }
            mb={
              index !==
              defineFirstAndLastIndex[defineFirstAndLastIndex.length - 1]
                .lastIndex
                ? ms(-7)
                : ms(0)
            }
            borderRadius={5}
            borderWidth={2}
            mt={index !== 0 ? ms(-7) : ms(0)}
          />
          <Box
            borderColor={
              previousItemType && !previousItemType.isLeft
                ? previousItemType.colour
                : itemType.colour
            }
            mb={
              index !==
              defineFirstAndLastIndex[defineFirstAndLastIndex.length - 1]
                .lastIndex
                ? ms(-7)
                : ms(0)
            }
            borderRadius={5}
            borderWidth={2}
            mt={index !== 0 ? ms(-7) : ms(0)}
          />
        </>
      )
    }

    if (crossingsQuantity.length === 1) {
      return (
        <>
          <Box
            mb={
              index !==
              defineFirstAndLastIndex[defineFirstAndLastIndex.length - 1]
                .lastIndex
                ? ms(-7)
                : ms(0)
            }
            borderColor={itemType.colour}
            borderRadius={5}
            borderWidth={2}
            mt={index !== 0 ? ms(-7) : ms(0)}
          />
        </>
      )
    }
  }

  return (
    <TouchableOpacity
      key={navigationLog?.id}
      activeOpacity={0.7}
      style={styles.navLogItemWrapper}
      onPress={() =>
        navigation.navigate('PlanningDetails', {
          navlog: navigationLog,
          title: formatLocationLabel(navigationLog?.location) as string,
        })
      }
    >
      <Box
        flex={1}
        flexDirection={'row'}
        h={'100%'}
        justifyContent={'space-between'}
        px={ms(2)}
        w={ms(16)}
      >
        {drawTheLines(navigationLog)}
      </Box>
      <View
        style={
          (navigationLog?.arrivalDatetime &&
            !navigationLog?.departureDatetime) ||
          (!_.isNull(navigationLog?.startActionDatetime) &&
            _.isNull(navigationLog?.endActionDate))
            ? [
                styles.navLogActiveItem,
                {borderColor: darkenColor(itemColor, 0.2)},
              ]
            : styles.navLogContainer
        }
      >
        {!_.isNull(navigationLog?.startActionDatetime) &&
        _.isNull(navigationLog?.endActionDate) ? (
          <>
            {/* Animated rotating border */}
            <Animated.View
              style={[
                styles.border,
                styles.top,
                animatedStyles.top,
                {backgroundColor: darkenColor(itemColor, 0.2)},
              ]}
            />
            <Animated.View
              style={[
                styles.border,
                styles.right,
                animatedStyles.right,
                {backgroundColor: darkenColor(itemColor, 0.2)},
              ]}
            />
            <Animated.View
              style={[
                styles.border,
                styles.bottom,
                animatedStyles.bottom,
                {backgroundColor: darkenColor(itemColor, 0.2)},
              ]}
            />
            <Animated.View
              style={[
                styles.border,
                styles.left,
                animatedStyles.left,
                {backgroundColor: darkenColor(itemColor, 0.2)},
              ]}
            />
          </>
        ) : null}
        {/* Navlog Header */}
        <HStack
          alignItems="center"
          backgroundColor={itemColor}
          px={ms(12)}
          py={ms(10)}
        >
          <Box flex="1">
            <HStack space={ms(5)}>
              {label ? (
                <Box
                  backgroundColor={Colors.primary}
                  borderRadius={5}
                  px={ms(5)}
                  py={ms(3)}
                >
                  <Text bold color={Colors.white}>
                    {label}
                  </Text>
                </Box>
              ) : null}
              <Text bold color={Colors.text} fontSize={ms(15)} noOfLines={1}>
                {formatLocationLabel(navigationLog?.location, label)}
              </Text>
            </HStack>
            {isFinished ? (
              <Text>{`Finished: ${itemDurationLabel}`}</Text>
            ) : (
              <Text color={Colors.azure} fontWeight="medium">
                {t('planned')}
                {moment(navigationLog?.plannedEta).format(
                  'DD MMM YYYY | HH:mm'
                )}
              </Text>
            )}
            {navigationLog?.bulkCargo?.length > 0 &&
              navigationLog?.bulkCargo?.map((cargo: BulkCargo, i: number) => {
                return (
                  <HStack
                    key={`bulkCargo-${i}`}
                    alignItems="center"
                    backgroundColor={Colors.white}
                    borderRadius={4}
                    maxW="64"
                    mb={ms(5)}
                    overflow="hidden"
                    px={ms(6)}
                  >
                    <Text color={Colors.text} fontSize={ms(12)}>
                      {`${Math.ceil(cargo?.actualAmount)} MT `}
                    </Text>
                    <Text
                      bold
                      color={Colors.disabled}
                      fontSize={ms(12)}
                      mr={ms(5)}
                    >
                      {`(${Math.ceil(cargo?.tonnage)} MT) `}
                    </Text>
                    <TextTicker
                      animationType={'scroll'}
                      scrollSpeed={30}
                      // scroll={true}
                      useNativeDriver={true}
                    >
                      {cargo?.type
                        ? cargo?.type?.nameEn || cargo?.type?.nameNl
                        : t('unknown')}
                    </TextTicker>
                  </HStack>
                )
              })}
          </Box>
          {navigationLog?.type?.title
            ? typeIcon(navigationLog.type.title, navigationLog)
            : null}
        </HStack>
        {/* End of Header */}
        {navigationLog?.type?.title === 'Loading/Unloading' &&
        props?.lastScreen === 'planning' ? (
          <Box
            borderStyle={
              !_.isNull(navigationLog.startActionDatetime) &&
              _.isNull(navigationLog.endActionDate)
                ? 'solid'
                : 'dashed'
            }
            borderWidth={
              (navigationLog.arrivalDatetime &&
                !navigationLog.departureDatetime) ||
              (!_.isNull(navigationLog.startActionDatetime) &&
                _.isNull(navigationLog.endActionDate))
                ? null
                : 3
            }
            borderColor={itemColor}
            px={ms(14)}
            py={ms(10)}
          >
            <HStack alignItems="center" mt={ms(5)}>
              <Box flex="1">
                {/* Contextual Buttons */}
                {_.isNull(navigationLog.announcedDatetime) ? (
                  <EtaNorButtons
                    isLoading={
                      selectedNavlogID === ''
                        ? !isCardLoading
                        : !isSelectedCardLoading
                    }
                    navigationLog={navigationLog}
                    onETAPress={() =>
                      !_.isNull(navigationLog.captainDatetimeEta)
                        ? null
                        : onDateButtonPress('ETA', navigationLog.id.toString())
                    }
                    onNORPress={() =>
                      onDateButtonPress('NOR', navigationLog.id.toString())
                    }
                  />
                ) : _.isNull(navigationLog.arrivalDatetime) ? (
                  <SingleButton
                    isLoading={
                      selectedNavlogID === ''
                        ? !isCardLoading
                        : !isSelectedCardLoading
                    }
                    btnColor={Colors.primary}
                    label="Arrival"
                    onPress={() =>
                      onDateButtonPress('ARR', navigationLog.id.toString())
                    }
                  />
                ) : navigationLog.navlogActions?.length &&
                  navigationLog.hasActiveActions ? (
                  navigationLog.navlogActions?.map((action: any, i: number) => (
                    <NavlogActionCard
                      key={i}
                      isLoading={
                        selectedNavlogID === ''
                          ? !isCardLoading
                          : !isSelectedCardLoading
                      }
                      action={action}
                      onActionPress={() =>
                        onNavlogActionPress(action, navigationLog.id.toString())
                      }
                      onActionStopPress={() =>
                        onNavlogStopActionPress(
                          action,
                          navigationLog.id.toString()
                        )
                      }
                    />
                  ))
                ) : navigationLog.navlogActions?.length === 0 &&
                  !navigationLog.hasActiveActions ? (
                  <SingleButton
                    isLoading={
                      selectedNavlogID === ''
                        ? !isCardLoading
                        : !isSelectedCardLoading
                    }
                    label={`Start ${
                      navigationLog?.bulkCargo?.some(
                        cargo => cargo.isLoading === false
                      )
                        ? 'Unloading'
                        : 'Loading'
                    }`}
                    btnColor={Colors.primary}
                    onPress={() =>
                      onStartActionPress(navigationLog.id.toString())
                    }
                  />
                ) : _.isNull(navigationLog.departureDatetime) &&
                  navigationLog.navlogActions?.length ? (
                  <SingleButton
                    isLoading={
                      selectedNavlogID === ''
                        ? !isCardLoading
                        : !isSelectedCardLoading
                    }
                    btnColor={Colors.secondary}
                    label="Departure"
                    onPress={() =>
                      onDateButtonPress('DEP', navigationLog.id.toString())
                    }
                  />
                ) : !_.isNull(navigationLog.arrivalDatetime) &&
                  !_.isNull(navigationLog.departureDatetime) ? (
                  <Completed
                    isLoading={
                      selectedNavlogID === ''
                        ? !isCardLoading
                        : !isSelectedCardLoading
                    }
                    label="Completed"
                  />
                ) : null}
              </Box>
              {/* {!_.isNull(navigationLog.arrivalDatetime) &&
              !_.isNull(navigationLog.departureDatetime) ? (
                <Skeleton.Text isLoaded={!isCardLoading}>
                  <NavigationLogType navigationLog={navigationLog} />
                </Skeleton.Text>
              ) : null} */}
            </HStack>
          </Box>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  navLogActiveItem: {
    borderWidth: 3,
    overflow: 'hidden',
    width: '95%',
    borderRadius: ms(8),
  },
  navLogContainer: {
    borderRadius: ms(5),
    overflow: 'hidden',
    width: '95%',
  },
  navLogItemWrapper: {
    marginBottom: 14,
    flexDirection: 'row',
  },
  border: {
    position: 'absolute',
    borderRadius: 100,
  },
  top: {
    top: 0,
    left: 0,
    height: 3,
    zIndex: 99,
  },
  bottom: {
    right: 0,
    bottom: 0,
    height: 3,
    zIndex: 99,
  },
  right: {
    top: 0,
    right: 0,
    width: 3,
    zIndex: 99,
  },
  left: {
    left: 0,
    bottom: 0,
    width: 3,
    zIndex: 99,
  },
})
