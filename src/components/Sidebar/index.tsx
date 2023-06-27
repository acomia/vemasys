import React from 'react'
import {ScrollView} from 'react-native'
import {Box, Image, VStack, Divider} from 'native-base'
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
import {useCharters, useEntity, useNotif} from '@bluecentury/stores'

const Sidebar = (props: DrawerContentComponentProps) => {
  const {t} = useTranslation()
  const {state, navigation} = props
  const {pendingRoles, entityUsers, selectedEntity, entityRole} = useEntity()
  const {notificationBadge} = useNotif()
  const {chartersBadge} = useCharters()
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
    <Box safeArea flex="1" p={ms(10)}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex="1">
          <Image
            alt="Company Logo"
            h={ms(60)}
            my={ms(20)}
            resizeMode="contain"
            source={Images.logo}
            w={ms(150)}
          />
          <MenuButton
            active={currentRoute === Screens.Notifications}
            badge={notificationBadge}
            iconSource={Icons.notification}
            onPress={() => handlePressMenu(Screens.Notifications)}
          >
            {t('notifications')}
          </MenuButton>
          <MenuButton
            active={currentRoute === Screens.MapView}
            iconSource={Icons.map_marked}
            onPress={() => handlePressMenu(Screens.MapView)}
          >
            {t('mapView')}
          </MenuButton>
          <MenuButton
            active={currentRoute === Screens.Planning}
            iconSource={Icons.calendar}
            onPress={() => handlePressMenu(Screens.Planning)}
          >
            {t('planning')}
          </MenuButton>
          {hasCharterPermission ? (
            <MenuButton
              active={currentRoute === Screens.Charters}
              badge={chartersBadge}
              iconSource={Icons.fileContract}
              onPress={() => handlePressMenu(Screens.Charters)}
            >
              {t('charters')}
            </MenuButton>
          ) : null}
          <MenuButton
            active={currentRoute === Screens.Technical}
            iconSource={Icons.tools}
            onPress={() => handlePressMenu(Screens.Technical)}
          >
            {t('technical')}
          </MenuButton>
          {entityRole.toLowerCase() === 'admin' ? (
            <MenuButton
              active={currentRoute === ''}
              iconSource={Icons.card}
              onPress={() => handlePressMenu(Screens.Financial)}
            >
              {t('financial')}
            </MenuButton>
          ) : null}
          <MenuButton
            disabled
            active={currentRoute === Screens.Information}
            iconSource={Icons.infoCircle}
            onPress={() => handlePressMenu(Screens.Information)}
          >
            {t('information')}
          </MenuButton>
          <MenuButton
            disabled
            active={currentRoute === Screens.ToDo}
            iconSource={Icons.clipboardCheck}
            onPress={() => handlePressMenu(Screens.ToDo)}
          >
            {t('toDo')}
          </MenuButton>
          <MenuButton
            disabled
            active={currentRoute === Screens.Crew}
            iconSource={Icons.userHardHat}
            onPress={() => handlePressMenu(Screens.Crew)}
          >
            {t('crew')}
          </MenuButton>
          <MenuButton
            disabled
            active={currentRoute === Screens.QSHE}
            iconSource={Icons.hardHat}
            onPress={() => handlePressMenu(Screens.QSHE)}
          >
            {t('qshe')}
          </MenuButton>
        </VStack>
      </ScrollView>
      <Divider />
      <VStack>
        <MenuButton
          rightIcon={
            uniqPendingRoles?.length > 0 ? Icons.status_exclamation : undefined
          }
          active={currentRoute === Screens.ChangeRole}
          iconSource={Icons.userCircle}
          onPress={() => handlePressMenu(Screens.ChangeRole)}
        >
          {t('changeRole')}
        </MenuButton>

        <MenuButton
          active={currentRoute === Screens.Settings}
          iconSource={Icons.cog}
          onPress={() => handlePressMenu(Screens.Settings)}
        >
          {t('settings')}
        </MenuButton>
      </VStack>
    </Box>
  )
}

export default Sidebar
