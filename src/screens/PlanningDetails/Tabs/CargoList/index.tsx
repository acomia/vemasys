import React, {useState, useEffect} from 'react'
import {Alert, RefreshControl, TouchableOpacity} from 'react-native'
import {
  Box,
  Divider,
  HStack,
  Modal,
  ScrollView,
  Select,
  Text,
  VStack,
  useToast,
} from 'native-base'
import {useNavigation} from '@react-navigation/native'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {IconButton, LoadingAnimated, OTPInput} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {formatBulkTypeLabel, formatNumber} from '@bluecentury/constants'
import {useTranslation} from 'react-i18next'
import {AddContainerModal, InputModal} from './components'
import {StandardContainerCargo} from '@bluecentury/models'

const CargoList = () => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const toast = useToast()
  const {
    isPlanningDetailsLoading,
    navigationLogDetails,
    getNavigationLogDetails,
    deleteBulkCargo,
    containerCargo,
    isContainerCargo,
    updateContainerCargo,
    isContainerUpdated,
    isContainerUpdatedLoading,
    resetContainerUpdate,
    getNavigationContainers,
  } = usePlanning()
  const [isInputOpen, setInputOpen] = useState(false)
  const [addIsOpen, setAddisOpen] = useState(false)
  const [selectedContainer, setSelectedContainer] =
    useState<StandardContainerCargo>({})

  useEffect(() => {
    if (isContainerCargo) {
      getNavigationContainers()
    }
  }, [isContainerCargo])

  useEffect(() => {
    if (isContainerUpdated && !isContainerUpdatedLoading) {
      getNavigationLogDetails(navigationLogDetails?.id)

      setInputOpen(false)
      resetContainerUpdate()
    }
  }, [isContainerUpdated, isContainerUpdatedLoading])

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

  const updateContainer = (cargo: StandardContainerCargo) => {
    if (!selectedContainer && !value) return

    updateContainerCargo(cargo)
  }

  const handleSaveContainer = (values: any) => {
    console.log('values', values)
  }

  const renderBulkCargo = () => {
    if (!navigationLogDetails?.bulkCargo) return null

    if (navigationLogDetails?.bulkCargo?.length <= 0) {
      return (
        <Box flex="1">
          <Text color={Colors.disabled} fontWeight="medium" textAlign="center">
            {t('navLogHasNoCargo')}
          </Text>
        </Box>
      )
    }

    return navigationLogDetails?.bulkCargo?.map((cargo, index) => {
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
        </HStack>
      )
    })
  }

  const renderContainerCargo = () => {
    const standardContainer = navigationLogDetails?.standardContainerCargo

    if (standardContainer && standardContainer?.length <= 0) {
      return (
        <Box flex="1">
          <Text color={Colors.disabled} fontWeight="medium" textAlign="center">
            {t('navLogHasNoCargo')}
          </Text>
        </Box>
      )
    }

    return (
      <VStack space={ms(10)}>
        <Box alignSelf={'flex-end'}>
          <IconButton
            size={ms(30)}
            source={Icons.add}
            onPress={() => setAddisOpen(true)}
          />
        </Box>
        <Box>
          <HStack width={'full'}>
            <Text borderWidth={1} flex={2} p={ms(5)}>
              {t('type')}
            </Text>
            <Text borderWidth={1} flex={1} p={ms(5)} textAlign={'center'}>
              {t('out')}
            </Text>
            <Text borderWidth={1} flex={1} p={ms(5)} textAlign={'center'}>
              {t('in')}
            </Text>
          </HStack>
          {standardContainer?.map(container => {
            if (container?.nbIn > 0 || container?.nbOut > 0) {
              return (
                <TouchableOpacity
                  key={container.id}
                  onPress={() => {
                    setSelectedContainer(() => container)
                    setInputOpen(true)
                  }}
                >
                  <HStack width={'full'}>
                    <Text borderWidth={0.5} flex={2} p={ms(5)}>
                      {container?.type?.title}
                    </Text>
                    <Text
                      borderWidth={0.5}
                      flex={1}
                      p={ms(5)}
                      textAlign={'center'}
                    >
                      {container?.nbOut ? container?.nbOut : null}
                    </Text>
                    <Text
                      borderWidth={0.5}
                      flex={1}
                      p={ms(5)}
                      textAlign={'center'}
                    >
                      {container?.nbIn ? container?.nbIn : null}
                    </Text>
                  </HStack>
                </TouchableOpacity>
              )
            }
          })}
          <HStack mt={ms(10)} padding={ms(5)} space={ms(10)}>
            <Text flex={2}>{t('loadUponDeparture')}</Text>
            <Text textAlign={'right'}>
              {navigationLogDetails && navigationLogDetails?.loadUponDeparture
                ? navigationLogDetails?.loadUponDeparture
                : '---'}
            </Text>
          </HStack>
          <InputModal
            container={selectedContainer}
            header={`Container: ${selectedContainer?.type?.title}`}
            isLoading={isContainerUpdatedLoading}
            isOpen={isInputOpen}
            setOpen={() => setInputOpen(false)}
            onAction={updateContainer}
          />
        </Box>
      </VStack>
    )
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
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('actions')}
          </Text>
        </HStack>
        <Divider mb={ms(15)} mt={ms(5)} />
        {isContainerCargo ? renderContainerCargo() : renderBulkCargo()}
      </ScrollView>
      <AddContainerModal
        header={'Create Standard Container'}
        isOpen={addIsOpen}
        setOpen={() => setAddisOpen(false)}
        onAction={handleSaveContainer}
      />
    </Box>
  )
}

export default CargoList
