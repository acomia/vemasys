import React from 'react'
import {ScrollView} from 'react-native'
import {Box, Image, VStack, Divider, Icon} from 'native-base'
import {DrawerContentComponentProps} from '@react-navigation/drawer'
import {ms} from 'react-native-size-matters'

import MenuButton from '../MenuButton'
import {Screens} from '@bluecentury/constants'
import {Icons, Images} from '@bluecentury/assets'
import {useEntity} from '@bluecentury/stores'

const Sidebar = (props: DrawerContentComponentProps) => {
  const {state, navigation} = props
  const {pendingRoles, entityUsers, selectedEntity, entityRole} = useEntity()
  let uniqPendingRoles: any[] = []
  if (pendingRoles) {
    uniqPendingRoles = pendingRoles?.filter(
      pr => !entityUsers.some(eu => pr.entity.id === eu.entity.id)
    )
  }

  const currentRoute = state.routeNames[state.index]
  const handlePressMenu = (name: string) => {
    navigation.navigate(name)
  }

  console.log('entity', selectedEntity?.role)

  return (
    <Box flex="1" safeArea p={ms(10)}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex="1">
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
          {entityRole.toLowerCase() === 'admin' ? (
            <MenuButton
              active={currentRoute === ''}
              onPress={() => handlePressMenu(Screens.Financial)}
              iconSource={Icons.card}
              // disabled
            >
              Financial
            </MenuButton>
          ) : null}
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
      </ScrollView>
      <Divider />
      <VStack>
        <MenuButton
          active={currentRoute === Screens.ChangeRole}
          onPress={() => handlePressMenu(Screens.ChangeRole)}
          iconSource={Icons.userCircle}
          rightIcon={
            uniqPendingRoles?.length > 0 ? Icons.status_exclamation : undefined
          }
        >
          Change role
        </MenuButton>

        <MenuButton
          active={currentRoute === Screens.Settings}
          onPress={() => handlePressMenu(Screens.Settings)}
          iconSource={Icons.cog}
        >
          Settings
        </MenuButton>
      </VStack>
    </Box>
  )
}

export default Sidebar
