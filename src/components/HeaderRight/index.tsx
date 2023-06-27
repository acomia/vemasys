import React from 'react'
import {Box, HStack, Pressable} from 'native-base'
import {IconButton} from '@bluecentury/components'
import {useMap, useSettings} from '@bluecentury/stores'
import {useNavigation} from '@react-navigation/native'
import {Screens} from '@bluecentury/constants'
import {ms} from 'react-native-size-matters'
import {Icons} from '@bluecentury/assets'
import {GPSAnimated} from '@bluecentury/components/gps-animated'

const HeaderRight = () => {
  const {activeFormations, isGPSOpen, setGPSOpen} = useMap()
  const navigation = useNavigation()
  const {isQrScanner} = useSettings()

  return (
    <Box alignItems="center" flexDirection="row" mr={2}>
      <HStack space="3">
        {activeFormations.length ? (
          <IconButton
            size={ms(25)}
            source={Icons.formations}
            onPress={() => navigation.navigate(Screens.Formations)}
          />
        ) : null}
        {isQrScanner ? (
          <IconButton
            size={ms(25)}
            source={Icons.qr}
            onPress={() => navigation.navigate(Screens.QRScanner)}
          />
        ) : null}
        <Pressable
          size={ms(40)}
          onPress={() => {
            setGPSOpen(true)
          }}
        >
          <GPSAnimated isOpen={isGPSOpen} />
        </Pressable>
      </HStack>
    </Box>
  )
}

export default HeaderRight
