import React, {useEffect, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Box,
  Button,
  Divider,
  HStack,
  Image,
  Input,
  Modal,
  ScrollView,
  Select,
  Text,
  useToast,
} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import DatePicker from 'react-native-date-picker'

import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {formatBulkTypeLabel, titleCase} from '@bluecentury/constants'
import {IconButton, LoadingAnimated} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditNavlogAction = ({navigation, route}: Props) => {
  const {method, actionType, navlogAction}: any = route.params
  const toast = useToast()
  const {
    isPlanningLoading,
    navigationLogDetails,
    createNavigationLogAction,
    isCreateNavLogActionSuccess,
    updateNavigationLogAction,
    isUpdateNavLogActionSuccess,
    deleteNavLogAction,
    isDeleteNavLogActionSuccess,
    reset,
    updateBulkCargo,
    navigationLogActions,
  } = usePlanning()

  const cargoChoices =
    navigationLogDetails?.bulkCargo.length > 0
      ? navigationLogDetails?.bulkCargo?.map(
          (c: {type: {nameEn: any}; id: any}) => ({
            label: formatBulkTypeLabel(c.type),
            value: c.id,
          })
        )
      : []

  const [navActionDetails, setNavActionDetails] = useState({
    type:
      navlogAction !== undefined ? titleCase(navlogAction.type) : actionType,
    start: navlogAction !== undefined ? navlogAction.start : '',
    estimatedEnd: navlogAction !== undefined ? navlogAction.estimatedEnd : '',
    end: navlogAction !== undefined ? navlogAction.end : '',
    cargoHoldActions:
      navlogAction !== undefined
        ? [
            {
              navigationBulk: navlogAction?.navigationBulk?.id,
              amount: navlogAction?.navigationBulk?.actualAmount.toString(),
            },
          ]
        : [
            {
              navigationBulk: navigationLogDetails?.bulkCargo[0]?.id,
              amount: '0',
            },
          ],
  })
  const [selectedCargo, setSelectedCargo] = useState(
    navlogAction !== undefined ? navlogAction?.navigationBulk?.id : ''
  )
  const [selectedDate, setSelectedDate] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [actionMethod, setActionMethod] = useState('Add')
  const [newBulkCargoData, setNewBulkCargoData] = useState({})

  const dateTimeHeight = useSharedValue(method === 'edit' ? 190 : 0)
  const dateTimeOpacity = useSharedValue(method === 'edit' ? 1 : 0)
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      height: dateTimeHeight.value,
      opacity: dateTimeOpacity.value,
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        method === 'edit' && (
          <IconButton
            source={Icons.trash}
            onPress={() => {
              setConfirmModal(true), setActionMethod('Delete')
            }}
            size={22}
          />
        ),
    })
  }, [])

  useEffect(() => {
    if (isCreateNavLogActionSuccess) {
      updateBulkCargo(newBulkCargoData)
      showToast('Action added.', 'success')
    }
    if (isUpdateNavLogActionSuccess) {
      updateBulkCargo(newBulkCargoData)
      showToast('Action updated.', 'success')
    }
    if (isDeleteNavLogActionSuccess) {
      showToast('Action deleted.', 'success')
    }
  }, [
    isCreateNavLogActionSuccess,
    isUpdateNavLogActionSuccess,
    isDeleteNavLogActionSuccess,
  ])

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
      },
      onCloseComplete() {
        res === 'success' ? onSuccess() : null
      },
    })
  }

  const onSuccess = () => {
    reset()
    navigation.goBack()
  }

  const renderActionTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'unloading':
        return Icons.unloading
      case 'loading':
        return Icons.loading
      case 'cleaning':
        return Icons.broom
      default:
        break
    }
  }

  const renderActionType = () => {
    return (
      <HStack
        mt={ms(3)}
        mb={ms(30)}
        bg="#F7F7F7"
        borderRadius={ms(5)}
        p="2"
        alignItems="center"
      >
        <Image
          alt="navlog-action-animated"
          source={renderActionTypeIcon(actionType)}
          width={ms(40)}
          resizeMode="contain"
          mr={ms(10)}
        />
        <Text fontSize={ms(16)} fontWeight="bold" color={Colors.text}>
          {actionType}
        </Text>
      </HStack>
    )
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
            marginLeft: 10,
          }}
          onPress={onChangeDate}
        >
          <Text
            fontSize={ms(16)}
            fontWeight="medium"
            color={date ? Colors.text : Colors.disabled}
          >
            {date
              ? moment(date).format('D MMM YYYY | HH:mm')
              : 'No Date & Time Set'}
          </Text>
        </TouchableOpacity>
        <MaterialIcons name="keyboard-arrow-down" size={ms(22)} />
      </HStack>
    )
  }

  const renderCargoHoldActions = () => {
    const {nameEn, nameNl}: BulkType = navigationLogDetails?.bulkCargo[0]?.type
    return (
      <HStack alignItems="center" mb={ms(10)}>
        <Box flex="2" mr={ms(10)}>
          <Text fontWeight="medium" color={Colors.disabled} mb={ms(6)}>
            Cargo
          </Text>
          {navigationLogDetails?.bulkCargo?.length > 1 ? (
            <Select
              flex="1"
              bg="#F7F7F7"
              onValueChange={val => onSelectCargo(val)}
              selectedValue={selectedCargo}
            >
              {cargoChoices.map((type: any, index: number) => (
                <Select.Item
                  key={index}
                  label={type.label}
                  value={type.value}
                />
              ))}
            </Select>
          ) : (
            <Box bg="#F7F7F7" borderRadius={ms(5)} py="3" px="1">
              <Text numberOfLines={1} ellipsizeMode="tail" color={Colors.text}>
                {nameEn || nameNl}
              </Text>
            </Box>
          )}
        </Box>
        <Box flex="1">
          <Text fontWeight="medium" color={Colors.disabled} mb={ms(6)}>
            Amount
          </Text>
          <Input
            bg="#F7F7F7"
            onChangeText={val => onChangeAmount(val)}
            value={navActionDetails.cargoHoldActions[0].amount}
            keyboardType="number-pad"
            height={ms(40)}
            fontSize={ms(15)}
            fontWeight="bold"
          />
        </Box>
      </HStack>
    )
  }

  const onChangeAmount = (val: string) => {
    const newArr = navActionDetails.cargoHoldActions
    newArr[0].amount = val
    setNavActionDetails({...navActionDetails, cargoHoldActions: newArr})
  }

  const onDatesChange = (date: Date) => {
    if (selectedDate === 'start') {
      dateTimeHeight.value = withTiming(190, {duration: 800})
      dateTimeOpacity.value = withTiming(1)
      setNavActionDetails({...navActionDetails, start: date})
    } else if (selectedDate === 'estimated') {
      setNavActionDetails({...navActionDetails, estimatedEnd: date})
    } else {
      setNavActionDetails({...navActionDetails, end: date})
    }
  }

  const onSelectCargo = (cargo: any) => {
    setSelectedCargo(cargo)
    const navigationBulk = cargo
    const newCargoHolds = {
      navigationBulk,
      amount: navActionDetails.cargoHoldActions[0].amount,
    }
    setNavActionDetails({
      ...navActionDetails,
      cargoHoldActions: [newCargoHolds],
    })
  }

  const confirmSave = () => {
    setConfirmModal(true)
    method === 'add' ? setActionMethod('add') : setActionMethod('update')
  }

  const handleSaveAction = () => {
    const bulkCargo = navigationLogDetails?.bulkCargo?.find(
      cargo => cargo.id === navActionDetails.cargoHoldActions[0].navigationBulk
    )
    const newBulkCargoAmount =
      navigationLogActions?.length >= 1 && method === 'add'
        ? Number(bulkCargo?.actualAmount) +
          Number(navActionDetails.cargoHoldActions[0].amount)
        : Number(navActionDetails.cargoHoldActions[0].amount)
    setNewBulkCargoData({
      id: bulkCargo?.id,
      typeId: bulkCargo?.type?.id,
      amount: bulkCargo?.amount,
      actualAmount: newBulkCargoAmount,
      isLoading: bulkCargo?.isLoading ? '1' : '0',
    })
    if (method === 'add') {
      createNavigationLogAction(navigationLogDetails?.id, navActionDetails)
    } else {
      updateNavigationLogAction(
        navlogAction?.id,
        navigationLogDetails?.id,
        navActionDetails
      )
    }
  }

  const onDeleteNavLogAction = () => {
    deleteNavLogAction(navlogAction?.id)
  }

  const onActionConfirmed = () => {
    setConfirmModal(false)
    actionMethod === 'add' || actionMethod === 'update'
      ? handleSaveAction()
      : onDeleteNavLogAction()
  }

  if (isPlanningLoading) return <LoadingAnimated />
  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          {actionType} Action
        </Text>

        <Divider my={ms(10)} />
        <Text fontWeight="medium" color={Colors.disabled}>
          Action
        </Text>
        {/* {renderActionsType()} */}
        {renderActionType()}
        <Text fontWeight="medium" color={Colors.disabled}>
          Start
        </Text>
        <DatetimePicker
          date={navActionDetails.start}
          color={Colors.secondary}
          onChangeDate={() => {
            setSelectedDate('start'), setOpenDatePicker(true)
          }}
        />
        <Animated.View
          style={[{opacity: dateTimeHeight.value > 0 ? 1 : 0}, reanimatedStyle]}
        >
          <Text fontWeight="medium" color={Colors.disabled}>
            Estimated end
          </Text>
          <DatetimePicker
            date={navActionDetails.estimatedEnd}
            color={Colors.azure}
            onChangeDate={() => {
              setSelectedDate('estimated'), setOpenDatePicker(true)
            }}
          />
          <Text fontWeight="medium" color={Colors.disabled}>
            End
          </Text>
          <DatetimePicker
            date={navActionDetails.end}
            color={Colors.danger}
            onChangeDate={() => {
              setSelectedDate('end'), setOpenDatePicker(true)
            }}
          />
        </Animated.View>
        {actionType === 'Cleaning' ? null : renderCargoHoldActions()}
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
            width: '100%',
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
              onPress={() => confirmSave()}
            >
              Save
            </Button>
          </HStack>
        </Shadow>
      </Box>
      <Modal
        isOpen={confirmModal}
        size="full"
        px={ms(12)}
        animationPreset="slide"
      >
        <Modal.Content>
          <Modal.Header>Confirmation</Modal.Header>
          <Text my={ms(20)} mx={ms(12)} fontWeight="medium">
            Are you sure you want to {actionMethod.toLowerCase()} this action?
          </Text>
          <HStack>
            <Button
              flex="1"
              m={ms(12)}
              bg={Colors.grey}
              onPress={() => setConfirmModal(false)}
            >
              <Text fontWeight="medium" color={Colors.disabled}>
                Cancel
              </Text>
            </Button>
            <Button
              flex="1"
              m={ms(12)}
              bg={
                actionMethod.toLowerCase() === 'add' ||
                actionMethod.toLowerCase() === 'update'
                  ? Colors.primary
                  : Colors.danger
              }
              onPress={onActionConfirmed}
            >
              <Text fontWeight="medium" color={Colors.white}>
                {actionMethod.toLowerCase() === 'add' ||
                actionMethod.toLowerCase() === 'update'
                  ? 'Save'
                  : 'Delete'}
              </Text>
            </Button>
          </HStack>
        </Modal.Content>
      </Modal>
    </Box>
  )
}

export default AddEditNavlogAction
