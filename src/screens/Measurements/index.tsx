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
import {useTechnical} from '@bluecentury/stores'
import {LoadingIndicator} from '@bluecentury/components'

type Props = NativeStackScreenProps<RootStackParamList>
const Measurements = ({navigation, route}: Props) => {
  const {reservoir} = route.params
  const toast = useToast()
  const {
    isTechnicalLoading,
    lastMeasurements,
    getVesselPartLastMeasurements,
    createNewConsumptionMeasure
  } = useTechnical()
  const [newMeasurement, setNewMeasurement] = useState('')
  const [open, setOpen] = useState(false)

  let fillPct = 0
  let value = 0
  let capacity = 0
  let lastMeasurementDate = null
  capacity = reservoir?.capacity === null ? 0 : reservoir?.capacity
  value =
    typeof reservoir?.lastMeasurement?.value === 'undefined'
      ? 0
      : reservoir?.lastMeasurement?.value
  lastMeasurementDate = reservoir?.lastMeasurement?.date
  let used = capacity - value
  fillPct = (used / capacity) * 100 - 100
  fillPct = fillPct < 0 ? fillPct * -1 : fillPct

  useEffect(() => {
    getVesselPartLastMeasurements(reservoir.id)
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

  const renderReservoirCard = () => (
    <Box
      px={ms(15)}
      py={ms(20)}
      shadow={5}
      bg={Colors.white}
      borderRadius={ms(5)}
    >
      <HStack alignItems="center">
        <Text flex={1} color={Colors.azure} fontWeight="medium">
          {reservoir.name}
        </Text>
        <Text color={Colors.azure} fontSize={ms(16)} fontWeight="bold">
          {formatNumber(value, 0)} L (
          {isNaN(fillPct) || fillPct === Infinity ? 0 : Math.floor(fillPct)}
          %)
        </Text>
      </HStack>
      <Text flex={1} color={Colors.disabled} fontWeight="medium">
        {moment(lastMeasurementDate).fromNow()}
      </Text>
      <Progress
        value={isNaN(fillPct) ? 0 : Math.floor(fillPct)}
        mt={ms(10)}
        size="md"
        colorScheme={
          fillPct <= 25 ? 'danger' : fillPct <= 50 ? 'warning' : 'primary'
        }
      />
    </Box>
  )

  const onAddNewConsumptionMeasure = async () => {
    if (newMeasurement === '') {
      return showWarningToast('Measurement is required.')
    }
    setOpen(false)
    const res = await createNewConsumptionMeasure(reservoir.id, newMeasurement)
    if (typeof res === 'object') {
      getVesselPartLastMeasurements(reservoir.id)
      showToast('New measurement added.', 'success')
    } else {
      showToast('New measurement added.', 'success')
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
        {renderReservoirCard()}
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
                      {item.user.firstname} {item.user.lastname}
                    </Text>
                    <Text color={Colors.disabled}>
                      {moment(item.date).format('DD MMM YYYY - HH:mm')}
                    </Text>
                  </Box>
                  <Text fontWeight="bold" color={Colors.highlighted_text}>
                    {formatNumber(item.value, 0)} L
                  </Text>
                </HStack>
              </Box>
            )}
            keyExtractor={(item: any) => `LastMeasure-${item.id}`}
            contentContainerStyle={{paddingBottom: 20}}
          />
        )}
      </Box>
      <Modal isOpen={open} size="full" px={ms(15)} animationPreset="slide">
        <Modal.Content>
          <Modal.Header>Enter new measurement (L)</Modal.Header>
          <Modal.Body>
            <FormControl>
              <Input
                variant="filled"
                backgroundColor="#F7F7F7"
                keyboardType="number-pad"
                size="sm"
                value={newMeasurement}
                onChangeText={e => setNewMeasurement(e)}
              />
            </FormControl>
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
