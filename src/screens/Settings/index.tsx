import React, {useEffect, useState} from 'react'
import {Box, Center, HStack} from 'native-base'
import SettingsItem from '@bluecentury/components/SettingsItem'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets/icons'
import {Screens} from '@bluecentury/constants'
import {DrawerContentComponentProps} from '@react-navigation/drawer'
import {useSettings, useEntity} from '@bluecentury/stores'
import {VersionBuildLabel} from '@bluecentury/components/version-build-label'
import {useTranslation} from 'react-i18next'
import {
  NoInternetConnectionMessage,
  ResetPasswordModal,
} from '@bluecentury/components'

const Settings = (props: DrawerContentComponentProps) => {
  const {t} = useTranslation()
  const {navigation} = props
  const {
    entityType,
    entityId,
    entityUsers,
    entityUserId,
    getUsersWaitingForApprove,
    usersWaitingForApprove,
  } = useEntity()
  const [hasPermissionToManageUsers, setHasPermissionToManageUsers] =
    useState(false)
  // const isDarkMode = useSettings(state => state.isDarkMode)
  // const isMobileTracking = useSettings(state => state.isMobileTracking)
  // const language = useSettings(state => state.language)
  // const setLanguage = useSettings(state => state.setLanguage)
  // const setDarkMode = useSettings(state => state.setDarkMode)
  // // const setMobileTracking = useSettings(state => state.setIsMobileTracking)
  // const setIsQrScanner = useSettings(state => state.setIsQrScanner)
  // const isQrScanner = useSettings(state => state.isQrScanner)
  const {
    isDarkMode,
    env,
    isMobileTracking,
    language,
    setLanguage,
    setDarkMode,
    setIsQrScanner,
    isQrScanner,
  } = useSettings()
  const isExploitationVessel = entityType === 'ExploitationVessel'

  useEffect(() => {
    if (entityId) {
      getUsersWaitingForApprove(entityId)
    }
  }, [entityId])

  useEffect(() => {
    if (entityUsers && entityUserId) {
      const currentEntityUser = entityUsers.find(
        user => user.id === entityUserId
      )

      if (currentEntityUser) {
        setHasPermissionToManageUsers(
          currentEntityUser.role.permissions.includes(
            'ROLE_PERMISSION_USER_MANAGE'
          )
        )
      }
    }
  }, [entityUsers, entityUserId])

  const handleOnValueChange = () => {
    navigation.navigate('TrackingServiceDialog')
  }
  return (
    <Box
      backgroundColor={Colors.white}
      borderRadius="15"
      flex="1"
      pt="29"
      px="13"
    >
      <NoInternetConnectionMessage />
      {/* <SettingsItem type="navigation"
        value={t('userInfo')}
        iconSource={Icons.user}
        callback={() => {
          navigation.navigate(Screens.Information)
        }}
      />
      <SettingsItem
        type="navigation"
        value={t('vesselInfo')}
        iconSource={Icons.ship}
        callback={() => {
          navigation.navigate(Screens.Planning)
        }}
      />
        */}
      <SettingsItem
        callback={(lang: string) => setLanguage(lang, true)}
        iconSource={Icons.location}
        language={language}
        type="select"
        value="Third line text"
      />
      <SettingsItem
        callback={handleOnValueChange}
        disabled={!isExploitationVessel}
        iconSource={Icons.location}
        switchState={isMobileTracking}
        type="switch"
        value={t('deviceGps')}
      />
      <SettingsItem
        callback={setIsQrScanner}
        iconSource={Icons.qr}
        switchState={isQrScanner}
        type="switch"
        value={t('showQRScannerOnTop')}
      />
      {/*
      <SettingsItem
        type="switch"
        value={t('darkMode')}
        iconSource={Icons.adjust}
        switchState={isDarkMode}
        callback={setDarkMode}
      />*/}
      <ResetPasswordModal />

      {/** remove the checking of env when going to production */}

      <SettingsItem
        callback={() => {
          navigation.navigate(Screens.MeasurementTable)
        }}
        iconSource={Icons.ruler}
        isEntireBlockPressable={true}
        type="navigation"
        value={t('measurementTable')}
      />
      {hasPermissionToManageUsers ? (
        <SettingsItem
          callback={() => {
            navigation.navigate(Screens.UserRequests)
          }}
          badgeValue={usersWaitingForApprove.length}
          iconSource={Icons.userRequest}
          isEntireBlockPressable={true}
          type="navigation"
          value={t('userRequests')}
        />
      ) : null}
      <HStack justifyContent="center">
        <Center>
          <VersionBuildLabel />
        </Center>
      </HStack>
    </Box>
  )
}

export default Settings
