import React from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Button, HStack, Image, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {useNavigation} from '@react-navigation/native'
import {useEntity} from '@bluecentury/stores'
import {Icons} from '@bluecentury/assets'

interface Props {
  isDisabled: boolean
  setDisable: React.Dispatch<React.SetStateAction<boolean>>
  toScreen: string
}

const BottomBanner = ({isDisabled, setDisable, toScreen}: Props) => {
  const navigation = useNavigation()
  const screenWidth = useWindowDimensions().width
  const {selectedVessel} = useEntity()

  return (
    <Box
      alignItems="center"
      bottom={ms(25)}
      position="absolute"
      w={screenWidth}
    >
      <Button
        alignSelf="center"
        backgroundColor={isDisabled ? Colors.disabled : Colors.white}
        borderColor={Colors.primary_light}
        borderWidth="1"
        disabled={isDisabled}
        w={screenWidth - ms(20)}
        onPress={() => {
          setDisable(true)
          navigation.navigate(toScreen)
        }}
      >
        <HStack
          alignItems="center"
          flex={1}
          h={ms(42)}
          justifyContent="space-between"
          px={ms(10)}
          w={screenWidth - ms(20)}
        >
          <HStack alignItems="center">
            <Image
              alt="vessel"
              h={ms(30)}
              mr={ms(10)}
              source={Icons.vessel}
              w={ms(30)}
            />
            <Text bold fontSize="16">
              {selectedVessel?.alias || null}
            </Text>
          </HStack>
          <Image
            alt="planning-map-icon"
            h={ms(30)}
            source={toScreen === 'Planning' ? Icons.planning : Icons.map}
            w={ms(30)}
          />
        </HStack>
      </Button>
    </Box>
  )
}

export default BottomBanner
