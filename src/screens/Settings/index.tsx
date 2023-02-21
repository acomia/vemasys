import React, {useEffect} from 'react'
import {Box, Center, HStack} from 'native-base'
import SettingsItem from '@bluecentury/components/SettingsItem'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets/icons'
import {Screens} from '@bluecentury/constants'
import {DrawerContentComponentProps} from '@react-navigation/drawer'
import {useSettings} from '@bluecentury/stores'
import {VersionBuildLabel} from '@bluecentury/components/version-build-label'
import {useTranslation} from 'react-i18next'
import {NoInternetConnectionMessage} from '@bluecentury/components'

const Settings = (props: DrawerContentComponentProps) => {
  const {t} = useTranslation()
  const {navigation} = props
  const isDarkMode = useSettings(state => state.isDarkMode)
  const isMobileTracking = useSettings(state => state.isMobileTracking)
  const language = useSettings(state => state.language)
  const setLanguage = useSettings(state => state.setLanguage)
  const setDarkMode = useSettings(state => state.setDarkMode)
  // const setMobileTracking = useSettings(state => state.setIsMobileTracking)
  const setIsQrScanner = useSettings(state => state.setIsQrScanner)
  const isQrScanner = useSettings(state => state.isQrScanner)

  const handleOnValueChange = () => {
    navigation.navigate('TrackingServiceDialog')
  }
  return (
    <Box
      flex="1"
      px="13"
      pt="29"
      backgroundColor={Colors.white}
      borderRadius="15"
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
        type="select"
        value="Third line text"
        iconSource={Icons.location}
        language={language}
        callback={(lang: string) => setLanguage(lang)}
      />
      <SettingsItem
        type="switch"
        value={t('deviceGps')}
        iconSource={Icons.location}
        switchState={isMobileTracking}
        callback={handleOnValueChange}
      />
      <SettingsItem
        type="switch"
        value={t('showQRScannerOnTop')}
        iconSource={Icons.qr}
        switchState={isQrScanner}
        callback={setIsQrScanner}
      />
      {/*
      <SettingsItem
        type="switch"
        value={t('darkMode')}
        iconSource={Icons.adjust}
        switchState={isDarkMode}
        callback={setDarkMode}
      />*/}
      <HStack justifyContent="center">
        <Center>
          <VersionBuildLabel />
        </Center>
      </HStack>
    </Box>
  )
}

export default Settings
