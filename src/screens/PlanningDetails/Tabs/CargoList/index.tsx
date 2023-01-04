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

const CargoList = () => {
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

  const onPullToReload = () => {
    getNavigationLogDetails(navigationLogDetails?.id)
  }

  if (isPlanningDetailsLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isPlanningDetailsLoading}
          />
        }
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
      >
        <Text fontSize={ms(20)} bold color={Colors.azure}>
          Cargo
        </Text>
        <HStack mt={ms(10)} justifyContent="flex-end">
          {/* <Text fontSize={ms(16)} bold color={Colors.text}>
            Inventory
          </Text> */}
          <Text fontSize={ms(16)} bold color={Colors.text}>
            Actions
          </Text>
        </HStack>
        <Divider mt={ms(5)} mb={ms(15)} />
        {navigationLogDetails?.bulkCargo?.length > 0 ? (
          navigationLogDetails?.bulkCargo?.map((cargo, index) => {
            const fValue = cargo ? cargo.actualTonnage || cargo.tonnage : 0
            return (
              <HStack
                key={index}
                bg={Colors.white}
                borderRadius={5}
                justifyContent="space-between"
                alignItems="center"
                py={ms(5)}
                px={ms(16)}
                width="100%"
                mb={ms(10)}
                shadow={1}
              >
                <Box flex="1" mr={ms(5)}>
                  <Text fontWeight="medium">
                    {cargo.type ? formatBulkTypeLabel(cargo.type) : 'N.A.'}
                  </Text>
                  <Text color={Colors.disabled}>
                    {cargo.isLoading ? 'In: ' : 'Out: '}
                    {formatNumber(fValue, 0, ',')}
                  </Text>
                </Box>
                <IconButton
                  source={Icons.edit}
                  onPress={() =>
                    navigation.navigate('AddEditBulkCargo', {
                      cargo: cargo,
                      method: 'edit',
                    })
                  }
                  size={ms(22)}
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
              textAlign="center"
              color={Colors.disabled}
              fontWeight="medium"
            >
              This navigation log has no cargo listed.
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
