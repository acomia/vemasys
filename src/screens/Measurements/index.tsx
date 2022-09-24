import React, {useEffect, useState} from 'react'
import {
  Box,
  Button,
  Divider,
  FlatList,
  FormControl,
  HStack,
  Icon,
  Input,
  Modal,
  Progress,
  Skeleton,
  Text,
  useToast
} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {formatNumber} from '@bluecentury/constants'
import moment from 'moment'
import {Shadow} from 'react-native-shadow-2'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {LoadingIndicator} from '@bluecentury/components'

type Props = NativeStackScreenProps<RootStackParamList>
const Measurements = ({navigation, route}: Props) => {
  const {data, routeFrom} = route.params
  const toast = useToast()
  const {
    isTechnicalLoading,
    lastMeasurements,
    getVesselPartLastMeasurements,
    createNewConsumptionMeasure,
    getVesselGasoilReservoirs,
    getVesselEngines,
    getVesselReservoirs
  } = useTechnical()
  const {physicalVesselId} = useEntity()
  const [newMeasurement, setNewMeasurement] = useState('')
  const [open, setOpen] = useState(false)

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
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            color={Colors.white}
          >
            {text}
          </Text>
        )
      }
    })
  }

  const showWarningToast = (text: string) => {
    toast.show({
      duration: 1000,
      render: () => {
        return (
          <Text
            bg="warning.500"
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            color={Colors.white}
          >
            {text}
          </Text>
        )
      }
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
        px={ms(15)}
        py={ms(20)}
        shadow={5}
        bg={Colors.white}
        borderRadius={ms(5)}
      >
        <HStack alignItems="center">
          <Skeleton
            flex={1}
            h={ms(22)}
            w={ms(100)}
            rounded="full"
            isLoaded={!isTechnicalLoading}
            startColor={Colors.light}
          >
            <Text flex={1} color={Colors.azure} fontWeight="medium">
              {data?.name}
            </Text>
          </Skeleton>
          <Skeleton
            h={ms(22)}
            w={ms(100)}
            rounded="full"
            isLoaded={!isTechnicalLoading}
            startColor={Colors.light}
          >
            <Text color={Colors.azure} fontSize={ms(16)} fontWeight="bold">
              {formatNumber(value, 0)} L (
              {isNaN(fillPct) || fillPct === Infinity ? 0 : Math.floor(fillPct)}
              %)
            </Text>
          </Skeleton>
        </HStack>
        <Skeleton
          h={ms(22)}
          w={ms(100)}
          rounded="full"
          isLoaded={!isTechnicalLoading}
          startColor={Colors.light}
          mt={ms(5)}
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
          rounded="full"
          isLoaded={!isTechnicalLoading}
          startColor={Colors.light}
          mt={ms(5)}
        >
          <Progress
            value={isNaN(fillPct) ? 0 : Math.floor(fillPct)}
            mt={ms(10)}
            size="md"
            colorScheme={
              fillPct <= 25 ? 'danger' : fillPct <= 50 ? 'warning' : 'primary'
            }
          />
        </Skeleton>
      </Box>
    )
  }

  const renderEngineCard = () => {
    const pLength = data?.data.length - 1
    return (
      <Box
        px={ms(15)}
        py={ms(20)}
        shadow={5}
        bg={Colors.white}
        borderRadius={ms(5)}
      >
        <HStack alignItems="center">
          <Skeleton
            flex={1}
            h={ms(22)}
            w={ms(100)}
            rounded="full"
            isLoaded={!isTechnicalLoading}
            startColor={Colors.light}
          >
            <Text flex={1} color={Colors.azure} fontWeight="medium">
              {data?.data[pLength]?.type?.title}
            </Text>
          </Skeleton>
          <Skeleton
            h={ms(22)}
            w={ms(100)}
            rounded="full"
            isLoaded={!isTechnicalLoading}
            startColor={Colors.light}
          >
            <Text color={Colors.azure} fontSize={ms(16)} fontWeight="bold">
              {formatNumber(
                Array.isArray(lastMeasurements) && lastMeasurements
                  ? lastMeasurements[0]?.value
                  : 0,
                0
              )}{' '}
              h
            </Text>
          </Skeleton>
        </HStack>
        <Skeleton
          h={ms(22)}
          w={ms(100)}
          rounded="full"
          isLoaded={!isTechnicalLoading}
          startColor={Colors.light}
          mt={ms(5)}
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
    const selectedId = routeFrom === 'reservoir' ? data?.id : data?.data[0]?.id
    setOpen(false)
    const res = await createNewConsumptionMeasure(selectedId, newMeasurement)
    if (typeof res === 'object' && res?.id) {
      if (routeFrom === 'reservoir') {
        getVesselGasoilReservoirs(physicalVesselId)
        getVesselReservoirs(physicalVesselId)
      } else {
        getVesselEngines(physicalVesselId)
      }
      getVesselPartLastMeasurements(selectedId)
      showToast('New measurement added.', 'success')
    } else {
      showToast('New measurement failed.', 'failed')
    }
  }

  return (
    <Box
      flex="1"
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
    >
      <Box flex="1" px={ms(12)} py={ms(20)}>
        {routeFrom === 'reservoir' ? renderReservoirCard() : renderEngineCard()}
        <Text
          fontSize={ms(16)}
          fontWeight="bold"
          color={Colors.text}
          mt={ms(25)}
        >
          Last Measurements
        </Text>
        <Divider mt={ms(8)} mb={ms(15)} />
        {isTechnicalLoading ? (
          <LoadingIndicator />
        ) : (
          <FlatList
            data={lastMeasurements}
            renderItem={({item, index}) => (
              <Box
                key={index}
                borderRadius={ms(5)}
                bg={Colors.white}
                borderWidth={1}
                borderColor={Colors.light}
                shadow={2}
                py={ms(12)}
                px={ms(14)}
                mb={ms(7)}
              >
                <HStack alignItems="center">
                  <Box flex="1">
                    <Text fontWeight="medium" color={Colors.text}>
                      {item?.user?.firstname} {item?.user?.lastname}
                    </Text>
                    <Text color={Colors.disabled}>
                      {moment(item?.date).format('DD MMM YYYY - HH:mm')}
                    </Text>
                  </Box>
                  <Text fontWeight="bold" color={Colors.highlighted_text}>
                    {formatNumber(item?.value, 0)}{' '}
                    {routeFrom === 'reservoir' ? 'L' : 'h'}
                  </Text>
                </HStack>
              </Box>
            )}
            keyExtractor={(item: any) => `LastMeasure-${item?.id}`}
            contentContainerStyle={{paddingBottom: 20}}
          />
        )}
      </Box>
      <Modal isOpen={open} size="full" px={ms(15)} animationPreset="slide">
        <Modal.Content>
          <Modal.Header>Enter new measurement (L)</Modal.Header>
          <Modal.Body>
            <Input
              variant="filled"
              backgroundColor="#F7F7F7"
              keyboardType="number-pad"
              size="sm"
              value={newMeasurement}
              onChangeText={e => setNewMeasurement(e)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              bg="#E0E0E0"
              m={ms(5)}
              onPress={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              flex="1"
              bg={Colors.primary}
              m={ms(5)}
              onPress={onAddNewConsumptionMeasure}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Box bg={Colors.white}>
        <Shadow
          viewStyle={{
            width: '100%'
          }}
        >
          <Button
            m={ms(16)}
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            bg={Colors.primary}
            onPress={() => setOpen(true)}
          >
            Add a measurement
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}

export default Measurements
