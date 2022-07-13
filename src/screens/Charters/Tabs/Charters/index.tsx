import React, {useEffect, useState} from 'react'
import {
  Flex,
  Text,
  Box,
  FlatList,
  VStack,
  HStack,
  Input,
  Icon,
  Divider,
  Center,
  Image
} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import {useCharters, useEntity} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {CharterStatus} from '@bluecentury/components'
import {
  CHARTER_CONTRACTOR_STATUS_ARCHIVED,
  CHARTER_ORDERER_STATUS_COMPLETED,
  ENTITY_TYPE_EXPLOITATION_GROUP,
  ENTITY_TYPE_EXPLOITATION_VESSEL
} from '@bluecentury/constants'
import {Animated} from '@bluecentury/assets'
import {TouchableOpacity} from 'react-native'

export default function Charters({navigation, route}: any) {
  const {isCharterLoading, charters, getCharters} = useCharters()
  const {entityType} = useEntity()
  const [searchedValue, setSearchValue] = useState('')
  const [chartersData, setChartersData] = useState(
    route === 'charters'
      ? charters.filter(c => c.children && c.children.length === 0)
      : charters.filter(
          c =>
            (c.children && c.children.length > 0) ||
            (!c.parent && !c.navigationLogs) ||
            c.navigationLogs.length === 0
        )
  )

  useEffect(() => {
    getCharters()
    return () => {}
  }, [])

  const isLoaded = (cargo: any[]) => {
    if (cargo && cargo.some(e => e.isLoaded === false)) {
      return true
    } else {
      return false
    }
  }

  const getStatus = (
    charter: {ordererStatus: string; contractorStatus: string},
    selectedEntityType: string
  ) => {
    if (
      charter.ordererStatus === CHARTER_ORDERER_STATUS_COMPLETED &&
      charter.contractorStatus !== CHARTER_CONTRACTOR_STATUS_ARCHIVED
    ) {
      return CHARTER_ORDERER_STATUS_COMPLETED
    }

    if (charter.contractorStatus === CHARTER_CONTRACTOR_STATUS_ARCHIVED)
      return charter.contractorStatus

    return selectedEntityType === ENTITY_TYPE_EXPLOITATION_VESSEL ||
      selectedEntityType === ENTITY_TYPE_EXPLOITATION_GROUP
      ? charter.contractorStatus
      : charter.ordererStatus
  }

  const renderItem = ({item, index}: any) => {
    const status = getStatus(item, entityType)
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('CharterDetails', {charter: item})}
      >
        <Box
          key={index}
          borderWidth={1}
          borderColor={Colors.primary_light}
          borderRadius={ms(5)}
          mb={ms(10)}
          borderStyle={status === 'draft' ? 'dashed' : 'solid'}
        >
          <HStack
            py={ms(8)}
            pl={ms(12)}
            pr={ms(10)}
            alignItems="center"
            justifyContent="space-between"
          >
            <VStack maxWidth="72%">
              <Text fontWeight="bold">{item.vesselReference || 'Unknown'}</Text>
              {item.navigationLogs &&
                item.navigationLogs.map(
                  (navlog: {bulkCargo: any[]}) =>
                    navlog.bulkCargo &&
                    navlog.bulkCargo.map(cargo => {
                      if (cargo.isLoading) {
                        return (
                          <Text
                            key={cargo.id}
                            fontWeight="semibold"
                            color={
                              item.isCurrentlyActive || isLoaded(item.cargo)
                                ? '#29B7EF'
                                : Colors.disabled
                            }
                          >
                            {parseInt(cargo.amount) || 0} MT -{' '}
                            {cargo.type.nameEn || cargo.type.nameNl}
                          </Text>
                        )
                      }
                    })
                )}
              <Text
                color={item.isCurrentlyActive ? Colors.black : Colors.disabled}
              >
                {item.charterDate
                  ? moment(item.charterDate).format('DD/MM/YYYY')
                  : 'TBD'}
              </Text>
            </VStack>
            <CharterStatus entityType={entityType} charter={item} />
          </HStack>
          <Box
            position="absolute"
            left={0}
            top={0}
            bottom={0}
            width={ms(7)}
            borderTopLeftRadius={ms(5)}
            borderBottomLeftRadius={ms(5)}
            backgroundColor={
              item.isCurrentlyActive ? Colors.primary_light : Colors.disabled
            }
          />
        </Box>
      </TouchableOpacity>
    )
  }

  const onSearchCharter = (value: string) => {
    setSearchValue(value)
    const searchedCharter = charters?.filter(charter => {
      const containsKey = value
        ? `${charter?.vesselReference?.toLowerCase()}`?.includes(
            value?.toLowerCase()
          )
        : true

      return containsKey
    })
    setChartersData(searchedCharter)
  }

  if (isCharterLoading) {
    return (
      <Center>
        <Image
          alt="loading"
          source={Animated.vemasys_loading}
          width={ms(150)}
          height={ms(150)}
          resizeMode="contain"
        />
      </Center>
    )
  }

  return (
    <Flex flex={1} safeArea backgroundColor={Colors.white} p={ms(12)}>
      <Input
        w={{
          base: '100%'
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
        placeholder="Search charter..."
        variant="filled"
        size="sm"
        value={searchedValue}
        onChangeText={e => onSearchCharter(e)}
      />
      <Divider my={ms(15)} />

      <FlatList
        data={
          searchedValue !== ''
            ? chartersData
            : route === 'charters'
            ? charters.filter(c => c.children && c.children.length === 0)
            : charters.filter(
                c =>
                  (c.children && c.children.length > 0) ||
                  (!c.parent && !c.navigationLogs) ||
                  c.navigationLogs.length === 0
              )
        }
        renderItem={renderItem}
        keyExtractor={item => `Charter-${item.id}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text
            fontSize={ms(20)}
            fontWeight="bold"
            color={Colors.azure}
            mt={ms(20)}
            textAlign="center"
          >
            No Charters.
          </Text>
        )}
      />
    </Flex>
  )
}
