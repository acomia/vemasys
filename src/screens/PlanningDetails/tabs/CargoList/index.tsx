import React from 'react'
import {Box, Divider, HStack, ScrollView, Text} from 'native-base'

import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {IconButton} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {formatBulkTypeLabel, formatNumber} from '@bluecentury/constants'

const CargoList = () => {
  const {navigationLogDetails} = usePlanning()

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
      >
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          Cargo
        </Text>
        <HStack mt={ms(10)} justifyContent="space-between">
          <Text fontSize={ms(16)} fontWeight="bold" color={Colors.text}>
            Inventory
          </Text>
          <Text fontSize={ms(16)} fontWeight="bold" color={Colors.text}>
            Actions
          </Text>
        </HStack>
        <Divider mt={ms(5)} mb={ms(15)} />
        {navigationLogDetails?.bulkCargo?.length > 0 ? (
          navigationLogDetails?.bulkCargo?.map((cargo, index) => {
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
                <Box>
                  <Text fontWeight="medium">
                    {cargo.type ? formatBulkTypeLabel(cargo.type) : 'N.A.'}
                  </Text>
                  <Text color={Colors.disabled}>
                    {cargo.isLoading ? 'In: ' : 'Out: '}
                    {formatNumber(
                      cargo ? cargo.actualTonnage || cargo.tonnage : 0,
                      0
                    )}
                  </Text>
                </Box>
                <HStack alignItems="center">
                  <IconButton
                    source={Icons.edit}
                    onPress={() => {}}
                    size={ms(22)}
                  />
                  <Box w={ms(10)} />
                  <IconButton
                    source={Icons.trash}
                    onPress={() => {}}
                    size={ms(22)}
                  />
                </HStack>
              </HStack>
            )
          })
        ) : (
          <Text textAlign="center" color={Colors.disabled} fontWeight="medium">
            This navigation log has no cargo listed.
          </Text>
        )}
      </ScrollView>
    </Box>
  )
}

export default CargoList
