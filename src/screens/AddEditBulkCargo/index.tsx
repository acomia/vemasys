import React, {useEffect, useState} from 'react'
import {Alert} from 'react-native'
import {Box, Button, HStack, Input, Select, Text, useToast} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {formatBulkTypeLabel} from '@bluecentury/constants'
import {
  IconButton,
  LoadingAnimated,
  NoInternetConnectionMessage,
  OTPInput,
} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useTranslation} from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditBulkCargo = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {cargo, method} = route.params
  const toast = useToast()
  const {
    isPlanningLoading,
    getBulkTypes,
    bulkTypes,
    updateBulkCargo,
    createBulkCargo,
    deleteBulkCargo,
    navigationLogDetails,
    getNavigationLogDetails,
  } = usePlanning()
  const [cargoData, setCargoData] = useState({
    id: cargo !== undefined ? cargo?.id : '',
    typeId: cargo !== undefined ? cargo?.type?.id : '',
    amount: cargo !== undefined ? (cargo?.amount ? cargo?.amount : '0') : '0',
    actualAmount: cargo
      ? cargo?.actualAmount
        ? cargo?.actualAmount
        : '0'
      : '0',
    isLoading: cargo !== undefined ? (cargo?.isLoading ? '1' : '0') : '0',
  })
  const [bulkTypesData, setBulkTypesData] = useState([])
  const defaultType =
    cargo !== undefined ? formatBulkTypeLabel(cargo.type) : cargoData.typeId
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        method === 'edit' && (
          <IconButton
            size={22}
            source={Icons.trash}
            onPress={deleteBulkCargoConfirmation}
          />
        ),
    })

    getBulkTypes('')
  }, [])

  useEffect(() => {
    const types = bulkTypes?.map(bulkType => {
      return {
        id: bulkType.id,
        value: bulkType.id,
        label: bulkType.nameNl,
      }
    })
    setBulkTypesData(types)
  }, [bulkTypes])

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

  const onSuccess = () => {
    getNavigationLogDetails(navigationLogDetails?.id)
    navigation.goBack()
  }

  const onSaveCargoEntry = async () => {
    if (
      cargoData.typeId === '' &&
      cargoData.amount === '' &&
      cargoData.actualAmount === ''
    ) {
      return showWarningToast('All fields are required.')
    }
    if (cargoData.amount === '') {
      return showWarningToast('Amount is required.')
    }
    if (cargoData.actualAmount === '') {
      return showWarningToast('Actual amount is required.')
    }
    if (cargoData.typeId === '') {
      return showWarningToast('Type is required.')
    }

    try {
      let res
      if (method === 'edit') {
        res = await updateBulkCargo(cargoData)
      } else {
        res = await createBulkCargo(cargoData, navigationLogDetails?.id)
      }
      if (typeof res === 'object' && res?.id) {
        showToast(
          `Cargo entry ${method === 'edit' ? 'updated.' : 'added.'}`,
          'success'
        )
      } else {
        showToast(
          `Could not ${method === 'edit' ? 'update.' : 'add.'} cargo entry.`,
          'failed'
        )
      }
    } catch (error) {
      throw new Error(
        `Could not ${
          method === 'edit' ? 'update.' : 'add.'
        } cargo entry. ${error}`
      )
    }
  }

  const deleteBulkCargoConfirmation = () => {
    Alert.alert(t('confirmationRequired'), t('confirmMessage'), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('confirmDelete'),
        onPress: async () => onDeleteBulkCargoEntry(),
        style: 'destructive',
      },
    ])
  }

  const onDeleteBulkCargoEntry = async () => {
    try {
      const res = await deleteBulkCargo(cargo?.id)
      if (typeof res === 'object' && res?.id) {
        showToast('Cargo entry deleted.', 'success')
      } else {
        showToast('Could not delete cargo entry.', 'failed')
      }
    } catch (error) {
      throw new Error(`Could not delete cargo entry. ${error}`)
    }
  }

  if (isPlanningLoading) return <LoadingAnimated />
  return (
    <Box
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
      flex="1"
    >
      <NoInternetConnectionMessage />
      <Box flex="1" px={ms(12)} py={ms(20)}>
        <Text color={Colors.disabled} fontWeight="medium" mb={ms(6)}>
          {t('cargo')}
        </Text>
        {method === 'edit' ? (
          <Box bg={Colors.light_grey} borderRadius={ms(5)} px="2" py="3">
            <Text
              color={Colors.text}
              ellipsizeMode="tail"
              fontWeight="medium"
              numberOfLines={1}
            >
              {defaultType}
            </Text>
          </Box>
        ) : (
          <Select
            bg={Colors.light_grey}
            minWidth="280"
            selectedValue={defaultType}
            onValueChange={val => setCargoData({...cargoData, typeId: val})}
          >
            {bulkTypesData?.map((type: any, index: number) => (
              <Select.Item key={index} label={type.label} value={type.value} />
            ))}
          </Select>
        )}

        <Text
          color={Colors.disabled}
          fontWeight="medium"
          mb={ms(6)}
          mt={ms(20)}
        >
          {t('bookedAmount')}
        </Text>
        <Box h={ms(50)}>
          <OTPInput
            getValue={val => {
              if (val) {
                setCargoData({...cargoData, amount: val})
              }
            }}
            decimalLength={3}
            errorMessage={'Too match'}
            initialValue={cargoData.amount}
            numberLength={4}
          />
        </Box>
        {/* <Input
          bold
          bg={'#F7F7F7'}
          fontSize={ms(15)}
          height={ms(40)}
          keyboardType="number-pad"
          value={cargoData.amount.toString().replace('.', ',')}
          onChangeText={e =>
            setCargoData({...cargoData, amount: e.replace(',', '.')})
          }
        /> */}
        <Text
          color={Colors.disabled}
          fontWeight="medium"
          mb={ms(6)}
          mt={ms(20)}
        >
          {t('actualAmount')}
        </Text>
        <Box h={ms(50)}>
          <OTPInput
            getValue={val => {
              if (val) {
                setCargoData({...cargoData, actualAmount: val})
              }
            }}
            decimalLength={3}
            errorMessage={'Too match'}
            initialValue={cargoData.actualAmount}
            numberLength={4}
          />
        </Box>
        {/* <Input
          bold
          bg={'#F7F7F7'}
          fontSize={ms(15)}
          height={ms(40)}
          keyboardType="number-pad"
          value={cargoData.actualAmount.toString().replace('.', ',')}
          onChangeText={e =>
            setCargoData({...cargoData, actualAmount: e.replace(',', '.')})
          }
        /> */}
      </Box>
      <Box bg={Colors.white} position="relative">
        <Shadow
          viewStyle={{
            width: '100%',
          }}
          distance={25}
        >
          <HStack>
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
              bg={Colors.primary}
              flex="1"
              m={ms(16)}
              onPress={onSaveCargoEntry}
            >
              {t('Save')}
            </Button>
          </HStack>
        </Shadow>
      </Box>
    </Box>
  )
}

export default AddEditBulkCargo
