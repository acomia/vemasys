import React, { useEffect, useState } from 'react'
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
import { StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import { Shadow } from 'react-native-shadow-2'
import { ms } from 'react-native-size-matters'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { formatNumber } from '@bluecentury/constants'
import { useEntity, useTechnical } from '@bluecentury/stores'
import { LoadingAnimated } from '@bluecentury/components'
import { Colors } from '@bluecentury/styles'
import { MeasurementCard } from './measurement-card'
import { useTranslation } from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList>
const Measurements = ({ navigation, route }: Props) => {
  const { t } = useTranslation()
  const { data, routeFrom } = route.params
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
  const { physicalVesselId } = useEntity()
  const [newMeasurement, setNewMeasurement] = useState('')
  const [open, setOpen] = useState(false)
  const [inputInvalid, setInputInvalid] = useState(false)
  useEffect(() => {
    getVesselPartLastMeasurements(
      routeFrom === 'reservoir' ? data?.id : data?.data[0]?.id
    )
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
              {formatNumber(value, 0, ' ')} L (
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
                0,
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

  const onAddNewConsumptionMeasure = async () => {
    if (newMeasurement === '') {
      return showWarningToast('Measurement is required.')
    }

    if (
      lastMeasurements.length &&
      newMeasurement < lastMeasurements[0]?.value
    ) {
      setInputInvalid(true)
      return
    }

    const selectedId = routeFrom === 'reservoir' ? data?.id : data?.data[0]?.id
    setOpen(false)
    const res = await createNewConsumptionMeasure(selectedId, newMeasurement)
    if (res === null) {
      showToast('New Measurement failed.', 'failed')
      return
    }
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

  return (
    <Box
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
      flex="1"
    >
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
            contentContainerStyle={{ paddingBottom: 20 }}
            data={lastMeasurements}
            keyExtractor={(item: any) => `LastMeasure-${item?.id}`}
          />
        )}
      </Box>
      <Modal animationPreset="slide" isOpen={open} px={ms(15)} size="full">
        <Modal.Content>
          <Modal.Header>{t('enterNewMeasurements')}</Modal.Header>
          <Modal.Body>
            <Input
              bold
              backgroundColor="#F7F7F7"
              fontSize={ms(15)}
              height={ms(40)}
              isInvalid={inputInvalid}
              keyboardType="number-pad"
              value={newMeasurement}
              variant="filled"
              onChangeText={e => setNewMeasurement(e)}
            />
            {inputInvalid && (
              <Text style={styles.error}>{t('newMeasurementInputError')}</Text>
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
              onPress={onAddNewConsumptionMeasure}
            >
              {t('save')}
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
            onPress={() => setOpen(true)}
          >
            {t('addAMeasurement')}
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
    textAlign: 'center',
  },
})

export default Measurements
