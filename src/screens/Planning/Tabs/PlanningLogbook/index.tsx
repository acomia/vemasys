import React, {useEffect, useLayoutEffect, useState} from 'react'
import {RefreshControl} from 'react-native'
import {
  Box,
  Button,
  Center,
  HStack,
  Modal,
  ScrollView,
  Text,
  View,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {Colors} from '@bluecentury/styles'
import {useEntity, usePlanning, useSettings} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'
import {NavLogCard, NavLogDivider} from '@bluecentury/components'
import {NavigationLog} from '@bluecentury/models'
import findLastIndex from 'lodash/findLastIndex'
import _ from 'lodash'
import DatePicker from 'react-native-date-picker'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {Vemasys} from '@bluecentury/helpers'
import {titleCase} from '@bluecentury/constants'

type Dates = {
  plannedETA: Date | undefined | StringOrNull
  captainDatetimeETA: Date | undefined | StringOrNull
  announcedDatetime: Date | undefined | StringOrNull
  arrivalDatetime: Date | undefined | StringOrNull
  terminalApprovedDeparture: Date | undefined | StringOrNull
  departureDatetime: Date | undefined | StringOrNull
}

const PlanningLogbook = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {t} = useTranslation()
  const focused = useIsFocused()
  const {
    isPlanningLoading,
    isHistoryLoading,
    plannedNavigationLogs,
    getVesselPlannedNavLogs,
    hasErrorLoadingPlannedNavigationLogs,
    isUpdateNavLogActionSuccess,
    isCreateNavLogActionSuccess,
    getWholeVesselHistoryNavLogs,
    wholeVesselHistoryNavLogs,
    setPlannedNavigationLogs,
    updateNavigationLogAction,
    updateNavlogDates,
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    createdNavlogAction,
    reset,
  } = usePlanning()
  const {vesselId} = useEntity()
  const {isOnline} = useSettings()
  const toast = useToast()
  const [display, setDisplay] = useState(null)
  const [finishedNavlogs, setFinishedNavlogs] = useState<number[]>([])
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [dates, setDates] = useState<Dates>({
    plannedETA: null,
    captainDatetimeETA: null,
    announcedDatetime: null,
    arrivalDatetime: null,
    terminalApprovedDeparture: null,
    departureDatetime: null,
  })
  const [confirmModal, setConfirmModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState<NavigationLogAction>({})
  const [selectedNavlogID, setSelectedNavlogID] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [plannedData, setPlannedData] = useState<Array<NavigationLog>>([])

  useEffect(() => {
    if (isOnline) {
      getVesselPlannedNavLogs(vesselId as string)
      getWholeVesselHistoryNavLogs(vesselId as string)
    }
    /* eslint-disable react-hooks/exhaustive-deps */
    /* eslint-disable react-native/no-inline-styles */
  }, [vesselId])

  useEffect(() => {
    if (wholeVesselHistoryNavLogs.length && plannedNavigationLogs?.length) {
      const finishedNavlogsIds: number[] = []
      const filteredHistory: NavigationLog[] = []
      plannedNavigationLogs.map((item: NavigationLog) => {
        const filteredByCharter = wholeVesselHistoryNavLogs.filter(
          historyItem => {
            return historyItem?.charter?.id === item?.charter?.id
          }
        )
        filteredHistory.push(...filteredByCharter)
      })
      filteredHistory.forEach(item => {
        finishedNavlogsIds.push(item.id)
      })
      setFinishedNavlogs(finishedNavlogsIds)
      setPlannedNavigationLogs(filteredHistory)
    }
  }, [wholeVesselHistoryNavLogs])

  useEffect(() => {
    if (plannedNavigationLogs) {
      setPlannedData(plannedNavigationLogs)
      let tempIndex = null // used the temp to prevent the updating in useState
      // used the map function to get the index of the first condition
      // to display divider
      plannedNavigationLogs.map((navigationLog, index: number) => {
        const plannedEta = moment(navigationLog.plannedEta).format('YYYY-MM-DD')
        const dateToday = moment().format('YYYY-MM-DD')
        const forwardDate = moment(
          plannedNavigationLogs[index + 1]?.plannedEta
        ).format('YYYY-MM-DD')

        if (
          forwardDate >= dateToday &&
          plannedEta < dateToday &&
          tempIndex === null
        ) {
          tempIndex = index
        }
      })
      setDisplay(tempIndex)
    }
  }, [plannedNavigationLogs])

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

    if (isCreateNavLogActionSuccess) {
      appendCreatedActionToNavlog()
    }
    if (isUpdateNavLogActionSuccess && focused) {
      showToast('Action ended.', 'end')
      stopActionFromSelectedNavlog()
    }
  }, [
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    isUpdateNavLogActionSuccess,
    isCreateNavLogActionSuccess,
  ])

  plannedNavigationLogs?.sort(
    (a: any, b: any) =>
      moment(a.arrivalDatetime || a.plannedEta || a.arrivalZoneTwo).valueOf() -
      moment(b.arrivalDatetime || b.plannedEta || b.arrivalZoneTwo).valueOf()
  )

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
    const plnIndex = plannedData.findIndex(
      pln => pln.id.toString() === selectedNavlogID
    )
    // Create a new object with the updated properties
    const updatedObject = {
      ...plannedData[plnIndex],
      captainDatetimeEta: dates.captainDatetimeETA,
      announcedDatetime: dates.announcedDatetime,
      arrivalDatetime: dates.arrivalDatetime,
      departureDatetime: dates.departureDatetime,
    }
    if (plnIndex !== -1) {
      // Create a new array with the updated object
      const updatedData = [
        ...plannedData.slice(0, plnIndex),
        updatedObject,
        ...plannedData.slice(plnIndex + 1),
      ]
      // Update the state with the new array
      setPlannedData(updatedData)
    }
    setSelectedNavlogID('')
    reset()
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
    const formattedDate = Vemasys.formatDate(date)
    const selectedNavlogDates = plannedData?.filter(
      plan => plan.id.toString() === id
    )

    switch (selectedType) {
      case 'ETA':
        setDates({
          ...dates,
          plannedETA: selectedNavlogDates[0]?.plannedEta,
          captainDatetimeETA: formattedDate,
          announcedDatetime: selectedNavlogDates[0]?.announcedDatetime,
          arrivalDatetime: selectedNavlogDates[0]?.arrivalDatetime,
          terminalApprovedDeparture:
            selectedNavlogDates[0]?.terminalApprovedDeparture,
          departureDatetime: selectedNavlogDates[0]?.departureDatetime,
        })
        break
      case 'NOR':
        setDates({
          ...dates,
          plannedETA: selectedNavlogDates[0]?.plannedEta,
          captainDatetimeETA: selectedNavlogDates[0]?.captainDatetimeEta,
          announcedDatetime: formattedDate,
          arrivalDatetime: selectedNavlogDates[0]?.arrivalDatetime,
          terminalApprovedDeparture:
            selectedNavlogDates[0]?.terminalApprovedDeparture,
          departureDatetime: selectedNavlogDates[0]?.departureDatetime,
        })
        break
      case 'ARR':
        setDates({
          ...dates,
          plannedETA: selectedNavlogDates[0]?.plannedEta,
          captainDatetimeETA: selectedNavlogDates[0]?.captainDatetimeEta,
          announcedDatetime: selectedNavlogDates[0]?.announcedDatetime,
          arrivalDatetime: formattedDate,
          terminalApprovedDeparture:
            selectedNavlogDates[0]?.terminalApprovedDeparture,
          departureDatetime: selectedNavlogDates[0]?.departureDatetime,
        })
        break
      case 'DEP':
        setDates({
          ...dates,
          plannedETA: selectedNavlogDates[0]?.plannedEta,
          captainDatetimeETA: selectedNavlogDates[0]?.captainDatetimeEta,
          announcedDatetime: selectedNavlogDates[0]?.announcedDatetime,
          arrivalDatetime: selectedNavlogDates[0]?.arrivalDatetime,
          terminalApprovedDeparture:
            selectedNavlogDates[0]?.terminalApprovedDeparture,
          departureDatetime: formattedDate,
        })
        break
      default:
        break
    }
  }

  const onPullRefresh = () => {
    getVesselPlannedNavLogs(vesselId as string)
    getWholeVesselHistoryNavLogs(vesselId as string)
  }

  // Logic to choose right colour for planned item start

  const colours = [
    Colors.navLogItemBlue,
    Colors.navLogItemOrange,
    Colors.navLogItemViolet,
    Colors.navLogItemPink,
    Colors.navLogItemGreen,
  ]

  //This function has two steps on first one we create an array of unique planned items,
  // on the second we define a colour of each item
  // after that we return an array of unique items with colour
  const addColourToUniqueItem = (arr: NavigationLog[]) => {
    const uniqueCharters: NavigationLog[] = []
    arr.forEach(item => {
      if (item?.charter?.id) {
        const found = uniqueCharters.find(
          uniqueItem => item?.charter?.id === uniqueItem.charter?.id
        )
        if (!found) {
          uniqueCharters.push(item)
        }
      } else {
        uniqueCharters.push(item)
      }
    })
    let index = 0
    return uniqueCharters.map(item => {
      if (index === colours.length - 1) {
        index = 0
        return {...item, colour: colours[colours.length - 1]}
      } else {
        index += 1
        return {...item, colour: colours[index - 1]}
      }
    })
  }

  const arrayWithColours = plannedNavigationLogs
    ? addColourToUniqueItem(plannedNavigationLogs)
    : []

  // This function looks for items in unique items array and returns a colour for passed item
  const defineColour = (item: NavigationLog) => {
    if (item?.charter?.id) {
      const itemWithColour = arrayWithColours.find(
        secondaryItem => secondaryItem?.charter?.id === item?.charter?.id
      )
      return itemWithColour ? itemWithColour.colour : '#000'
    } else {
      const itemWithColour = arrayWithColours.find(
        secondaryItem => secondaryItem.id === item.id
      )
      return itemWithColour ? itemWithColour.colour : '#000'
    }
  }

  //Logic to choose right colour for planned item end

  // Logic to add the line united planned items with common charter start
  const defineFirstAndLastIndex = arrayWithColours?.map(item => {
    if (plannedNavigationLogs) {
      return {
        ...item,
        firstIndex: plannedNavigationLogs?.findIndex(planned =>
          item?.charter?.id
            ? planned?.charter?.id === item?.charter?.id
            : planned.id === item.id
        ),
        lastIndex: findLastIndex(plannedNavigationLogs, planned =>
          item?.charter?.id
            ? planned?.charter?.id === item?.charter?.id
            : planned.id === item.id
        ),
      }
    }
  })

  const onDateButtonPress = (type: string, id: string) => {
    setSelectedNavlogID(id)
    setSelectedType(type)
    setOpenDatePicker(true)
  }

  const appendCreatedActionToNavlog = () => {
    const plnIndex = plannedData.findIndex(
      pln => pln.id.toString() === selectedNavlogID
    )
    // Create a new array with the updated object
    const updatedArray = plannedData.map((pln, index) => {
      if (index === plnIndex) {
        // Update the items field of the object
        return {
          ...pln,
          navlogActions: [createdNavlogAction],
          hasActiveActions: true,
        }
      }
      return pln
    })
    setPlannedData(updatedArray)
  }

  const stopActionFromSelectedNavlog = () => {
    const plnIndex = plannedData.findIndex(
      pln => pln.id.toString() === selectedNavlogID
    )
    // Create a new array with the updated object
    const updatedArray = plannedData.map((pln, index) => {
      if (index === plnIndex) {
        return {
          ...pln,
          navlogActions: [selectedAction],
          hasActiveActions: false,
        }
      }
      return pln
    })
    setPlannedData(updatedArray)
    setSelectedNavlogID('')
  }

  const navlogsWithLinePositionData = defineFirstAndLastIndex?.map(
    (item, index) => {
      if (defineFirstAndLastIndex.length && item) {
        if (index === 0) {
          return {
            ...item,
            isLeft: true,
          }
        }
        if (
          item &&
          defineFirstAndLastIndex[0] &&
          index !== 0 &&
          item.firstIndex <= defineFirstAndLastIndex[0].lastIndex
        ) {
          return {
            ...item,
            isLeft: false,
          }
        }
        const previousItem = defineFirstAndLastIndex.find(prevItem => {
          return (
            prevItem.lastIndex >= item.firstIndex &&
            item?.charter?.id !== prevItem?.charter?.id
          )
        })

        if (!previousItem) {
          return {
            ...item,
            isLeft: true,
          }
        }

        if (previousItem && previousItem.isLeft) {
          return {
            ...item,
            isLeft: false,
          }
        }

        if (previousItem && !previousItem?.isLeft) {
          return {
            ...item,
            isLeft: true,
          }
        }
      }
    }
  )

  if (isPlanningLoading || isHistoryLoading) return <LoadingAnimated />

  return (
    <Box bgColor={Colors.white} flex="1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isPlanningLoading || isHistoryLoading}
            onRefresh={onPullRefresh}
          />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        pr={ms(12)}
        py={ms(15)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {hasErrorLoadingPlannedNavigationLogs ? (
          <Box bgColor={Colors.white} flex="1" p="5">
            <Center>
              <Text bold color={Colors.azure}>
                {t('failedToLoadRequestedResource')}
              </Text>
            </Center>
          </Box>
        ) : plannedNavigationLogs?.length === 0 && !isPlanningLoading ? (
          <Box bgColor={Colors.white} flex="1" p="2">
            <Center>
              <Text bold color={Colors.azure}>
                {t('noResultsAvailable')}
              </Text>
            </Center>
          </Box>
        ) : (
          plannedData?.map((navigationLog, i: number) => {
            return (
              <View key={i}>
                <NavLogCard
                  key={i}
                  defineFirstAndLastIndex={navlogsWithLinePositionData}
                  index={i}
                  isFinished={finishedNavlogs.includes(navigationLog.id)}
                  itemColor={defineColour(navigationLog)}
                  lastScreen="planning"
                  navigationLog={navigationLog}
                  selectedNavlogID={selectedNavlogID}
                  onNavlogActionPress={(action, id) =>
                    navigation.navigate('AddEditNavlogAction', {
                      method: 'edit',
                      navlogAction: action,
                      actionType: action.type,
                      navlogId: id,
                    })
                  }
                  onNavlogStopActionPress={(action, id) =>
                    confirmStopAction(action, id)
                  }
                  onStartActionPress={(id: string) => {
                    setSelectedNavlogID(id)
                    navigation.navigate('AddEditNavlogAction', {
                      method: 'add',
                      navlogId: id,
                      actionType: navigationLog?.bulkCargo?.some(
                        cargo => cargo.isLoading === false
                      )
                        ? 'Unloading'
                        : 'Loading',
                      navlog: navigationLog,
                    })
                  }}
                  onDateButtonPress={(type, id) => onDateButtonPress(type, id)}
                />
                {display && i === display ? <NavLogDivider /> : null}
              </View>
            )
          })
        )}
        <DatePicker
          modal
          date={new Date()}
          mode="datetime"
          open={openDatePicker}
          onCancel={() => {
            setOpenDatePicker(false)
            setSelectedNavlogID('')
          }}
          onConfirm={date => {
            setOpenDatePicker(false)
            onDatesChange(selectedNavlogID, date)
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
      </ScrollView>
    </Box>
  )
}

export default PlanningLogbook
