import React, {useState, useEffect, useRef} from 'react'
import {ActivityIndicator} from 'react-native'
import {Box, Modal, HStack, Text, Button} from 'native-base'
import {NavLogCard} from '@bluecentury/components'
import {NavigationLog} from '@bluecentury/models'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {useIsFocused, useNavigation} from '@react-navigation/native'
import {titleCase} from '@bluecentury/constants'
import {usePlanning, useEntity, useMap} from '@bluecentury/stores'
import DatePicker from 'react-native-date-picker'
import {Vemasys} from '@bluecentury/helpers'
import {useTranslation} from 'react-i18next'
import {showToast} from '@bluecentury/hooks'

type Dates = {
  plannedETA: Date | undefined | StringOrNull
  captainDatetimeETA: Date | undefined | StringOrNull
  announcedDatetime: Date | undefined | StringOrNull
  arrivalDatetime: Date | undefined | StringOrNull
  terminalApprovedDeparture: Date | undefined | StringOrNull
  departureDatetime: Date | undefined | StringOrNull
}

const MapNavLog = (props: {
  navigationLog: NavigationLog
  itemColor: string
  keyIndex: number
  isFinished?: boolean
  label?: string
  isActionInProgress?: (val: boolean) => void
}) => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {
    navigationLog,
    itemColor,
    keyIndex,
    isFinished = false,
    label = '',
    isActionInProgress,
  } = props
  // const {
  //   navigationLog,
  //   itemColor,
  //   key,
  //   isFinished = false,
  //   label = '',
  //   isActionInProgress,
  // } = props
  const focused = useIsFocused()

  const {
    updateNavlogDates,
    updateNavigationLogAction,
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    isUpdateNavLogActionSuccess,
    isCreateNavLogActionSuccess,
    isNavLogDetailsLoading,
    isPlanningActionsLoading,
    reset,
  } = usePlanning()
  const {
    getPreviousNavigationLogs,
    getPlannedNavigationLogs,
    getCurrentNavigationLogs,
    isLoadingCurrentNavLogs,
    isLoadingPlannedNavLogs,
    isLoadingPreviousNavLogs,
  } = useMap()

  const {vesselId} = useEntity()

  const [dates, setDates] = useState<Dates>({
    plannedETA: null,
    captainDatetimeETA: null,
    announcedDatetime: null,
    arrivalDatetime: null,
    terminalApprovedDeparture: null,
    departureDatetime: null,
  })
  const [selectedNavlogID, setSelectedNavlogID] = useState(
    navigationLog?.id.toString()
  )
  const [selectedAction, setSelectedAction] = useState<NavigationLogAction>({})
  const [selectedType, setSelectedType] = useState('')
  const [confirmModal, setConfirmModal] = useState(false)
  const [plannedData, setPlannedData] = useState<Array<NavigationLog>>([])
  const [openDatePicker, setOpenDatePicker] = useState(false)

  useEffect(() => {
    if (isActionInProgress) {
      isActionInProgress(confirmModal || openDatePicker)
    }
  }, [confirmModal, openDatePicker])

  const isLoading =
    updateNavlogDatesSuccess === 'SUCCESS' &&
    (isNavLogDetailsLoading ||
      isLoadingCurrentNavLogs ||
      isLoadingPlannedNavLogs ||
      isLoadingPreviousNavLogs)

  useEffect(() => {
    if (focused) {
      if (updateNavlogDatesSuccess === 'SUCCESS' && focused) {
        updateNavLogs()
        showToast('Updates saved.', 'success')
      }
      if (
        updateNavlogDatesSuccess === 'SUCCESS' &&
        (!isPlanningActionsLoading || !isLoadingPlannedNavLogs)
      ) {
        reset()
      }

      if (isCreateNavLogActionSuccess) {
        appendCreatedActionToNavlog()
        updateNavLogs()
      }
      if (isUpdateNavLogActionSuccess && focused) {
        showToast('Action ended.', 'end')
        stopActionFromSelectedNavlog()
      }
    }
  }, [
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    isUpdateNavLogActionSuccess,
    isCreateNavLogActionSuccess,
    focused,
  ])

  const updateNavLogs = async () => {
    await getPreviousNavigationLogs(vesselId)
    await getPlannedNavigationLogs(vesselId)
    await getCurrentNavigationLogs(vesselId)
  }

  const onDateButtonPress = (type: string, id: string) => {
    setSelectedNavlogID(id)
    setSelectedType(type)
    setOpenDatePicker(true)
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

  const onDatesChange = (date: Date) => {
    const formattedDate = Vemasys.formatDate(date)
    const objDates = {
      plannedETA: navigationLog?.plannedEta,
      captainDatetimeETA: navigationLog?.captainDatetimeEta,
      announcedDatetime: navigationLog?.announcedDatetime,
      arrivalDatetime: navigationLog?.arrivalDatetime,
      terminalApprovedDeparture: navigationLog?.terminalApprovedDeparture,
      departureDatetime: navigationLog?.departureDatetime,
    }

    switch (selectedType) {
      case 'ETA':
        objDates.captainDatetimeETA = formattedDate
        break
      case 'NOR':
        objDates.announcedDatetime = formattedDate
        break
      case 'ARR':
        objDates.arrivalDatetime = formattedDate
        break
      case 'DEP':
        objDates.departureDatetime = formattedDate
        break
      default:
        break
    }

    updateNavlogDates(selectedNavlogID, dates)
  }

  const onStopAction = () => {
    setConfirmModal(false)
    updateNavigationLogAction(
      selectedAction?.id,
      selectedNavlogID,
      selectedAction
    )
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

  return navigationLog ? (
    <Box key={keyIndex} right={ms(7)} width={'full'}>
      <NavLogCard
        key={keyIndex}
        defineFirstAndLastIndex={[]}
        index={keyIndex}
        isFinished={isFinished}
        isLoading={isLoading}
        itemColor={itemColor}
        label={label}
        lastScreen={'planning'}
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
        onStartActionPress={(id: string) => {
          setSelectedNavlogID(navigationLog?.id?.toString())
          navigation.navigate('AddEditNavlogAction', {
            method: 'add',
            navlogId: id,
            actionType: navigationLog?.bulkCargo?.some(
              cargo => cargo.isLoading === false
            )
              ? 'Unloading'
              : 'Loading',
          })
        }}
        onDateButtonPress={(type, id) => onDateButtonPress(type, id)}
        onNavlogStopActionPress={(action, id) => confirmStopAction(action, id)}
      />
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
          onDatesChange(date)
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
    </Box>
  ) : (
    <ActivityIndicator size={ms(40)} />
  )
}

export default MapNavLog
