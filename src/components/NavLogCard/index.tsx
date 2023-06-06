/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import _ from 'lodash'
import {formatLocationLabel, titleCase} from '@bluecentury/constants'
import {Box, Button, HStack, Image, Modal, Text, useToast} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import moment, {Moment} from 'moment/moment'
import {useTranslation} from 'react-i18next'

import {Animated, Icons} from '@bluecentury/assets'
import {NavigationLogType} from '@bluecentury/components'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {BulkCargo, NavigationLog} from '@bluecentury/models'
import {Vemasys} from '@bluecentury/helpers'
import {useEntity, usePlanning} from '@bluecentury/stores'
import DatePicker from 'react-native-date-picker'

interface IActionCard {
  action: {
    type: string
    start: Date
    end: Date
  }
  onActionPress: () => void
  onActionStopPress: () => void
}

type Dates = {
  plannedETA: Date | undefined | StringOrNull
  captainDatetimeETA: Date | undefined | StringOrNull
  announcedDatetime: Date | undefined | StringOrNull
  arrivalDatetime: Date | undefined | StringOrNull
  terminalApprovedDeparture: Date | undefined | StringOrNull
  departureDatetime: Date | undefined | StringOrNull
}

export const NavLogCard = (props: {
  key: number
  index: number
  navigationLog: NavigationLog
  defineFirstAndLastIndex: any[]
  itemColor: string
  lastScreen: StringOrNull
  isFinished: boolean
}) => {
  const {t} = useTranslation()
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {index, navigationLog, defineFirstAndLastIndex, itemColor, isFinished} =
    props
  const {
    getVesselPlannedNavLogs,
    updateNavigationLogAction,
    updateNavlogDates,
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    reset,
  } = usePlanning()
  const {vesselId} = useEntity()
  const focused = useIsFocused()
  const toast = useToast()
  const [confirmModal, setConfirmModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState<NavigationLogAction>({})
  const [selectedNavlogID, setSelectedNavlogID] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [dates, setDates] = useState<Dates>({
    plannedETA: navigationLog?.plannedEta,
    captainDatetimeETA: navigationLog?.captainDatetimeEta,
    announcedDatetime: navigationLog?.announcedDatetime,
    arrivalDatetime: navigationLog?.arrivalDatetime,
    terminalApprovedDeparture: navigationLog?.terminalApprovedDeparture,
    departureDatetime: navigationLog?.departureDatetime,
  })
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

  useEffect(() => {
    if (selectedNavlogID !== '') {
      updateNavlogDates(selectedNavlogID, dates)
    }
  }, [dates])

  useEffect(() => {
    if (updateNavlogDatesSuccess === 'SUCCESS' && focused) {
      showToast('Updates saved.', 'success')
    }
    if (updateNavlogDatesFailed === 'FAILED') {
      showToast(updateNavlogDatesMessage, 'failed')
    }
  }, [
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
  ])

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 1000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            color={Colors.white}
            mb={5}
            px="2"
            py="1"
            rounded="sm"
          >
            {text}
          </Text>
        )
      },
      onCloseComplete() {
        res === 'success' ? onSuccess() : reset()
      },
    })
  }

  const onSuccess = () => {
    getVesselPlannedNavLogs(vesselId as string)
    reset()
  }

  const typeIcon = (type: string) => {
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

  const ActionCard = ({
    action,
    onActionPress,
    onActionStopPress,
  }: IActionCard) => {
    const renderAnimatedIcon = (type: string, end: Date) => {
      switch (type.toLowerCase()) {
        case 'unloading':
          return _.isNull(end) ? Animated.nav_unloading : Icons.unloading
        case 'loading':
          return _.isNull(end) ? Animated.nav_loading : Icons.loading
        case 'cleaning':
          return _.isNull(end) ? Animated.cleaning : Icons.broom
        default:
          break
      }
    }

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onActionPress}>
        <HStack alignItems="center" bg={Colors.white}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={_.isNull(action.end) ? false : true}
            style={{marginRight: ms(10)}}
            onPress={onActionStopPress}
          >
            <Image
              alt="navlog-action-icon"
              height={ms(30)}
              resizeMode="contain"
              source={_.isNull(action.end) ? Icons.stop : null}
              width={ms(30)}
            />
          </TouchableOpacity>
          <Box flex="1">
            <HStack alignItems="center">
              <Text bold color={Colors.text} fontSize={ms(15)}>
                {titleCase(action.type)}
              </Text>
            </HStack>
            <Text
              color={Colors.secondary}
              fontSize={ms(11)}
              fontWeight="medium"
            >
              {t('start')}
              {moment(action.start).format('D MMM YYYY | HH:mm')}
            </Text>
          </Box>
          <Box
            alignItems="center"
            display="flex"
            height={ms(50)}
            justifyContent="center"
            width={ms(50)}
          >
            <Image
              height={
                action?.type === 'Cleaning' && !_.isNull(action.end)
                  ? '70%'
                  : '100%'
              }
              width={
                action?.type === 'Cleaning' && !_.isNull(action.end)
                  ? '70%'
                  : '100%'
              }
              alt="navlog-action-animated"
              mr={ms(10)}
              resizeMode="contain"
              source={renderAnimatedIcon(action.type, action.end)}
            />
          </Box>
        </HStack>
      </TouchableOpacity>
    )
  }

  const confirmStopAction = (action: any, id: string) => {
    setConfirmModal(true)
    setSelectedNavlogID(id)
    setSelectedAction({
      ...selectedAction,
      id: action.id,
      type: titleCase(action.type),
      start: action.start,
      estimatedEnd: action.estimatedEnd,
      end: Vemasys.defaultDatetime(),
      cargoHoldActions: [
        {
          navigationBulk: action?.navigationBulk?.id,
          amount: action?.navigationBulk?.amount.toString(),
        },
      ],
    })
  }

  const onStopAction = () => {
    setConfirmModal(false)
    updateNavigationLogAction(
      selectedAction?.id,
      selectedNavlogID,
      selectedAction
    )
  }

  const onDatesChange = (id: string, date: Date) => {
    setSelectedNavlogID(id)
    const formattedDate = Vemasys.formatDate(date)
    switch (selectedType) {
      case 'ETA':
        setDates({...dates, captainDatetimeETA: formattedDate})
        break
      case 'NOR':
        setDates({...dates, announcedDatetime: formattedDate})
        break
      case 'ARR':
        setDates({...dates, arrivalDatetime: formattedDate})
        break
      case 'DEP':
        setDates({...dates, departureDatetime: formattedDate})
        break
      default:
        break
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
        px={ms(4)}
        w={ms(16)}
      >
        <Box
          borderColor={
            !displayLeftLine
              ? 'rgba(52, 52, 52, 0)'
              : currentItemIndex === 0
              ? currentItemType?.colour
              : previousItemType.lastIndex < key
              ? itemColor
              : previousItemType.colour
          }
          mb={
            currentItemType?.lastIndex === key
              ? ms(0)
              : currentItemIndex % 2 !== 0 && previousItemType.lastIndex === key
              ? 0
              : currentItemType?.lastIndex === currentItemType?.firstIndex
              ? 0
              : ms(-7)
          }
          mt={
            currentItemIndex % 2 === 0 && currentItemType?.firstIndex === key
              ? ms(0)
              : currentItemIndex !== 0 ||
                (currentItemIndex % 2 !== 0 &&
                  previousItemType?.firstIndex < key &&
                  previousItemType.lastIndex > key)
              ? ms(-7)
              : currentItemIndex === 0 && key !== 0
              ? ms(-7)
              : 0
          }
          borderRadius={5}
          borderWidth={2}
        />
        <Box
          borderColor={
            !displayRightLine
              ? 'rgba(52, 52, 52, 0)'
              : previousItemType.lastIndex < key && !displayLeftLine
              ? currentItemType?.colour
              : previousItemType.lastIndex < key && displayLeftLine
              ? previousItemType.colour
              : currentItemType?.colour
          }
          borderWidth={2}
          mb={currentItemType?.lastIndex === key ? ms(0) : ms(-7)}
          mt={currentItemType?.firstIndex === key ? ms(0) : ms(-7)}
        />
      </Box>
      <Box
        style={
          navigationLog?.isActive ||
          (!_.isNull(navigationLog?.startActionDatetime) &&
            _.isNull(navigationLog?.endActionDate))
            ? styles.navLogActiveItem
            : null
        }
        borderRadius={ms(5)}
        overflow="hidden"
        w={'95%'}
      >
        {/* Navlog Header */}
        <HStack
          alignItems="center"
          backgroundColor={itemColor}
          px={ms(12)}
          py={ms(10)}
        >
          <Box flex="1">
            <Text bold color={Colors.text} fontSize={ms(15)} noOfLines={1}>
              {formatLocationLabel(navigationLog?.location)}
            </Text>
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
                    bg={Colors.white}
                    borderRadius={4}
                    mt={ms(5)}
                    px={ms(6)}
                    w="65%"
                  >
                    <Text color={Colors.text} fontSize={ms(12)}>
                      {`${Math.ceil(cargo?.actualAmount)} MT `}
                    </Text>
                    <Text bold color={Colors.disabled} fontSize={ms(12)}>
                      {`(${Math.ceil(cargo?.tonnage)} MT) `}
                    </Text>
                    <Text color={Colors.text} fontSize={ms(12)}>
                      Split
                    </Text>
                  </HStack>
                )
              })}
          </Box>
          {navigationLog?.type?.title
            ? typeIcon(navigationLog.type.title)
            : null}
        </HStack>
        {/* End of Header */}
        {console.log('navLogCard type title', navigationLog?.type)}
        {navigationLog?.type?.title === 'Loading/Unloading' &&
        props?.lastScreen === 'planning' ? (
          <Box
            borderWidth={
              navigationLog.isActive ||
              (!_.isNull(navigationLog.startActionDatetime) &&
                _.isNull(navigationLog.endActionDate))
                ? null
                : 3
            }
            borderColor={Colors.border}
            borderStyle="dashed"
            // mt={-3}
            pt={3}
            px={ms(14)}
            py={ms(10)}
          >
            <HStack alignItems="center" mt={ms(5)}>
              <Box flex="1">
                {/* Contextual Buttons */}
                {_.isNull(navigationLog.announcedDatetime) ? (
                  <HStack>
                    <Button
                      bg={
                        _.isNull(navigationLog.captainDatetimeEta)
                          ? Colors.primary
                          : Colors.disabled
                      }
                      colorScheme={Colors.disabled}
                      flex="1"
                      size="sm"
                      onPress={() => {
                        setSelectedType('ETA')
                        !_.isNull(navigationLog.captainDatetimeEta)
                          ? null
                          : setOpenDatePicker(true)
                      }}
                    >
                      ETA
                    </Button>
                    <Box w={3} />
                    <Button
                      bg={Colors.primary}
                      flex="1"
                      size="sm"
                      onPress={() => {
                        setSelectedType('NOR')
                        setOpenDatePicker(true)
                      }}
                    >
                      NOR
                    </Button>
                  </HStack>
                ) : _.isNull(navigationLog.arrivalDatetime) ? (
                  <Button
                    bg={Colors.primary}
                    size="sm"
                    onPress={() => {
                      setSelectedType('ARR')
                      setOpenDatePicker(true)
                    }}
                  >
                    Arrived
                  </Button>
                ) : navigationLog.navlogActions?.length &&
                  navigationLog.hasActiveActions ? (
                  navigationLog.navlogActions?.map((action: any, i: number) => (
                    <ActionCard
                      key={i}
                      action={action}
                      onActionPress={() =>
                        navigation.navigate('AddEditNavlogAction', {
                          method: 'edit',
                          navlogAction: action,
                          actionType: action.type,
                        })
                      }
                      onActionStopPress={() =>
                        confirmStopAction(action, navigationLog.id.toString())
                      }
                    />
                  ))
                ) : navigationLog.navlogActions?.length === 0 &&
                  !navigationLog.hasActiveActions ? (
                  <Button
                    bg={Colors.primary}
                    size="sm"
                    onPress={() =>
                      navigation.navigate('AddEditNavlogAction', {
                        method: 'add',
                        actionType: navigationLog?.bulkCargo?.some(
                          cargo => cargo.isLoading === false
                        )
                          ? 'Unloading'
                          : 'Loading',
                      })
                    }
                  >
                    {`Start ${
                      navigationLog?.bulkCargo?.some(
                        cargo => cargo.isLoading === false
                      )
                        ? 'Unloading'
                        : 'Loading'
                    }`}
                  </Button>
                ) : _.isNull(navigationLog.departureDatetime) &&
                  navigationLog.navlogActions?.length ? (
                  <Button
                    bg={Colors.secondary}
                    size="sm"
                    onPress={() => {
                      setSelectedType('DEP')
                      setOpenDatePicker(true)
                    }}
                  >
                    Departure
                  </Button>
                ) : isFinished ? (
                  <Text bold color={Colors.secondary} fontSize={ms(16)}>
                    Completed
                  </Text>
                ) : null}
              </Box>
              {!_.isNull(navigationLog.announcedDatetime) &&
              !_.isNull(navigationLog.arrivalDatetime) &&
              !_.isNull(navigationLog.departureDatetime) &&
              isFinished ? (
                <NavigationLogType
                  isFinished={isFinished}
                  navigationLog={navigationLog}
                />
              ) : null}
            </HStack>
          </Box>
        ) : null}
      </Box>
      <DatePicker
        modal
        date={new Date()}
        mode="datetime"
        open={openDatePicker}
        onCancel={() => {
          setOpenDatePicker(false)
        }}
        onConfirm={date => {
          setOpenDatePicker(false)
          onDatesChange(navigationLog.id.toString(), date)
        }}
      />
      <Modal
        animationPreset="slide"
        isOpen={confirmModal}
        px={ms(12)}
        size="full"
      >
        <Modal.Content>
          <Modal.Header>{t('confirmation')}</Modal.Header>
          <Text fontWeight="medium" mx={ms(12)} my={ms(20)}>
            {t('areYouSure')}
          </Text>
          <HStack>
            <Button
              bg={Colors.grey}
              flex="1"
              m={ms(12)}
              onPress={() => setConfirmModal(false)}
            >
              <Text color={Colors.disabled} fontWeight="medium">
                {t('cancel')}
              </Text>
            </Button>
            <Button
              bg={Colors.danger}
              flex="1"
              m={ms(12)}
              onPress={onStopAction}
            >
              <Text color={Colors.white} fontWeight="medium">
                {t('stop')}
              </Text>
            </Button>
          </HStack>
        </Modal.Content>
      </Modal>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  navLogActiveItem: {
    borderColor: Colors.secondary,
    borderWidth: 3,
    borderRadius: ms(8),
  },
  navLogItemWrapper: {
    marginBottom: 14,
    flexDirection: 'row',
  },
})
