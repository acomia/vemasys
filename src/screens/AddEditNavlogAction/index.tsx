import React, {useEffect, useState} from 'react'
import {TouchableOpacity, Keyboard} from 'react-native'
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
import {
  IconButton,
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Vemasys} from '@bluecentury/helpers'
import {useTranslation} from 'react-i18next'

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
  let earliest: {start: string | number | Date} | null = null

  const initialDidValueChange = {
    start: {didUpdate: false},
    estimated: {didUpdate: false},
    end: {didUpdate: false},
    amount: {didUpdate: false},
  }

  const [didValueChange, setDidValueChange] = useState(initialDidValueChange)

  const unsavedChanges = Object.values(didValueChange).filter(
    value => value.didUpdate === true
  )

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
            size={22}
            source={Icons.trash}
            onPress={() => {
              setConfirmModal(true)
              setActionMethod('Delete')
            }}
          />
        ),
    })
    /* eslint-disable react-native/no-inline-styles */
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])

  useEffect(() => {
    if (navigationLogDetails?.bulkCargo.length > 0) {
      cargoChoices = navigationLogDetails?.bulkCargo?.map(
        (c: {type: BulkType; id: number}) => ({
          label: formatBulkTypeLabel(c.type),
          value: c.id,
        })
      )
    }
    if (navigationLogActions.length > 0) {
      earliest = navigationLogActions?.reduce((previous, current) => {
        return new Date(current.start) < new Date(previous.start)
          ? current
          : previous
      })
    }
  }, [navigationLogActions, navigationLogDetails])

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
      onCloseComplete() {
        res === 'success' ? onSuccess() : null
      },
    })
  }

  const onSuccess = () => {
    reset()
    setDidValueChange(initialDidValueChange)
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
        alignItems="center"
        bg={Colors.light_grey}
        borderRadius={ms(5)}
        mb={ms(30)}
        mt={ms(3)}
        p="2"
      >
        <Image
          alt="navlog-action-animated"
          mr={ms(10)}
          resizeMode="contain"
          source={renderActionTypeIcon(actionType)}
          width={ms(40)}
        />
        <Text bold color={Colors.text} fontSize={ms(16)}>
          {actionType}
        </Text>
      </HStack>
    )
  }

  const DatetimePicker = ({date, onChangeDate, color}: any) => {
    return (
      <HStack
        alignItems="center"
        bg={Colors.light_grey}
        borderRadius={ms(5)}
        mb={ms(30)}
        mt={ms(3)}
        p="2"
      >
        <MaterialCommunityIcons
          color={color}
          name="calendar-month-outline"
          size={ms(22)}
        />
        <TouchableOpacity
          style={{
            flex: 1,
            marginLeft: 10,
          }}
          activeOpacity={0.7}
          onPress={onChangeDate}
        >
          <Text
            color={date ? Colors.text : Colors.disabled}
            fontSize={ms(16)}
            fontWeight="medium"
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
          <Text color={Colors.disabled} fontWeight="medium" mb={ms(6)}>
            {t('cargo')}
          </Text>
          {navigationLogDetails?.bulkCargo?.length > 1 ? (
            <Select
              bg={Colors.light_grey}
              flex="1"
              selectedValue={selectedCargo}
              onValueChange={val => onSelectCargo(val)}
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
            <Box bg={Colors.light_grey} borderRadius={ms(5)} px="1" py="3">
              <Text color={Colors.text} ellipsizeMode="tail" numberOfLines={1}>
                {nameEn || nameNl}
              </Text>
            </Box>
          )}
        </Box>
        <Box flex="1">
          <Text color={Colors.disabled} fontWeight="medium" mb={ms(6)}>
            {t('amount')}
          </Text>
          <Input
            bold
            value={navActionDetails.cargoHoldActions[0].amount
              .toString()
              .replace('.', ',')}
            bg={Colors.light_grey}
            fontSize={ms(15)}
            height={ms(40)}
            keyboardType="decimal-pad"
            onBlur={() => Keyboard.dismiss()}
            onChangeText={val => onChangeAmount(val)}
          />
        </Box>
      </HStack>
    )
  }

  const onChangeAmount = (val: string) => {
    setDidValueChange({...didValueChange, amount: {didUpdate: true}})
    const newArr = navActionDetails.cargoHoldActions
    newArr[0].amount = val.replace(',', '.')
    setNavActionDetails({...navActionDetails, cargoHoldActions: newArr})
  }

  const onDatesChange = (date: Date) => {
    const formattedDate = Vemasys.formatDate(date)

    switch (selectedDate) {
      case 'start':
        dateTimeHeight.value = withTiming(190, {duration: 800})
        dateTimeOpacity.value = withTiming(1)
        setNavActionDetails({...navActionDetails, start: formattedDate})
        setDidValueChange({...didValueChange, start: {didUpdate: true}})
        return
      case 'estimated':
        setNavActionDetails({...navActionDetails, estimatedEnd: formattedDate})
        setDidValueChange({...didValueChange, estimated: {didUpdate: true}})
        return
      case 'end':
        setNavActionDetails({...navActionDetails, end: formattedDate})
        setDidValueChange({...didValueChange, end: {didUpdate: true}})
        return
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
    let newBulkCargoAmount = Number(navActionDetails.cargoHoldActions[0].amount)
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

  if (isPlanningDetailsLoading || isPlanningActionsLoading) {
    return <LoadingAnimated />
  }
  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        bg={Colors.white}
        contentContainerStyle={{flexGrow: 1}}
      >
        <Box flex={1} px={ms(12)} py={ms(20)}>
          <Text bold color={Colors.azure} fontSize={ms(20)}>
            {actionType} {t('action')}
          </Text>

          <Divider my={ms(10)} />
          <Text color={Colors.disabled} fontWeight="medium">
            {t('action')}
          </Text>
          {/* {renderActionsType()} */}
          {renderActionType()}
          <Text color={Colors.disabled} fontWeight="medium">
            {t('startText')}
          </Text>
          <DatetimePicker
            color={Colors.secondary}
            date={navActionDetails.start}
            onChangeDate={() => {
              setSelectedDate('start')
              setOpenDatePicker(true)
            }}
          />
          <Animated.View
            style={[
              {opacity: dateTimeHeight.value > 0 ? 1 : 0},
              reanimatedStyle,
            ]}
          >
            <Text color={Colors.disabled} fontWeight="medium">
              {t('estimatedEnd')}
            </Text>
            <DatetimePicker
              color={Colors.azure}
              date={navActionDetails.estimatedEnd}
              onChangeDate={() => {
                setSelectedDate('estimated')
                setOpenDatePicker(true)
              }}
            />
            <Text color={Colors.disabled} fontWeight="medium">
              {t('endText')}
            </Text>
            <DatetimePicker
              color={Colors.danger}
              date={navActionDetails.end}
              onChangeDate={() => {
                setSelectedDate('end')
                setOpenDatePicker(true)
              }}
            />
          </Animated.View>
          {actionType === 'Cleaning' ? null : renderCargoHoldActions()}
          <DatePicker
            modal
            date={new Date()}
            mode="datetime"
            open={openDatePicker}
            onCancel={() => {
              setOpenDatePicker(false)
            }}
            onConfirm={date => {
              setOpenDatePicker(false)
              onDatesChange(date)
            }}
          />
        </Box>
        <Box bg={Colors.white}>
          <Shadow
            viewStyle={{
              width: '100%',
            }}
          >
            <HStack width={'100%'}>
              <Button
                colorScheme="muted"
                flex="1"
                m={ms(16)}
                variant="ghost"
                onPress={() => navigation.goBack()}
              >
                {t('cancel')}
              </Button>
              <Button
                bg={unsavedChanges.length ? Colors.primary : Colors.disabled}
                disabled={unsavedChanges.length < 1}
                flex="1"
                m={ms(16)}
                onPress={() => confirmSave()}
              >
                {t('save')}
              </Button>
            </HStack>
          </Shadow>
        </Box>
      </ScrollView>

      <Modal
        animationPreset="slide"
        isOpen={confirmModal}
        px={ms(12)}
        size="full"
      >
        <Modal.Content>
          <Modal.Header>Confirmation</Modal.Header>
          <Text fontWeight="medium" mx={ms(12)} my={ms(20)}>
            Are you sure you want to {actionMethod.toLowerCase()} this action?
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
              bg={
                actionMethod.toLowerCase() === 'add' ||
                actionMethod.toLowerCase() === 'update'
                  ? Colors.primary
                  : Colors.danger
              }
              flex="1"
              m={ms(12)}
              onPress={onActionConfirmed}
            >
              <Text color={Colors.white} fontWeight="medium">
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
