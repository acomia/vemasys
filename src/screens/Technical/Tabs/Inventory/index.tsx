import React, {useEffect, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Box,
  Button,
  Divider,
  FlatList,
  HStack,
  Icon,
  Image,
  Input,
  Modal,
  Text,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import {Icons} from '@bluecentury/assets'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {formatConsumableLabel} from '@bluecentury/constants'
import {LoadingAnimated} from '@bluecentury/components'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'

const Inventory = () => {
  const {t} = useTranslation()
  const toast = useToast()
  const {
    isTechnicalLoading,
    inventory,
    consumableTypes,
    getVesselInventory,
    getConsumableTypes,
    updateVesselInventoryItem,
  }: any = useTechnical()
  const {vesselId} = useEntity()
  const [searched, setSearched] = useState('')
  const [inventoryData, setInventoryData] = useState([])
  const [selectedFilter, setSelectedFilter] = useState([])
  const [selectedItem, setSelectedItem] = useState(0)
  const [quantity, setQuantity] = useState('')
  const [openFilter, setOpenFilter] = useState(false)
  const [openNewStock, setOpenNewStock] = useState(false)

  useEffect(() => {
    getVesselInventory(vesselId)
    getConsumableTypes()
  }, [vesselId])

  useEffect(() => {
    setInventoryData(inventory)
  }, [inventory])

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

  const renderSeachFilterSection = () => (
    <HStack justifyContent="space-between">
      <Input
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="magnify" />}
            color={Colors.disabled}
            ml="2"
            size={5}
          />
        }
        w={{
          base: '78%',
        }}
        backgroundColor={Colors.light_grey}
        fontWeight="medium"
        placeholder={t('searchStock')}
        placeholderTextColor={Colors.disabled}
        size="sm"
        value={searched}
        variant="filled"
        onChangeText={e => onSearchInventory(e)}
      />
      <Button
        leftIcon={
          <Image
            alt="filter-icon"
            source={Icons.slider_outline}
            style={{width: 15, height: 15}}
          />
        }
        bg={Colors.highlighted_text}
        size="xs"
        onPress={() => setOpenFilter(true)}
      >
        {t('filter')}
      </Button>
    </HStack>
  )

  const renderInventoryListHeaderSection = () => (
    <HStack mt={ms(20)}>
      <Text bold color={Colors.text} flex="1" fontSize={ms(16)}>
        {t('name')}
      </Text>
      <Text bold color={Colors.text} fontSize={ms(16)} mr={ms(30)}>
        {t('stock')}
      </Text>
    </HStack>
  )

  const renderStatusIcon = (item: any) => {
    return item.warningThreshold && item.quantity === 0 ? (
      <Image
        alt="filter-icon"
        ml={ms(20)}
        source={Icons.status_x}
        style={{width: 20, height: 20}}
      />
    ) : item.quantity < item.warningThreshold ? (
      <Image
        alt="filter-icon"
        ml={ms(20)}
        source={Icons.status_exclamation}
        style={{width: 20, height: 20}}
      />
    ) : (
      <Image
        alt="filter-icon"
        ml={ms(20)}
        source={Icons.status_check}
        style={{width: 20, height: 20}}
      />
    )
  }

  const renderInventoryList = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.7}
        onPress={() => onSelectItem(item.id)}
      >
        <HStack
          alignItems="center"
          bg={Colors.white}
          borderColor={Colors.light}
          borderRadius={ms(5)}
          borderWidth={1}
          mb={ms(5)}
          px={ms(15)}
          py={ms(11)}
          shadow={1}
        >
          <Box flex="1">
            <Text color={Colors.text} fontWeight="medium">
              {formatConsumableLabel(item.consumable)}
            </Text>
            <Text color={Colors.disabled}>{item?.consumable?.type?.title}</Text>
          </Box>
          <HStack flex="1" justifyContent="space-evenly">
            {renderStatusIcon(item)}
            <Text
              bold
              color={
                item.warningThreshold && item.quantity === 0
                  ? Colors.danger
                  : item.quantity < item.warningThreshold
                  ? '#44A7B9'
                  : Colors.secondary
              }
            >
              {item?.quantity}
            </Text>
          </HStack>
        </HStack>
      </TouchableOpacity>
    )
  }

  const TypesCard = ({selected, type}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onSelectFilterType(type?.title)}
      >
        <Box
          alignItems="center"
          bg={selected !== undefined ? Colors.azure : Colors.light}
          borderRadius={ms(5)}
          h={ms(40)}
          justifyContent="center"
          mb={ms(10)}
          mr={ms(10)}
          px={ms(15)}
          py={ms(5)}
        >
          <Text
            color={selected !== undefined ? Colors.white : Colors.disabled}
            fontSize={ms(15)}
            fontWeight="medium"
          >
            {type?.title}
          </Text>
        </Box>
      </TouchableOpacity>
    )
  }

  const onSearchInventory = (value: string) => {
    setSearched(value)
    const searchedInventory = inventory?.filter((item: any) => {
      const containsKey = value
        ? `${item?.consumable?.name?.toLowerCase()}`?.includes(
            value?.toLowerCase()
          )
        : true

      return containsKey
    })
    setInventoryData(searchedInventory)
  }

  const onSelectFilterType = (type: string) => {
    const typeSelected = selectedFilter.find(e => {
      return e.toLowerCase() === type.toLowerCase()
    })
    if (typeSelected !== undefined) {
      const removeSameSelect = selectedFilter.filter(e => e !== typeSelected)
      setSelectedFilter(removeSameSelect)
    } else {
      setSelectedFilter([...selectedFilter, type])
    }
  }

  const onResetFilter = () => {
    setSelectedFilter([])
  }

  const onApplyFilter = () => {
    setOpenFilter(false)
    if (selectedFilter.length > 0) {
      const filtered = inventory?.filter(e =>
        selectedFilter.includes(e?.consumable?.type?.title)
      )
      setInventoryData(filtered)
    } else {
      setInventoryData(inventory)
    }
  }

  const onSelectItem = (id: number) => {
    setOpenNewStock(true)
    setSelectedItem(id)
  }

  const onSaveNewStock = async () => {
    if (quantity === '') {
      return showWarningToast('Quantity is required.')
    }
    setOpenNewStock(false)
    const res = await updateVesselInventoryItem(
      parseInt(quantity),
      selectedItem
    )
    if (typeof res === 'object' && res?.id) {
      getVesselInventory(vesselId)
      showToast('New stock added.', 'success')
    } else {
      showToast('New stock failed.', 'failed')
    }
  }

  return (
    <Box flex="1">
      <Box bg={Colors.white} flex="1" px={ms(12)} py={ms(20)}>
        {renderSeachFilterSection()}
        {renderInventoryListHeaderSection()}
        <Divider my={ms(10)} />
        {isTechnicalLoading ? (
          <LoadingAnimated />
        ) : (
          <FlatList
            ListEmptyComponent={() => (
              <Text
                bold
                color={Colors.azure}
                fontSize={ms(16)}
                mt={ms(20)}
                textAlign="center"
              >
                {t('noInventory')}
              </Text>
            )}
            data={inventoryData}
            keyExtractor={(item: any) => `Inventory-${item.id}`}
            renderItem={renderInventoryList}
            showsVerticalScrollIndicator={false}
          />
        )}
        <Modal
          animationPreset="slide"
          isOpen={openFilter}
          minH="100%"
          onClose={() => setOpenFilter(false)}
        >
          <Modal.Content maxH="100%" minH="100%" ml="auto" mr={0}>
            <Modal.Body>
              <Box flex="1">
                <Text bold color={Colors.azure} fontSize={ms(26)}>
                  {t('filter')}
                </Text>
                <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(20)}>
                  {t('type')}
                </Text>
                <HStack flexWrap="wrap" mt={ms(10)}>
                  {consumableTypes?.length > 0
                    ? consumableTypes?.map((type: any, index: number) => {
                        const selected = selectedFilter.find(
                          e => e === type.title
                        )
                        return (
                          <TypesCard
                            key={index}
                            selected={selected}
                            type={type}
                          />
                        )
                      })
                    : null}
                </HStack>
              </Box>
            </Modal.Body>
            <Modal.Footer>
              <Button
                colorScheme="light"
                flex="1"
                m={ms(5)}
                variant="ghost"
                onPress={onResetFilter}
              >
                {t('reset')}
              </Button>
              <Button
                bg={Colors.primary}
                flex="1"
                m={ms(5)}
                onPress={onApplyFilter}
              >
                {t('apply')}
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Modal animationPreset="slide" isOpen={openNewStock}>
          <Modal.Content px={ms(10)} width="95%">
            <Modal.Header>Enter quantity</Modal.Header>
            <Modal.Body>
              <Input
                bold
                backgroundColor={Colors.light_grey}
                fontSize={ms(15)}
                height={ms(40)}
                keyboardType="number-pad"
                value={quantity}
                variant="filled"
                onChangeText={e => setQuantity(e)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                bg="#E0E0E0"
                flex="1"
                m={ms(5)}
                onPress={() => setOpenNewStock(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                bg={Colors.primary}
                flex="1"
                m={ms(5)}
                onPress={onSaveNewStock}
              >
                {t('save')}
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>
    </Box>
  )
}

export default Inventory
