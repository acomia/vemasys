import React, {useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  ScrollView,
  Select,
  Text
} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import DatePicker from 'react-native-date-picker'

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditNavlogAction = ({navigation, route}: Props) => {
  const {method, navglogAction}: any = route.params
  const {navigationLogDetails} = usePlanning()
  const [navAction, setNavAction] = useState({
    type: '',
    start: null,
    estimated_end: null,
    end: null
  })
  const [cargoHoldActions, setCargoHoldActions] = useState('')
  const [selectedCargoHolds, setSelectedCargoHolds] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [showCargo, setShowCargo] = useState(false)
  const navigationLogActionTypes = [
    {value: 'loading', label: 'Loading'},
    {value: 'unloading', label: 'Unloading'},
    {value: 'cleaning', label: 'Cleaning'}
  ]

  const navigationLogCargoToChoices = (navigationLog: any) => {
    if (
      !navigationLog ||
      !navigationLog?.bulkCargo ||
      navigationLog?.bulkCargo.length === 0
    ) {
      return []
    }

    return navigationLog?.bulkCargo?.map((c: any) => ({
      label: c.type.nameEn || c.type.nameNl,
      value: c.id
    }))
  }

  const DatetimePicker = ({date, onChangeDate, color}: any) => {
    return (
      <HStack
        mt={ms(3)}
        mb={ms(30)}
        bg="#F7F7F7"
        borderRadius={ms(5)}
        p="2"
        alignItems="center"
      >
        <MaterialCommunityIcons
          name="calendar-month-outline"
          size={ms(22)}
          color={color}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            flex: 1,
            marginLeft: 10
          }}
          onPress={onChangeDate}
        >
          <Text
            fontSize={ms(16)}
            fontWeight="medium"
            color={date ? Colors.text : Colors.disabled}
          >
            {date ? moment(date).format('D MMM YYYY') : 'No Date Set'}
          </Text>
        </TouchableOpacity>
        <MaterialIcons name="keyboard-arrow-down" size={ms(22)} />
      </HStack>
    )
  }

  const CargoHoldActions = () => {
    return selectedCargoHolds.length > 0 ? (
      selectedCargoHolds.map((cargo, index) => (
        <HStack alignItems="center" mt={ms(3)}>
          <Select
            key={index}
            defaultValue={cargo.cargo}
            minWidth="280"
            accessibilityLabel=""
            placeholder=""
            bg="#F7F7F7"
            onValueChange={val => {
              setCargoHoldActions(val)
            }}
          >
            {cargoHolds.map((type: any, index: number) => (
              <Select.Item key={index} label={type.label} value={type.value} />
            ))}
          </Select>
          <Button
            bg={Colors.light}
            size="md"
            mx={ms(10)}
            minH={ms(40)}
            onPress={() => setCargoHoldActions([])}
          >
            <Text color={Colors.danger} fontSize={ms(12)} fontWeight="bold">
              Remove
            </Text>
          </Button>
        </HStack>
      ))
    ) : (
      <></>
    )
  }

  const onDatesChange = (date: Date) => {
    if (selectedDate === 'start') {
      setNavAction({...navAction, start: date})
    } else if (selectedDate === 'estimated') {
      setNavAction({...navAction, estimated_end: date})
    } else {
      setNavAction({...navAction, end: date})
    }
  }

  const handleOnAddBulk = () => {
    setShowCargo(true)
    const newData = {cargo: cargoHolds}
    setCargoHoldActions([...cargoHoldActions, newData])
  }

  const cargoHolds = navigationLogCargoToChoices(navigationLogDetails)

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          {method === 'add' ? 'New Action' : 'Edit Action'}
        </Text>

        <Divider my={ms(10)} />
        <Text fontWeight="medium" color={Colors.disabled}>
          Type
        </Text>
        <Select
          minWidth="300"
          accessibilityLabel=""
          placeholder=""
          bg={'#F7F7F7'}
          onValueChange={val => {
            setNavAction({...navAction, type: val})
          }}
          mt={ms(3)}
          mb={ms(15)}
        >
          {navigationLogActionTypes.map((type, index) => (
            <Select.Item key={index} label={type.label} value={type.value} />
          ))}
        </Select>
        <Text fontWeight="medium" color={Colors.disabled}>
          Start
        </Text>
        <DatetimePicker
          date={navAction.start}
          color={Colors.secondary}
          onChangeDate={() => {
            setSelectedDate('start'), setOpenDatePicker(true)
          }}
        />
        <Text fontWeight="medium" color={Colors.disabled}>
          Estimated end
        </Text>
        <DatetimePicker
          date={navAction.estimated_end}
          color={Colors.azure}
          onChangeDate={() => {
            setSelectedDate('estimated'), setOpenDatePicker(true)
          }}
        />
        <Text fontWeight="medium" color={Colors.disabled}>
          End
        </Text>
        <DatetimePicker
          date={navAction.end}
          color={Colors.danger}
          onChangeDate={() => {
            setSelectedDate('end'), setOpenDatePicker(true)
          }}
        />
        <Text fontWeight="medium" color={Colors.disabled}>
          Cargo
        </Text>
        {showCargo ? <CargoHoldActions /> : null}
        <Box alignItems="flex-end">
          <Button
            bg={Colors.primary}
            leftIcon={<Icon as={MaterialIcons} name="add" size="sm" />}
            mt={ms(15)}
            onPress={handleOnAddBulk}
            minW="50%"
          >
            Add bulk
          </Button>
        </Box>
        <DatePicker
          modal
          open={openDatePicker}
          date={new Date()}
          mode="datetime"
          onConfirm={date => {
            setOpenDatePicker(false), onDatesChange(date)
          }}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
        />
      </ScrollView>
      <Box bg={Colors.white} position="absolute" bottom={0} left={0} right={0}>
        <Shadow
          distance={20}
          viewStyle={{
            width: '100%'
          }}
        >
          <HStack>
            <Button
              flex="1"
              m={ms(16)}
              variant="ghost"
              colorScheme="muted"
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
            <Button
              flex="1"
              m={ms(16)}
              bg={Colors.primary}
              // onPress={handleOnCreateNewComment}
            >
              Save
            </Button>
          </HStack>
        </Shadow>
      </Box>
    </Box>
  )
}

export default AddEditNavlogAction
