import React from 'react'
import {Box, HStack, ScrollView, Text} from 'native-base'
import {TouchableOpacity} from 'react-native'
import {useEntity} from '@bluecentury/stores'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {ExploitationVessel} from '@bluecentury/models'

type Props = {
  onPress: (index: number, exploitationVessel: ExploitationVessel) => void
}

export const FleetHeader = ({onPress}: Props) => {
  const {selectedEntity, fleetVessel} = useEntity()

  return (
    <Box bg={Colors.light} h={ms(50)} p={ms(12)}>
      <ScrollView
        horizontal
        contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
        showsHorizontalScrollIndicator={false}
      >
        {selectedEntity?.entity?.exploitationGroup?.exploitationVessels?.map(
          (exploitationVessel: ExploitationVessel, index: number) => {
            return (
              <HStack key={`Vessel-${index}`} alignItems="center">
                <TouchableOpacity
                  key={`Vessel-${index}`}
                  style={{alignItems: 'center'}}
                  onPress={() => onPress(index, exploitationVessel)}
                >
                  <Text
                    color={
                      index === fleetVessel ? Colors.azure : Colors.disabled
                    }
                    fontSize={ms(index === fleetVessel ? 16 : 14)}
                    fontWeight={index === fleetVessel ? 'bold' : 'medium'}
                  >
                    {exploitationVessel?.entity?.alias}
                  </Text>
                  {index === fleetVessel && (
                    <Box
                      bg={Colors.azure}
                      borderRadius={ms(3)}
                      h={ms(3)}
                      mt={ms(2)}
                      w={ms(70)}
                    />
                  )}
                </TouchableOpacity>
                <Box
                  borderColor="#E0E0E0"
                  borderWidth={ms(1)}
                  h={ms(50)}
                  mx={ms(8)}
                />
              </HStack>
            )
          }
        )}
      </ScrollView>
    </Box>
  )
}
