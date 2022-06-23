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
          active={currentRoute === 'Notification'}
          onPress={() => handlePressMenu(Screens.Notifications)}
          iconSource={icons.notification}
        >
          Notifications
        </MenuButton>
        <MenuButton
          active={currentRoute === 'MapView'}
          onPress={() => handlePressMenu(Screens.MapView)}
          iconSource={icons.map}
        >
          Map View
        </MenuButton>
        <MenuButton
          active={currentRoute === ''}
          onPress={() => handlePressMenu(Screens.Planning)}
          iconSource={icons.calendar}
        >
          Planning
        </MenuButton>
        <MenuButton
          active={currentRoute === ''}
          onPress={() => handlePressMenu(Screens.Charters)}
          iconSource={icons.fileContract}
        >
          Charters
        </MenuButton>
        <MenuButton
          active={currentRoute === ''}
          onPress={() => handlePressMenu(Screens.Technical)}
          iconSource={icons.tools}
        >
          Technical
        </MenuButton>
        <MenuButton
          active={currentRoute === ''}
          onPress={() => handlePressMenu(Screens.Financial)}
          iconSource={icons.card}
        >
          Financial
        </MenuButton>
        <MenuButton
          active={currentRoute === ''}
          onPress={() => handlePressMenu(Screens.Information)}
          iconSource={icons.infoCircle}
        >
          Information
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.ToDo}
          onPress={() => handlePressMenu(Screens.ToDo)}
          iconSource={icons.clipboardCheck}
        >
          To Do
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.Crew}
          onPress={() => handlePressMenu(Screens.Crew)}
          iconSource={icons.userHardHat}
        >
          Crew
        </MenuButton>
        <MenuButton
          active={currentRoute === Screens.QSHE}
          onPress={() => handlePressMenu(Screens.QSHE)}
          iconSource={icons.hardHat}
        >
          QSHE
        </MenuButton>
      </VStack>

      <Divider />
      <VStack>
        <MenuButton
          active={currentRoute === Screens.ChangeRole}
          onPress={() => handlePressMenu(Screens.ChangeRole)}
          iconSource={icons.userCircle}
        >
          Change role
        </MenuButton>

        <MenuButton
          active={currentRoute === Screens.Settings}
          onPress={() => handlePressMenu(Screens.Settings)}
          iconSource={icons.cog}
        >
          Settings
        </MenuButton>
      </VStack>
    </Box>
  )
}

export default Sidebar
