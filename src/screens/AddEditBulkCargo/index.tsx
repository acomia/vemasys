import React, {useEffect, useState} from 'react'
import {Alert} from 'react-native'
import {Box, Button, HStack, Input, Select, Text, useToast} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {formatBulkTypeLabel} from '@bluecentury/constants'
import {IconButton, LoadingAnimated} from '@bluecentury/components'
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
    amount: cargo !== undefined ? (cargo?.amount ? cargo?.amount : 0) : '',
    actualAmount: cargo ? (cargo?.actualAmount ? cargo?.actualAmount : 0) : '',
    isLoading: cargo !== undefined ? (cargo?.isLoading ? '1' : '0') : '0',
  })
  const [bulkTypesData, setBulkTypesData] = useState([])
  const defaultType = cargo !== undefined ? formatBulkTypeLabel(cargo.type) : ''
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        method === 'edit' && (
          <IconButton
            source={Icons.trash}
            onPress={deleteBulkCargoConfirmation}
            size={22}
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
      flex="1"
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
    >
      <Box flex="1" px={ms(12)} py={ms(20)}>
        <Text fontWeight="medium" color={Colors.disabled} mb={ms(6)}>
          {t('cargo')}
        </Text>
        {method === 'edit' ? (
          <Box bg="#F7F7F7" borderRadius={ms(5)} py="3" px="2">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              color={Colors.text}
              fontWeight="medium"
            >
              {defaultType}
            </Text>
          </Box>
        ) : (
          <Select
            selectedValue={defaultType}
            minWidth="280"
            bg="#F7F7F7"
            onValueChange={val => setCargoData({...cargoData, typeId: val})}
          >
            {bulkTypesData?.map((type: any, index: number) => (
              <Select.Item key={index} label={type.label} value={type.value} />
            ))}
          </Select>
        )}

        <Text
          fontWeight="medium"
          color={Colors.disabled}
          mb={ms(6)}
          mt={ms(20)}
        >
          {t('bookedAmount')}
        </Text>
        <Input
          bg={'#F7F7F7'}
          keyboardType="number-pad"
          height={ms(40)}
          fontSize={ms(15)}
          bold
          value={cargoData.amount.toString()}
          onChangeText={e => setCargoData({...cargoData, amount: e})}
        />
        <Text
          fontWeight="medium"
          color={Colors.disabled}
          mb={ms(6)}
          mt={ms(20)}
        >
          {t('actualAmount')}
        </Text>
        <Input
          bg={'#F7F7F7'}
          keyboardType="number-pad"
          height={ms(40)}
          fontSize={ms(15)}
          bold
          value={cargoData.actualAmount.toString()}
          onChangeText={e => setCargoData({...cargoData, actualAmount: e})}
        />
      </Box>
      <Box bg={Colors.white} position="relative">
        <Shadow
          distance={25}
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
