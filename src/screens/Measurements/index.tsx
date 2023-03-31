import React, {useEffect, useState, useRef} from 'react'
import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  Icon,
  Input,
  Modal,
  Progress,
  Skeleton,
  Text,
  useToast,
} from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {useTranslation} from 'react-i18next'

import {
  convertCommaToPeriod,
  convertPeriodToComma,
  formatNumber,
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_TECHNICAL,
} from '@bluecentury/constants'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {Colors} from '@bluecentury/styles'
import {MeasurementCard} from './measurement-card'
import {LastMeasurement} from '@bluecentury/models'

type Props = NativeStackScreenProps<RootStackParamList>
const Measurements = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {data, routeFrom} = route.params
  const toast = useToast()
  const {
    isTechnicalLoading,
    lastMeasurements,
    getVesselPartLastMeasurements,
    createNewConsumptionMeasure,
    getVesselGasoilReservoirs,
    getVesselEngines,
    getVesselReservoirs,
  } = useTechnical()
  const {physicalVesselId, selectedEntity} = useEntity()
  const [newMeasurement, setNewMeasurement] = useState('')
  const [open, setOpen] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [inputInvalid, setInputInvalid] = useState(false)
  const inputRef = useRef(null)
  const hasTechnicalPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_TECHNICAL
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.blur()
      inputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    getVesselPartLastMeasurements(
      routeFrom === 'reservoir' ? data?.id : data?.data[0]?.id
    )
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])

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
    })
  }

  const showWarningToast = (text: string) => {
    toast.show({
      duration: 1000,
      render: () => {
        return (
          <Text
            bg="warning.500"
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
    })
  }

  const renderReservoirCard = () => {
    let fillPct = 0
    const capacity = data?.capacity === null ? 0 : data?.capacity
    const value =
      Array.isArray(lastMeasurements) && lastMeasurements
        ? lastMeasurements[0]?.value
        : 0
    const used = capacity - value
    fillPct = (used / capacity) * 100 - 100
    fillPct = fillPct < 0 ? fillPct * -1 : fillPct
    return (
      <Box
        bg={Colors.white}
        borderRadius={ms(5)}
        px={ms(15)}
        py={ms(20)}
        shadow={5}
      >
        <HStack alignItems="center">
          <Skeleton
            flex="1"
            h={ms(22)}
            isLoaded={!isTechnicalLoading}
            rounded="full"
            startColor={Colors.light}
            w={ms(100)}
          >
            <Text color={Colors.azure} flex="1" fontWeight="medium">
              {data?.name}
            </Text>
          </Skeleton>
          <Skeleton
            h={ms(22)}
            isLoaded={!isTechnicalLoading}
            rounded="full"
            startColor={Colors.light}
            w={ms(100)}
          >
            <Text bold color={Colors.azure} fontSize={ms(16)}>
              {formatNumber(value, 2, ' ')} L (
              {isNaN(fillPct) || fillPct === Infinity ? 0 : Math.floor(fillPct)}
              %)
            </Text>
          </Skeleton>
        </HStack>
        <Skeleton
          h={ms(22)}
          isLoaded={!isTechnicalLoading}
          mt={ms(5)}
          rounded="full"
          startColor={Colors.light}
          w={ms(100)}
        >
          <Text color={Colors.disabled} fontWeight="medium">
            {moment(
              Array.isArray(lastMeasurements) && lastMeasurements
                ? lastMeasurements[0]?.date
                : new Date()
            ).fromNow()}
          </Text>
        </Skeleton>
        <Skeleton
          h={ms(20)}
          isLoaded={!isTechnicalLoading}
          mt={ms(5)}
          rounded="full"
          startColor={Colors.light}
        >
          <Progress
            colorScheme={
              fillPct <= 25 ? 'danger' : fillPct <= 50 ? 'warning' : 'primary'
            }
            mt={ms(10)}
            size="md"
            value={isNaN(fillPct) ? 0 : Math.floor(fillPct)}
          />
        </Skeleton>
      </Box>
    )
  }

  const renderEngineCard = () => {
    const pLength = data?.data.length - 1
    return (
      <Box
        bg={Colors.white}
        borderRadius={ms(5)}
        px={ms(15)}
        py={ms(20)}
        shadow={5}
      >
        <HStack alignItems="center">
          <Skeleton
            flex="1"
            h={ms(22)}
            isLoaded={!isTechnicalLoading}
            rounded="full"
            startColor={Colors.light}
            w={ms(100)}
          >
            <Text color={Colors.azure} flex="1" fontWeight="medium">
              {data?.data[pLength]?.type?.title}
            </Text>
          </Skeleton>
          <Skeleton
            h={ms(22)}
            isLoaded={!isTechnicalLoading}
            rounded="full"
            startColor={Colors.light}
            w={ms(100)}
          >
            <Text bold color={Colors.azure} fontSize={ms(16)}>
              {formatNumber(
                Array.isArray(lastMeasurements) && lastMeasurements
                  ? lastMeasurements[0]?.value
                  : 0,
                2,
                ' '
              )}{' '}
              h
            </Text>
          </Skeleton>
        </HStack>
        <Skeleton
          h={ms(22)}
          isLoaded={!isTechnicalLoading}
          mt={ms(5)}
          rounded="full"
          startColor={Colors.light}
          w={ms(100)}
        >
          <Text color={Colors.disabled} fontWeight="medium">
            {moment(
              Array.isArray(lastMeasurements) && lastMeasurements
                ? lastMeasurements[0]?.date
                : new Date()
            ).format('DD/MM/YYYY')}
          </Text>
        </Skeleton>
      </Box>
    )
  }

  const onAddNewConsumptionMeasure = async (newMeasurementValue: string) => {
    const re = / /g
    const measurementVal = convertCommaToPeriod(
      newMeasurementValue.replace(re, '')
    )
    if (measurementVal === '') {
      return showWarningToast('Measurement is required.')
    }
    if (
      hasTechnicalPermission &&
      routeFrom !== 'reservoir' &&
      lastMeasurements.length &&
      measurementVal < lastMeasurements[0]?.value
    ) {
      setOpenConfirmation(true)
      setOpen(false)
      return
    }
    if (
      routeFrom !== 'reservoir' &&
      lastMeasurements.length &&
      measurementVal < lastMeasurements[0]?.value
    ) {
      setInputInvalid(true)
      return
    }
    setOpen(false)
    const selectedId = routeFrom === 'reservoir' ? data?.id : data?.data[0]?.id
    const res = await createNewConsumptionMeasure(selectedId, measurementVal)
    if (res === null) {
      showToast('New Measurement failed.', 'failed')
      return
    }
    setNewMeasurement('')
    if (routeFrom === 'reservoir') {
      getVesselGasoilReservoirs(physicalVesselId)
      getVesselReservoirs(physicalVesselId)
    } else {
      getVesselEngines(physicalVesselId)
    }
    getVesselPartLastMeasurements(selectedId)
    showToast('New measurement added.', 'success')
  }

  const onForceAddMeasurement = async () => {
    const re = / /g
    const measurementVal = convertCommaToPeriod(newMeasurement.replace(re, ''))
    setOpenConfirmation(false)
    setOpen(false)
    const selectedId = routeFrom === 'reservoir' ? data?.id : data?.data[0]?.id
    const res = await createNewConsumptionMeasure(selectedId, measurementVal)
    if (res === null) {
      showToast('New Measurement failed.', 'failed')
      return
    }
    setNewMeasurement('')
    if (routeFrom === 'reservoir') {
      getVesselGasoilReservoirs(physicalVesselId)
      getVesselReservoirs(physicalVesselId)
    } else {
      getVesselEngines(physicalVesselId)
    }
    getVesselPartLastMeasurements(selectedId)
    showToast('New measurement added.', 'success')
  }

  const clearNewmeasurements = () => {
    setInputInvalid(false)
    setNewMeasurement('')
  }

  const handleInputChange = (e: string) => {
    let formatted = ''
    if (e === '') {
      setNewMeasurement(e)
      return
    }
    if (e.includes('.') || e.includes(',')) {
      const re = /,/g
      const tmp = e.replace(re, '.')
      formatted = convertPeriodToComma(tmp)
    } else {
      const re = / /g
      const tmp = e.replace(re, '')
      formatted = formatNumber(tmp, 0, ' ')
    }
    setNewMeasurement(formatted)
  }

  const onAddMeasurement = () => {
    setOpen(true)
    setTimeout(() => {
      inputRef?.current?.blur()
      inputRef?.current?.focus()
    }, 100)
  }
  return (
    <Box
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
      flex="1"
    >
      <NoInternetConnectionMessage />
      <Box flex="1" px={ms(12)} py={ms(20)}>
        {routeFrom === 'reservoir' ? renderReservoirCard() : renderEngineCard()}
        <Text bold color={Colors.text} fontSize={ms(16)} mt={ms(25)}>
          {t('lastMeasurements')}
        </Text>
        <Divider mb={ms(15)} mt={ms(8)} />
        {isTechnicalLoading ? (
          <LoadingAnimated />
        ) : (
          <FlatList
            renderItem={props => (
              <MeasurementCard routeFrom={routeFrom} {...props} />
            )}
            contentContainerStyle={{paddingBottom: 20}}
            data={lastMeasurements}
            keyExtractor={(item: LastMeasurement) => `LastMeasure-${item?.id}`}
          />
        )}
      </Box>
      <Modal
        animationPreset="slide"
        initialFocusRef={inputRef}
        isOpen={open}
        px={ms(15)}
        size="full"
        // onLayout={() =>
        //   setTimeout(() => {
        //     inputRef.current?.blur()
        //     inputRef.current?.focus()
        //   }, 100)
        // }
      >
        <Modal.Content>
          <Modal.Header>
            {routeFrom === 'reservoir'
              ? t('enterNewMeasurements')
              : t('enterNewMeasurementsHour')}
          </Modal.Header>
          <Modal.Body>
            <Input
              ref={inputRef}
              bold
              backgroundColor={Colors.light_grey}
              fontSize={ms(18)}
              height={ms(40)}
              isInvalid={inputInvalid}
              keyboardType="number-pad"
              value={newMeasurement}
              variant="filled"
              onChangeText={e => handleInputChange(e)}
            />
            {inputInvalid && (
              <Text color={Colors.danger} textAlign="center">
                {t('newMeasurementInputError')}
              </Text>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              bg="#E0E0E0"
              flex="1"
              m={ms(5)}
              onPress={() => {
                setOpen(false)
                clearNewmeasurements()
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              bg={Colors.primary}
              flex="1"
              m={ms(5)}
              onPress={() => {
                onAddNewConsumptionMeasure(newMeasurement)
              }}
            >
              {t('save')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal
        animationPreset="slide"
        isOpen={openConfirmation}
        px={ms(15)}
        size="full"
      >
        <Modal.Content>
          <Modal.Header>{t('confirmation')}</Modal.Header>
          <Modal.Body>
            <Text color={Colors.text} fontSize={ms(15)} textAlign="center">
              {t('newMeasurementInputConfirmation')}
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bg="#E0E0E0"
              flex="1"
              m={ms(5)}
              onPress={() => {
                setOpenConfirmation(false)
                setOpen(true)
              }}
            >
              {t('no')}
            </Button>
            <Button
              bg={Colors.primary}
              flex="1"
              m={ms(5)}
              onPress={onForceAddMeasurement}
            >
              {t('yes')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Box bg={Colors.white}>
        <Shadow
          viewStyle={{
            width: '100%',
          }}
        >
          <Button
            bg={Colors.primary}
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            m={ms(16)}
            onPress={onAddMeasurement}
          >
            {t('addAMeasurement')}
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}

export default Measurements
