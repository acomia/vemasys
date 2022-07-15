import React, {useEffect, useState} from 'react'
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
import {useEntity, usePlanning} from '@bluecentury/stores'
import DatePicker from 'react-native-date-picker'
import {titleCase} from '@bluecentury/constants'
import {uniqueId} from 'lodash'
import {LoadingIndicator} from '@bluecentury/components'

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditNavlogAction = ({navigation, route}: Props) => {
  const {method, navlogAction}: any = route.params
  const {
    isPlanningLoading,
    navigationLogActions,
    navigationLogCargoHolds,
    navigationLogDetails
  } = usePlanning()

  const cargoChoices =
    navigationLogDetails && navigationLogDetails?.bulkCargo
      ? navigationLogDetails?.bulkCargo?.map(
          (c: {type: {nameEn: any}; id: any}) => ({
            label: c.type.nameEn,
            value: c.id
          })
        )
      : []

  const {navigationBulk, cargoHoldTransactions} = navigationLogActions
  const [navAction, setNavAction] = useState({
    type: navlogAction !== undefined ? titleCase(navlogAction.type) : '',
    start: navlogAction !== undefined ? navlogAction.start : new Date(),
    estimatedEnd:
      navlogAction !== undefined ? navlogAction.estimatedEnd : new Date(),
    end: navlogAction !== undefined ? navlogAction.end : new Date(),
    cargoHoldActions:
      cargoHoldTransactions && cargoHoldTransactions.length > 0
        ? cargoHoldTransactions.map(cht => {
            return {
              navigationBulk: navigationBulk ? navigationBulk.id : 0,
              cargoHoldTransactions: navigationLogCargoHolds.map(cargoHold => ({
                id: cargoHold.id,
                amount:
                  cht.cargoHold.id == cargoHold.id ? cht.amount.toString() : '0'
              }))
            }
          })
        : [
            {
              navigationBulk: navigationBulk
                ? navigationBulk.id
                : cargoChoices.length
                ? cargoChoices[0].value
                : 0,
              cargoHoldTransactions: navigationLogCargoHolds.map(cargoHold => ({
                id: cargoHold.id,
                amount: '0'
              }))
            }
          ]
  })

  const [cargoHoldActions, setCargoHoldActions] = useState([])
  const [selectedCargoHolds, setSelectedCargoHolds] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [showCargo, setShowCargo] = useState(false)
  const navigationLogActionTypes = [
    {value: 'loading', label: 'Loading'},
    {value: 'unloading', label: 'Unloading'},
    {value: 'cleaning', label: 'Cleaning'}
  ]

  const cargoHoldsToTransactions = (cargoHolds: any[]) => {
    return cargoHolds
      ? cargoHolds.map(cargoHold => ({
          id: cargoHold.id,
          amount: '0'
        }))
      : []
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
    return cargoHoldActions.length > 0
      ? cargoHoldActions.map((cargoHold, index) => (
          <HStack key={index} alignItems="center" mb={ms(10)}>
            <Select
              minWidth="280"
              bg="#F7F7F7"
              onValueChange={val => {
                setSelectedCargoHolds(val)
              }}
              selectedValue={selectedCargoHolds}
            >
              {cargoChoices.map((type: any, index: number) => (
                <Select.Item
                  key={index}
                  label={type.label}
                  value={type.value}
                />
              ))}
            </Select>
            <Button
              bg={Colors.light}
              size="md"
              mx={ms(10)}
              minH={ms(40)}
              // onPress={() => setCargoHoldActions([])}
            >
              <Text
                color={Colors.danger}
                fontSize={ms(12)}
                fontWeight="bold"
                onPress={() => onRemoveCargoEntry(cargoHold.id)}
              >
                Remove
              </Text>
            </Button>
          </HStack>
        ))
      : null
  }

  const onDatesChange = (date: Date) => {
    if (selectedDate === 'start') {
      setNavAction({...navAction, start: date})
    } else if (selectedDate === 'estimated') {
      setNavAction({...navAction, estimatedEnd: date})
    } else {
      setNavAction({...navAction, end: date})
    }
  }

  const onRemoveCargoEntry = (id: string) => {
    const remove = cargoHoldActions.filter(cargo => cargo.id !== id)
    setCargoHoldActions(remove)
  }

  const handleOnAddBulk = () => {
    setShowCargo(true)
    const navigationBulk = cargoChoices.length ? cargoChoices[0].value : 0
    const cargohHoldTransactions = cargoHoldsToTransactions(
      navigationLogCargoHolds
    )
    const newCargoHolds = {
      navigationBulk,
      cargoHoldTransactions: cargohHoldTransactions
    }

    setCargoHoldActions([...cargoHoldActions, newCargoHolds])
  }

  if (isPlanningLoading) return <LoadingIndicator />
  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
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
          placeholder={navAction.type}
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
          date={navAction.estimatedEnd}
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
        <Text fontWeight="medium" color={Colors.disabled} mb={ms(5)}>
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
      <Box bg={Colors.white}>
        <Shadow
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
