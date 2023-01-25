import React from 'react'
import {Alert, RefreshControl} from 'react-native'
import {Box, Divider, HStack, ScrollView, Text, useToast} from 'native-base'
import {useNavigation} from '@react-navigation/native'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {IconButton, LoadingAnimated} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {formatBulkTypeLabel, formatNumber} from '@bluecentury/constants'
import {useTranslation} from 'react-i18next'

const CargoList = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const toast = useToast()
  const {
    isPlanningDetailsLoading,
    navigationLogDetails,
    getNavigationLogDetails,
    deleteBulkCargo,
  } = usePlanning()

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

  const deleteBulkCargoConfirmation = (cargo: any) => {
    Alert.alert(
      'Confirmation required',
      'Are you sure you want to delete this item? This action cannot be reversed.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, delete it',
          onPress: async () => onDeleteBulkCargoEntry(cargo),
          style: 'destructive',
        },
      ]
    )
  }

  const onDeleteBulkCargoEntry = async (cargo: any) => {
    try {
      const res = await deleteBulkCargo(cargo?.id.toString())
      if (res === 204) {
        getNavigationLogDetails(navigationLogDetails?.id)
        showToast('Cargo entry deleted.', 'success')
      } else {
        showToast('Could not delete cargo entry.', 'failed')
      }
    } catch (error) {
      throw new Error(`Could not delete cargo entry. ${error}`)
    }
  }

  const convertPeriodToComma = (value: string) => {
    return value.replace('.', ',')
  }

  const onPullToReload = () => {
    getNavigationLogDetails(navigationLogDetails?.id)
  }

  if (isPlanningDetailsLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isPlanningDetailsLoading}
            onRefresh={onPullToReload}
          />
        }
        bg={Colors.white}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        px={ms(12)}
        py={ms(20)}
      >
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          {t('cargo')}
        </Text>
        <HStack justifyContent="flex-end" mt={ms(10)}>
          {/* <Text fontSize={ms(16)} bold color={Colors.text}>
            Inventory
          </Text> */}
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('actions')}
          </Text>
        </HStack>
        <Divider mb={ms(15)} mt={ms(5)} />
        {navigationLogDetails?.bulkCargo?.length > 0 ? (
          navigationLogDetails?.bulkCargo?.map((cargo, index) => {
            const fValue = cargo ? cargo.actualTonnage || cargo.tonnage : 0
            return (
              <HStack
                key={index}
                alignItems="center"
                bg={Colors.white}
                borderRadius={5}
                justifyContent="space-between"
                mb={ms(10)}
                px={ms(16)}
                py={ms(5)}
                shadow={1}
                width="100%"
              >
                <Box flex="1" mr={ms(5)}>
                  <Text fontWeight="medium">
                    {cargo.type ? formatBulkTypeLabel(cargo.type) : 'N.A.'}
                  </Text>
                  <Text color={Colors.disabled}>
                    {cargo.isLoading ? 'In: ' : 'Out: '}
                    {/* {formatNumber(fValue, 0, ',')} */}
                    {convertPeriodToComma(fValue?.toString())}
                  </Text>
                </Box>
                <IconButton
                  size={ms(22)}
                  source={Icons.edit}
                  onPress={() =>
                    navigation.navigate('AddEditBulkCargo', {
                      cargo: cargo,
                      method: 'edit',
                    })
                  }
                />
                {/* <HStack alignItems="center">

                  <Box w={ms(10)} />
                  <IconButton
                    source={Icons.trash}
                    onPress={() => deleteBulkCargoConfirmation(cargo)}
                    size={ms(22)}
                  />
                </HStack> */}
              </HStack>
            )
          })
        ) : (
          <Box flex="1">
            <Text
              color={Colors.disabled}
              fontWeight="medium"
              textAlign="center"
            >
              {t('navLogHasNoCargo')}
            </Text>
          </Box>
        )}
        {/* <Box position="absolute" bottom={0} right={ms(12)}>
          <IconButton
            source={Icons.add}
            size={ms(50)}
            onPress={() =>
              navigation.navigate('AddEditBulkCargo', {
                method: 'add',
              })
            }
          />
        </Box> */}
      </ScrollView>
    </Box>
  )
}

export default CargoList
