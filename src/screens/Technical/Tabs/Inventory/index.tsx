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

const Inventory = () => {
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

  const renderSeachFilterSection = () => (
    <HStack justifyContent="space-between">
      <Input
        w={{
          base: '78%',
        }}
        backgroundColor="#F7F7F7"
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="magnify" />}
            size={5}
            ml="2"
            color={Colors.disabled}
          />
        }
        placeholderTextColor={Colors.disabled}
        fontWeight="medium"
        placeholder="Search stock..."
        variant="filled"
        size="sm"
        value={searched}
        onChangeText={e => onSearchInventory(e)}
      />
      <Button
        size="xs"
        leftIcon={
          <Image
            alt="filter-icon"
            source={Icons.slider_outline}
            style={{width: 15, height: 15}}
          />
        }
        bg={Colors.highlighted_text}
        onPress={() => setOpenFilter(true)}
      >
        Filter
      </Button>
    </HStack>
  )

  const renderInventoryListHeaderSection = () => (
    <HStack mt={ms(20)}>
      <Text flex="1" fontSize={ms(16)} fontWeight="bold" color={Colors.text}>
        Name
      </Text>
      <Text fontSize={ms(16)} fontWeight="bold" color={Colors.text} mr={ms(30)}>
        Stock
      </Text>
    </HStack>
  )

  const renderStatusIcon = (item: any) => {
    return item.warningThreshold && item.quantity === 0 ? (
      <Image
        alt="filter-icon"
        source={Icons.status_x}
        style={{width: 20, height: 20}}
        ml={ms(20)}
      />
    ) : item.quantity < item.warningThreshold ? (
      <Image
        alt="filter-icon"
        source={Icons.status_exclamation}
        style={{width: 20, height: 20}}
        ml={ms(20)}
      />
    ) : (
      <Image
        alt="filter-icon"
        source={Icons.status_check}
        style={{width: 20, height: 20}}
        ml={ms(20)}
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
          borderRadius={ms(5)}
          borderWidth={1}
          borderColor={Colors.light}
          bg={Colors.white}
          alignItems="center"
          shadow={1}
          mb={ms(5)}
          px={ms(15)}
          py={ms(11)}
        >
          <Box flex="1">
            <Text fontWeight="medium" color={Colors.text}>
              {formatConsumableLabel(item.consumable)}
            </Text>
            <Text color={Colors.disabled}>{item?.consumable?.type?.title}</Text>
          </Box>
          <HStack flex="1" justifyContent="space-evenly">
            {renderStatusIcon(item)}
            <Text
              fontWeight="bold"
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
          borderRadius={ms(5)}
          bg={selected !== undefined ? Colors.azure : Colors.light}
          h={ms(40)}
          py={ms(5)}
          px={ms(15)}
          mr={ms(10)}
          mb={ms(10)}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize={ms(15)}
            fontWeight="medium"
            color={selected !== undefined ? Colors.white : Colors.disabled}
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
      <Box flex="1" bg={Colors.white} px={ms(12)} py={ms(20)}>
        {renderSeachFilterSection()}
        {renderInventoryListHeaderSection()}
        <Divider my={ms(10)} />
        {isTechnicalLoading ? (
          <LoadingAnimated />
        ) : (
          <FlatList
            data={inventoryData}
            renderItem={renderInventoryList}
            keyExtractor={(item: any) => `Inventory-${item.id}`}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text
                fontSize={ms(16)}
                fontWeight="bold"
                color={Colors.azure}
                mt={ms(20)}
                textAlign="center"
              >
                No Inventory.
              </Text>
            )}
          />
        )}
        <Modal
          isOpen={openFilter}
          animationPreset="slide"
          minH="100%"
          onClose={() => setOpenFilter(false)}
        >
          <Modal.Content ml="auto" mr={0} minH="100%" maxH="100%">
            <Modal.Body>
              <Box flex="1">
                <Text fontSize={ms(26)} fontWeight="bold" color={Colors.azure}>
                  Filter
                </Text>
                <Text
                  fontSize={ms(20)}
                  fontWeight="bold"
                  color={Colors.azure}
                  mt={ms(20)}
                >
                  Type
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
                flex="1"
                variant="ghost"
                m={ms(5)}
                onPress={onResetFilter}
                colorScheme="light"
              >
                Reset
              </Button>
              <Button
                flex="1"
                bg={Colors.primary}
                m={ms(5)}
                onPress={onApplyFilter}
              >
                Apply
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Modal isOpen={openNewStock} animationPreset="slide">
          <Modal.Content width="95%" px={ms(10)}>
            <Modal.Header>Enter quantity</Modal.Header>
            <Modal.Body>
              <Input
                variant="filled"
                backgroundColor="#F7F7F7"
                keyboardType="number-pad"
                size="sm"
                value={quantity}
                onChangeText={e => setQuantity(e)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                flex="1"
                bg="#E0E0E0"
                m={ms(5)}
                onPress={() => setOpenNewStock(false)}
              >
                Cancel
              </Button>
              <Button
                flex="1"
                bg={Colors.primary}
                m={ms(5)}
                onPress={onSaveNewStock}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Box>
    </Box>
  )
}

export default Inventory
