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
import {Vemasys} from '@bluecentury/helpers'
import {useTranslation} from "react-i18next"

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditNavlogAction = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {method, actionType, navlogAction}: any = route.params
  const toast = useToast()
  const {
    isPlanningDetailsLoading,
    isPlanningActionsLoading,
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
    getNavigationLogActions,
    getNavigationLogDetails,
    updateNavlogDates,
  } = usePlanning()

  let cargoChoices: any = []
  if (navigationLogDetails?.bulkCargo.length > 0) {
    cargoChoices = navigationLogDetails?.bulkCargo?.map(
      (c: {type: {nameEn: any}; id: any}) => ({
        label: formatBulkTypeLabel(c.type),
        value: c.id,
      })
    )
  }
  let earliest: {start: string | number | Date} | null = null
  if (navigationLogActions.length > 0) {
    earliest = navigationLogActions?.reduce((previous, current) => {
      return new Date(current.start) < new Date(previous.start)
        ? current
        : previous
    })
  }

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
              amount:
                navlogAction?.navigationBulk?.actualAmount !== null
                  ? navlogAction?.navigationBulk?.actualAmount.toString()
                  : '0',
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
              setConfirmModal(true)
              setActionMethod('Delete')
            }}
            size={22}
          />
        ),
    })
  }, [])

  useEffect(() => {
    if (isCreateNavLogActionSuccess) {
      updateBulkCargo(newBulkCargoData)
      if (
        earliest !== null &&
        new Date(earliest.start) < new Date(navActionDetails.start)
      ) {
        if (!navigationLogDetails) return
        updateNavlogDates(navigationLogDetails?.id, {
          announcedDatetime: earliest.start,
          startActionDatetime: navActionDetails.start,
        })
      } else {
        if (!navigationLogDetails) return
        updateNavlogDates(navigationLogDetails?.id, {
          announcedDatetime: navActionDetails.start,
          startActionDatetime: navActionDetails.start,
        })
      }

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
    getNavigationLogDetails(navigationLogDetails?.id)
    getNavigationLogActions(navigationLogDetails?.id)
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
        <Text fontSize={ms(16)} bold color={Colors.text}>
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
              : t('noDate&TimeSet')}
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
            {t('cargo')}
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
            {t('amount')}
          </Text>
          <Input
            bg="#F7F7F7"
            onChangeText={val => onChangeAmount(val)}
            value={navActionDetails.cargoHoldActions[0].amount}
            keyboardType="number-pad"
            height={ms(40)}
            fontSize={ms(15)}
            bold
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
    const formattedDate = Vemasys.formatDate(date)
    if (selectedDate === 'start') {
      dateTimeHeight.value = withTiming(190, {duration: 800})
      dateTimeOpacity.value = withTiming(1)
      setNavActionDetails({...navActionDetails, start: formattedDate})
    } else if (selectedDate === 'estimated') {
      setNavActionDetails({...navActionDetails, estimatedEnd: formattedDate})
    } else {
      setNavActionDetails({...navActionDetails, end: formattedDate})
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
    if (
      new Date(navActionDetails.start) <
      new Date(navigationLogDetails?.announcedDatetime)
    ) {
      showToast('Start loading/unloading can’t be before start NOR', 'failed')
      return
    }
    const bulkCargo = navigationLogDetails?.bulkCargo?.find(
      cargo => cargo.id === navActionDetails.cargoHoldActions[0].navigationBulk
    )
    let newBulkCargoAmount: number = Number(
      navActionDetails.cargoHoldActions[0].amount
    )
    if (
      navigationLogActions &&
      navigationLogActions.length > 0 &&
      method === 'add'
    ) {
      newBulkCargoAmount += Number(bulkCargo?.actualAmount)
    }
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

  if (isPlanningDetailsLoading || isPlanningActionsLoading)
    return <LoadingAnimated />
  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text fontSize={ms(20)} bold color={Colors.azure}>
          {actionType} {t('action')}
        </Text>

        <Divider my={ms(10)} />
        <Text fontWeight="medium" color={Colors.disabled}>
          {t('action')}
        </Text>
        {/* {renderActionsType()} */}
        {renderActionType()}
        <Text fontWeight="medium" color={Colors.disabled}>
          {t('startText')}
        </Text>
        <DatetimePicker
          date={navActionDetails.start}
          color={Colors.secondary}
          onChangeDate={() => {
            setSelectedDate('start')
            setOpenDatePicker(true)
          }}
        />
        <Animated.View
          style={[{opacity: dateTimeHeight.value > 0 ? 1 : 0}, reanimatedStyle]}
        >
          <Text fontWeight="medium" color={Colors.disabled}>
            {t('estimatedEnd')}
          </Text>
          <DatetimePicker
            date={navActionDetails.estimatedEnd}
            color={Colors.azure}
            onChangeDate={() => {
              setSelectedDate('estimated')
              setOpenDatePicker(true)
            }}
          />
          <Text fontWeight="medium" color={Colors.disabled}>
            {t('endText')}
          </Text>
          <DatetimePicker
            date={navActionDetails.end}
            color={Colors.danger}
            onChangeDate={() => {
              setSelectedDate('end')
              setOpenDatePicker(true)
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
            setOpenDatePicker(false)
            onDatesChange(date)
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
              {t('cancel')}
            </Button>
            <Button
              flex="1"
              m={ms(16)}
              bg={Colors.primary}
              onPress={() => confirmSave()}
            >
              {t('save')}
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
                {t('cancel')}
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
                  ? t('save')
                  : t('delete')}
              </Text>
            </Button>
          </HStack>
        </Modal.Content>
      </Modal>
    </Box>
  )
}

export default AddEditNavlogAction
