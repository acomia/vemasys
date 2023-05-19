import React, {useState, useEffect} from 'react'
import {Alert, Platform} from 'react-native'
import {
  Box,
  Text,
  HStack,
  Button,
  Modal,
  KeyboardAvoidingView,
} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {BeforeAfterComponent, Ship, InputModal} from './component'
import {useTranslation} from 'react-i18next'
import {PageScroll} from '@bluecentury/components'
import {usePlanning, useDraught} from '@bluecentury/stores'
import {titleCase, initialDraughtValues} from '@bluecentury/constants'
import {Vemasys} from '@bluecentury/helpers'
import _ from 'lodash'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import {API} from '@bluecentury/api'

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

  const {isDraughtLoading, updateDraught, draughtTable, getDraught} =
    useDraught()

  const [beforeDraught, setBeforeDraught] = useState(initialDraughtValues)
  const [afterDraught, setAfterDraught] = useState(initialDraughtValues)

  const [beforeTonnage, setBeforeTonnage] = useState<number>(0)
  const [afterTonnage, setAfterTonnage] = useState<number>(0)

  const [beforeAverage, setBeforeAverage] = useState<number>(0)
  const [afterAverage, setAfterAverage] = useState<number>(0)

  const [isBefore, setIsBefore] = useState<boolean>(true)
  const [selectedButton, setSelectedButton] = useState<string>('')
  const [isOpenInput, setIsOpenInput] = useState<boolean>(false)

  const [isConfirmModal, setConfirmModal] = useState<boolean>(false)
  const [loadingAction, setLoadingAction] = useState<NavigationLogAction>({})
  const [activeLoadingAction, setActiveLoadingAction] = useState<any>({})

  const sortedDraughtTable = tonnageCertifications?.length
    ? tonnageCertifications?.sort(
        (prev, curr) => parseInt(prev.draught) - parseInt(curr.draught)
      )
    : null

  const beforeUnsaveChanges = Object.values(beforeDraught).filter(
    value => value.didUpdate === true
  )
  const afterUnsaveChanges = Object.values(afterDraught).filter(
    value => value.didUpdate === true
  )

  const unsavedChanges = beforeUnsaveChanges.length + afterUnsaveChanges.length

  const maxDraught = vesselNavigationDetails?.physicalVessel?.draught * 100

  const maxDraughtTonnage = Math.max(
    ...tonnageCertifications?.map(item => item.draught)
  )

  useEffect(() => {
    getTonnage()

    getDraught(navigationLogDetails?.exploitationVessel?.id)

    if (draughtTable) {
      setBeforeDraught(draughtTable?.beforeDraught)
      setAfterDraught(draughtTable?.afterDraught)
    }
  }, [])

  useEffect(() => {
    if (beforeDraught) {
      const beforeAverageCalc = calculateAverage(beforeDraught)
      if (beforeAverageCalc) {
        setBeforeAverage(beforeAverageCalc)
      }
    }
    if (afterDraught) {
      const afterDraughtCalc = calculateAverage(afterDraught)
      if (afterDraughtCalc) {
        setAfterAverage(afterDraughtCalc)
      }
    }
  }, [beforeDraught, afterDraught])

  const calculateAverage = (value: object) => {
    if (!value) return
    const values = Object.values(value)

    return values.reduce((acc, val) => acc + val?.draught, 0) / values.length
  }

  const getClosestDraught = (average: number) => {
    return sortedDraughtTable?.reduce((prev, curr) =>
      Math.abs(parseInt(curr.draught) - average) <
      Math.abs(parseInt(prev.draught) - average)
        ? curr
        : prev
    )
  }

  const getTonnage = async () => {
    if (!vesselNavigationDetails) {
      getVesselnavigationDetails(navigationLogDetails?.exploitationVessel?.id)
    }
    if (vesselNavigationDetails) {
      getNavLogTonnageCertification(
        navigationLogDetails?.exploitationVessel?.id
      )
    }

    // const activeLoading = navigationLogActions?.filter(
    //   action => _.isNull(action?.end) && action.type === 'Loading'
    // )

    // setActiveLoadingAction(activeLoading[0])
  }

  const buttonSelected = (selected: string) => {
    setSelectedButton(selected)
    setIsOpenInput(true)
  }

  const closeInput = () => {
    setIsOpenInput(false)
  }
  const saveTonnage = () => {
    if (navigationLogDetails?.exploitationVessel?.id) {
      // updateNavBulk(navigationLogDetails?.bulkCargo[0]?.id, beforeTonnage)
      API.updateNavBulk(navigationLogDetails?.bulkCargo[0]?.id, beforeTonnage)
    }
  }

  const saveDraught = async () => {
    const beforeDraughtTemp = Object.keys(beforeDraught).reduce(
      (acc: any, key) => {
        return {
          ...acc,
          [key]: {...beforeDraught[key], didUpdate: false},
        }
      },
      {}
    )

    const afterDraughtTemp = Object.keys(afterDraught).reduce(
      (acc: any, key) => {
        return {
          ...acc,
          [key]: {...afterDraught[key], didUpdate: false},
        }
      },
      {}
    )

    updateDraught(navigationLogDetails?.exploitationVessel?.id, {
      beforeDraught: beforeDraughtTemp,
      afterDraught: afterDraughtTemp,
    })
    setBeforeDraught(beforeDraughtTemp)
    setAfterDraught(afterDraughtTemp)
  }

  const onPullToReload = () => {
    getTonnage()
  }

  const onSaveModal = (value: any) => {
    const average = calculateAverage(
      isBefore
        ? {
            ...beforeDraught,
            [selectedButton]: {
              ...value,
              didUpdate: true,
            },
          }
        : {
            ...afterDraught,
            [selectedButton]: {
              ...value,
              didUpdate: true,
            },
          }
    )

    const closestDraught = getClosestDraught(average)

    if (isBefore) {
      setBeforeDraught({
        ...beforeDraught,
        [selectedButton]: {
          ...value,
          didUpdate: true,
        },
      })
      setBeforeAverage(average)
      setBeforeTonnage(closestDraught?.tonnage || 0)
    }

    if (!isBefore) {
      setAfterDraught({
        ...afterDraught,
        [selectedButton]: {
          ...value,
          didUpdate: true,
        },
      })
      setAfterAverage(average)
      setAfterTonnage(closestDraught?.tonnage || 0)
    }

    closeInput()
  }

  const onConfirmStopAction = () => {
    // if (Object.keys(loadingAction).length === 0) {
    //   Alert.alert(t('noLoading'))
    //   return
    // }
    saveDraught()

    // if (Object.keys(loadingAction).length > 0) {
    //   setLoadingAction({
    //     ...loadingAction,
    //     id: activeLoadingAction?.id,
    //     type: titleCase(activeLoadingAction?.type),
    //     start: activeLoadingAction.start,
    //     estimatedEnd: activeLoadingAction.estimatedEnd,
    //     end: Vemasys.defaultDatetime(),
    //     cargoHoldActions: [
    //       {
    //         navigationBulk: activeLoadingAction?.navigationBulk?.id,
    //         amount: activeLoadingAction?.navigationBulk?.amount.toString(),
    //       },
    //     ],
    //   })

    //   updateNavigationLogAction(
    //     loadingAction?.id,
    //     navigationLogDetails?.id,
    //     loadingAction
    //   )
    // }

    saveTonnage()

    setConfirmModal(false)
  }

  return (
    <Box flex={1}>
      {/* <KeyboardAvoidingView
        h={{
          base: '100%',
          lg: 'auto',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        flex={1}
        keyboardVerticalOffset={Platform.OS === 'ios' ? ms(80) : ms(70)}
      > */}
      <PageScroll
        refreshing={
          isTonnageCertificationLoading ||
          isSavingNavBulkLoading ||
          isDraughtLoading
        }
        backgroundColor={Colors.light}
        onPullToReload={onPullToReload}
      >
        <Box my={ms(10)}>
          <BeforeAfterComponent active={isBefore} setActive={setIsBefore} />
        </Box>
        <HStack alignItems={'center'} pt={ms(10)} space={ms(5)}>
          <IconFA5 color={Colors.primary} name="info-circle" size={ms(10)} />
          <Text color={Colors.primary} fontSize={ms(10)}>
            {t('highlightedText')}
          </Text>
        </HStack>
        <Box py={ms(10)}>
          <Ship
            averageDraught={isBefore ? beforeAverage : afterAverage}
            buttonSelected={buttonSelected}
            draughtValues={isBefore ? beforeDraught : afterDraught}
            tonnage={isBefore ? beforeTonnage : afterTonnage}
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
        <Button
          colorScheme={'white'}
          flex={1}
          onPress={() => {
            if (draughtTable) {
              setBeforeDraught(draughtTable?.beforeDraught)
              setAfterDraught(draughtTable?.afterDraught)
            } else {
              setBeforeDraught(initialDraughtValues)
            }
          }}
        >
          <Text color={Colors.disabled}>{t('cancel')}</Text>
        </Button>

        <Button
          backgroundColor={Colors.light}
          flex={1}
          onPress={() => setConfirmModal(true)}
        >
          <Text color={Colors.disabled}>{t('endLoading')}</Text>
        </Button>
        <Button
          backgroundColor={unsavedChanges === 0 ? Colors.disabled : null}
          disabled={unsavedChanges === 0}
          flex={1}
          onPress={saveDraught}
        >
          <Text color={Colors.white}>{t('save')}</Text>
        </Button>
      </HStack>

      <InputModal
        header={`${t('enterMeasurement')} (${selectedButton})`}
        isOpen={isOpenInput}
        maxDraught={maxDraught}
        setOpen={closeInput}
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
      {/* </KeyboardAvoidingView> */}
    </Box>
  )
}
