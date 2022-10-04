import React from 'react'
import {Box, Image, VStack, Divider} from 'native-base'
import {DrawerContentComponentProps} from '@react-navigation/drawer'
import {Icons, Images} from '@bluecentury/assets'
import {ms} from 'react-native-size-matters'
import MenuButton from '../MenuButton'
import {Screens} from '@bluecentury/constants'

const Sidebar = (props: DrawerContentComponentProps) => {
  const {state, navigation} = props
  const currentRoute = state.routeNames[state.index]
  const handlePressMenu = (name: string) => {
    navigation.navigate(name)
  }
  return (
    <Box flex={1} safeArea p={ms(10)} w={240}>
      <VStack flex={1}>
        <Image
          alt="Company Logo"
          source={Images.logo}
          resizeMode="contain"
          w={ms(150)}
          h={ms(60)}
          my={ms(20)}
        />
        <MenuButton
          active={currentRoute === Screens.Notifications}
          onPress={() => handlePressMenu(Screens.Notifications)}
          iconSource={Icons.notification}
        >
          Notifications
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.MapView}
          onPress={() => handlePressMenu(Screens.MapView)}
          iconSource={Icons.map}
        >
          Map View
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.Planning}
          onPress={() => handlePressMenu(Screens.Planning)}
          iconSource={Icons.calendar}
        >
          Planning
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.Charters}
          onPress={() => handlePressMenu(Screens.Charters)}
          iconSource={Icons.fileContract}
        >
          Charters
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.Technical}
          onPress={() => handlePressMenu(Screens.Technical)}
          iconSource={Icons.tools}
        >
          Technical
        </MenuButton>
        <MenuButton
          active={currentRoute === ''}
          onPress={() => handlePressMenu(Screens.Financial)}
          iconSource={Icons.card}
          // disabled
        >
          Financial
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.Information}
          onPress={() => handlePressMenu(Screens.Information)}
          iconSource={Icons.infoCircle}
          disabled
        >
          Information
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.ToDo}
          onPress={() => handlePressMenu(Screens.ToDo)}
          iconSource={Icons.clipboardCheck}
          disabled
        >
          To Do
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.Crew}
          onPress={() => handlePressMenu(Screens.Crew)}
          iconSource={Icons.userHardHat}
          disabled
        >
          Crew
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.QSHE}
          onPress={() => handlePressMenu(Screens.QSHE)}
          iconSource={Icons.hardHat}
          disabled
        >
          QSHE
        </MenuButton>
      </VStack>

      <Divider />
      <VStack>
        <MenuButton
          active={currentRoute === Screens.ChangeRole}
          onPress={() => handlePressMenu(Screens.ChangeRole)}
          iconSource={Icons.userCircle}
        >
          Change role
        </MenuButton>

        <MenuButton
          active={currentRoute === Screens.Settings}
          onPress={() => handlePressMenu(Screens.Settings)}
          iconSource={Icons.cog}
          // disabled
        >
          Settings
        </MenuButton>
      </VStack>
    </Box>
  )
}

export default Sidebar
