import React from 'react'
import {ScrollView} from 'react-native'
import {Box, Image, VStack, Divider, Icon} from 'native-base'
import {DrawerContentComponentProps} from '@react-navigation/drawer'
import {ms} from 'react-native-size-matters'
import {useTranslation} from 'react-i18next'

import MenuButton from '../MenuButton'
import {
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_CHARTER_MANAGE,
  Screens,
} from '@bluecentury/constants'
import {Icons, Images} from '@bluecentury/assets'
import {useEntity} from '@bluecentury/stores'

const Sidebar = (props: DrawerContentComponentProps) => {
  const {t} = useTranslation()
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
  const hasCharterPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_CHARTER_MANAGE
  )

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
            {t('notifications')}
          </MenuButton>
          <MenuButton
            active={currentRoute === Screens.MapView}
            onPress={() => handlePressMenu(Screens.MapView)}
            iconSource={Icons.map}
          >
            {t('mapView')}
          </MenuButton>
          <MenuButton
            active={currentRoute === Screens.Planning}
            onPress={() => handlePressMenu(Screens.Planning)}
            iconSource={Icons.calendar}
          >
            {t('planning')}
          </MenuButton>
          {hasCharterPermission ? (
            <MenuButton
              active={currentRoute === Screens.Charters}
              onPress={() => handlePressMenu(Screens.Charters)}
              iconSource={Icons.fileContract}
            >
              {t('charters')}
            </MenuButton>
          ) : null}
          <MenuButton
            active={currentRoute === Screens.Technical}
            onPress={() => handlePressMenu(Screens.Technical)}
            iconSource={Icons.tools}
          >
            {t('technical')}
          </MenuButton>
          {entityRole.toLowerCase() === 'admin' ? (
            <MenuButton
              active={currentRoute === ''}
              onPress={() => handlePressMenu(Screens.Financial)}
              iconSource={Icons.card}
            >
              {t('financial')}
            </MenuButton>
          ) : null}
          <MenuButton
            active={currentRoute === Screens.Information}
            onPress={() => handlePressMenu(Screens.Information)}
            iconSource={Icons.infoCircle}
            disabled
          >
            {t('information')}
          </MenuButton>
          <MenuButton
            active={currentRoute === Screens.ToDo}
            onPress={() => handlePressMenu(Screens.ToDo)}
            iconSource={Icons.clipboardCheck}
            disabled
          >
            {t('toDo')}
          </MenuButton>
          <MenuButton
            active={currentRoute === Screens.Crew}
            onPress={() => handlePressMenu(Screens.Crew)}
            iconSource={Icons.userHardHat}
            disabled
          >
            {t('crew')}
          </MenuButton>
          <MenuButton
            active={currentRoute === Screens.QSHE}
            onPress={() => handlePressMenu(Screens.QSHE)}
            iconSource={Icons.hardHat}
            disabled
          >
            {t('qshe')}
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
          {t('changeRole')}
        </MenuButton>

        <MenuButton
          active={currentRoute === Screens.Settings}
          onPress={() => handlePressMenu(Screens.Settings)}
          iconSource={Icons.cog}
        >
          {t('settings')}
        </MenuButton>
      </VStack>
    </Box>
  )
}

export default Sidebar
