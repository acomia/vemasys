import React, {useState, useEffect} from 'react'
import {Alert} from 'react-native'
import {Box, Text, HStack, Button, Modal} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {BeforeAfterComponent, Ship, InputModal} from './component'
import {useTranslation} from 'react-i18next'
import {PageScroll} from '@bluecentury/components'
import {usePlanning} from '@bluecentury/stores'
import {titleCase} from '@bluecentury/constants'
import {Vemasys} from '@bluecentury/helpers'
import _ from 'lodash'
import {initialDraughtValues} from '@bluecentury/constants'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'

export default () => {
  const {t} = useTranslation()

  const {
    isTonnageCertificationLoading,
    isSavingNavBulkLoading,
    navigationLogDetails,
    tonnageCertifications,
    navigationLogActions,
    vesselNavigationDetails,
    updateNavBulk,
    getNavLogTonnageCertification,
    getVesselnavigationDetails,
    updateNavigationLogAction,
  } = usePlanning()

  const [isBefore, setIsBefore] = useState<number>(0)
  const [selectedButton, setSelectedButton] = useState<string>('')
  const [isOpenInput, setIsOpenInput] = useState<boolean>(false)
  const [draughtValues, setDraughtValues] = useState(initialDraughtValues)
  const [averageDraught, setAverageDraught] = useState<number>(0)
  const [tonnage, setTonnage] = useState<string>('0')
  const [isConfirmModal, setConfirmModal] = useState<boolean>(false)
  const [loadingAction, setLoadingAction] = useState<NavigationLogAction>({})
  const [activeLoadingAction, setActiveLoadingAction] = useState({})

  const sortedDraughtTable = tonnageCertifications?.length
    ? tonnageCertifications?.sort(
        (prev, curr) => parseInt(prev.draught) - parseInt(curr.draught)
      )
    : null

  const unsavedChanges = Object.values(draughtValues).filter(
    value => value.didUpdate === true
  )

  const maxDraught = vesselNavigationDetails?.physicalVessel?.draught * 100

  const maxDraughtTonnage = Math.max(
    ...tonnageCertifications?.map(item => item.draught)
  )

  useEffect(() => {
    getTonnage()
  }, [])

  useEffect(() => {
    if (draughtValues) {
      const values = Object.values(draughtValues)
      const average =
        values.reduce((acc, val) => acc + val?.value, 0) / values?.length
      setAverageDraught(average)

      //find the closest tonnage from draughtTable
      const closestDraught = sortedDraughtTable?.reduce((prev, curr) =>
        Math.abs(parseInt(curr.draught) - average) <
        Math.abs(parseInt(prev.draught) - average)
          ? curr
          : prev
      )
      if (closestDraught) setTonnage(closestDraught?.tonnage)
    }
  }, [draughtValues, isBefore])

  const getTonnage = () => {
    if (!vesselNavigationDetails) {
      getVesselnavigationDetails(navigationLogDetails?.exploitationVessel?.id)
    }
    if (vesselNavigationDetails) {
      getNavLogTonnageCertification(
        navigationLogDetails?.exploitationVessel?.id
      )
    }

    const activeLoading = navigationLogActions?.filter(
      action => _.isNull(action?.end) && action.type === 'Loading'
    )

    setActiveLoadingAction(activeLoading[0])
  }

  const buttonSelected = (selected: string) => {
    setSelectedButton(selected)
    setIsOpenInput(true)
  }

  const closeInput = () => {
    setIsOpenInput(false)
  }

  const submitDraught = () => {
    if (navigationLogDetails?.exploitationVessel?.id) {
      updateNavBulk(navigationLogDetails?.bulkCargo?.id, tonnage)
    }
  }

  const onConfirmStopAction = () => {
    if (Object.keys(loadingAction).length === 0) {
      Alert.alert(t('noLoading'))
      return
    }
    setLoadingAction({
      ...loadingAction,
      id: activeLoadingAction?.id,
      type: titleCase(activeLoadingAction?.type),
      start: activeLoadingAction.start,
      estimatedEnd: activeLoadingAction.estimatedEnd,
      end: Vemasys.defaultDatetime(),
      cargoHoldActions: [
        {
          navigationBulk: activeLoadingAction?.navigationBulk?.id,
          amount: activeLoadingAction?.navigationBulk?.amount.toString(),
        },
      ],
    })
    submitDraught()
    updateNavigationLogAction(
      loadingAction?.id,
      navigationLogDetails?.id,
      loadingAction
    )
    setConfirmModal(false)
  }

  const onPullToReload = () => {
    getTonnage()
  }

  const onSaveModal = (value: any) => {
    setDraughtValues({
      ...draughtValues,
      [selectedButton]: {
        ...value,
        didUpdate: true,
      },
    })

    closeInput()
  }

  const clearValues = () => {
    setDraughtValues(initialDraughtValues)
  }

  return (
    <Box flex={1}>
      <PageScroll
        backgroundColor={Colors.light}
        refreshing={isTonnageCertificationLoading || isSavingNavBulkLoading}
        onPullToReload={onPullToReload}
      >
        <Box my={ms(10)}>
          <BeforeAfterComponent active={isBefore} setActive={setIsBefore} />
        </Box>
        <HStack alignItems={'center'} pt={ms(10)} space={ms(5)}>
          <IconFA5 color={Colors.primary} name="info-circle" size={ms(10)} />
          <Text color={Colors.primary} fontSize={ms(10)}>
            Highlighted values have been edited
          </Text>
        </HStack>
        <Box py={ms(10)}>
          <Ship
            active={isBefore}
            averageDraught={averageDraught}
            buttonSelected={buttonSelected}
            draughtValues={draughtValues}
            maxDraught={maxDraught} // get the value from the endpoint nearest value of tonnage_certificate
            tonnage={tonnage}
          />
        </Box>
      </PageScroll>

      {/* buttons */}
      <HStack
        backgroundColor={Colors.white}
        px={ms(10)}
        py={ms(20)}
        space={ms(5)}
      >
        <Button colorScheme={'white'} flex={1} onPress={clearValues}>
          <Text color={Colors.disabled}>{t('cancel')}</Text>
        </Button>

        <Button backgroundColor={Colors.light} flex={1}>
          <Text color={Colors.disabled}>{t('endLoading')}</Text>
        </Button>
        <Button
          backgroundColor={unsavedChanges.length < 1 ? Colors.disabled : null}
          disabled={unsavedChanges.length < 1}
          flex={1}
          onPress={submitDraught}
        >
          <Text color={Colors.white}>{t('save')}</Text>
        </Button>
      </HStack>

      <InputModal
        header={`${t('enterMeasurement')} (${selectedButton})`}
        isOpen={isOpenInput}
        maxDraught={maxDraught}
        setOpen={closeInput}
        value={draughtValues[selectedButton]}
        onAction={onSaveModal}
        onCancel={closeInput}
      />

      <Modal
        animationPreset="slide"
        isOpen={isConfirmModal}
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
              onPress={onConfirmStopAction}
            >
              <Text color={Colors.white} fontWeight="medium">
                {t('stop')}
              </Text>
            </Button>
          </HStack>
        </Modal.Content>
      </Modal>
    </Box>
  )
}
