import React from 'react'
import {Box, Text, Image, Center, VStack} from 'native-base'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer'
import {Colors} from '@bluecentury/styles'
import {Images} from '@bluecentury/assets'
import {ms} from 'react-native-size-matters'

const Drawer: React.FC<DrawerContentComponentProps> = props => {
  return (
    <Box flex="1" safeArea>
      <DrawerContentScrollView {...props}>
        <VStack>
          <Center my={ms(20)}>
            <Image
              alt="Company Logo"
              source={Images.logo}
              resizeMode="contain"
              w={ms(200)}
              h={ms(60)}
            />
          </Center>
          <DrawerItemList {...props} />
        </VStack>
      </DrawerContentScrollView>
      <Center p="5">
        <Text color={Colors.disabled}>Version: 1.0</Text>
      </Center>
    </Box>
  )
}

export default Drawer
