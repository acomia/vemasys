import React from 'react'
import {Box, HStack, ScrollView, Text} from 'native-base'
import {TouchableOpacity} from 'react-native'
import {useEntity} from '@bluecentury/stores'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

type Props = {
  onPress: (index: number, exploitationVessel: any) => void
}

export const FleetHeader = ({onPress}: Props) => {
  const {selectedEntity, fleetVessel} = useEntity()

  return (
    <Box p={ms(12)} h={ms(50)} bg={Colors.light}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
      >
        {selectedEntity?.entity?.exploitationGroup?.exploitationVessels?.map(
          (exploitationVessel: any, index: number) => {
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
                      h={ms(3)}
                      borderRadius={ms(3)}
                      w={ms(70)}
                      mt={ms(2)}
                    />
                  )}
                </TouchableOpacity>
                <Box
                  borderWidth={ms(1)}
                  borderColor="#E0E0E0"
                  mx={ms(8)}
                  h={ms(50)}
                />
              </HStack>
            )
          }
        )}
      </ScrollView>
    </Box>
  )
}
