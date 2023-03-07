import React, {useEffect, useRef, useState} from 'react'
import {
  HStack,
  Text,
  Box,
  Button,
  Image,
  Switch,
  Icon,
  Divider,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {useNetInfo} from '@react-native-community/netinfo'
import moment from 'moment'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useEntity, useSettings} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'
import {useNavigation} from '@react-navigation/native'

type Props = {
  close: () => void
}

export const GPSTracker = ({close}: Props) => {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const isMobileTracking = useSettings(state => state.isMobileTracking)
  const vesselDetails = useEntity(state => state.vesselDetails)
  const netInfo = useNetInfo()
  let refreshId = useRef<any>()
  const {updateVesselDetails} = useEntity()

  useEffect(() => {
    refreshId.current = setInterval(() => {
      // Run updated vessel status
      updateVesselDetails()
    }, 30000)
    return () => clearInterval(refreshId.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnValueChange = () => {
    navigation.navigate('TrackingServiceDialog')
  }

  const renderTrackerSourceImage = () => {
    const sourceData = vesselDetails?.lastGeolocation?.sourceOfData
    if (isMobileTracking) return Icons.mobile_tracker
    if (typeof sourceData === 'undefined') return null
    if (sourceData.includes('ais')) return Icons.ais_tracker
    if (sourceData.includes('vematrack')) return Icons.vemasys_tracker
    return Icons.mobile_tracker
  }

  const renderTrackerSourceText = () => {
    //TODO we need to define should we always show 'Current device' as data source if gps tracker is enabled or should we take this data from backend
    const sourceData = vesselDetails?.lastGeolocation?.sourceOfData
    if (typeof sourceData === 'undefined') return 'Unknown'
    if (sourceData.includes('ais')) return 'AIS Hub'
    if (sourceData.includes('vematrack sp')) return 'Vematrack SP'
    if (sourceData.includes('vematrack')) return 'Vematrack'
    if (sourceData.includes('astra')) return 'ASTRA Paging'
    if (sourceData.includes('marine')) return 'Marine Traffic'
    if (sourceData.includes('api tracker vt')) return 'API Tracker VT'
    if (sourceData.includes('api')) return 'API'
  }

  return (
    <Box
      backgroundColor="rgba(0,0,0,0.5)"
      bottom={0}
      height="50%"
      position="absolute"
      width="100%"
    >
      <Box
        backgroundColor="#fff"
        borderTopLeftRadius={15}
        borderTopRightRadius={15}
        mb={ms(0)}
        mt="auto"
        p={ms(15)}
      >
        <Text bold fontSize={ms(16)} mb={ms(10)} mt={ms(5)}>
          {t('gps')}
        </Text>
        <Divider mb={ms(20)} />
        <HStack
          alignItems="center"
          backgroundColor={Colors.white}
          borderRadius={5}
          height={ms(50)}
          justifyContent="space-between"
          mb={ms(10)}
          px={ms(20)}
          shadow={2}
          width="100%"
        >
          <Text flex="1" fontWeight="medium">
            {t('lastPing')}
          </Text>
          <Box
            borderColor="#F0F0F0"
            borderLeftWidth={ms(1)}
            flex="1"
            height="100%"
            justifyContent="center"
          >
            <Text fontWeight="medium" ml={ms(15)}>
              {moment(
                vesselDetails?.lastGeolocation?.lastIterationTime
              ).fromNow()}
            </Text>
          </Box>
        </HStack>
        <HStack
          alignItems="center"
          backgroundColor={Colors.white}
          borderRadius={5}
          height={ms(50)}
          justifyContent="space-between"
          mb={ms(10)}
          px={ms(20)}
          shadow={2}
          width="100%"
        >
          <Text flex="1" fontWeight="medium">
            {t('dataSource')}
          </Text>
          <HStack
            alignItems="center"
            borderColor="#F0F0F0"
            borderLeftWidth={ms(1)}
            flex="1"
            height="100%"
          >
            <Image
              alt="tracker-source-image"
              marginLeft={3}
              source={renderTrackerSourceImage()}
              tintColor="#44A7B9"
            />
            <Text ml={ms(10)}>{renderTrackerSourceText()}</Text>
          </HStack>
        </HStack>
        <HStack
          alignItems="center"
          backgroundColor={Colors.white}
          borderRadius={5}
          height={ms(50)}
          justifyContent="space-between"
          mb={ms(10)}
          px={ms(20)}
          shadow={2}
          width="100%"
        >
          <Image
            alt="my-location"
            height={ms(20)}
            mr={ms(10)}
            source={Icons.location_alt}
            width={ms(20)}
          />
          <Text flex="1" fontWeight="medium">
            {t('deviceGps')}
          </Text>
          <Switch
            size="md"
            value={isMobileTracking}
            onToggle={handleOnValueChange}
            onTouchStart={handleOnValueChange}
          />
        </HStack>
        <HStack
          alignItems="center"
          backgroundColor={Colors.white}
          borderRadius={5}
          height={ms(50)}
          justifyContent="space-between"
          mb={ms(10)}
          px={ms(20)}
          shadow={2}
          width="100%"
        >
          <Text flex="1" fontWeight="medium">
            {t('gpsSatellites')}
          </Text>
          <HStack
            alignItems="center"
            borderColor="#F0F0F0"
            borderLeftWidth={ms(1)}
            flex="1"
            height="100%"
            justifyContent="space-between"
          >
            <Text ml={ms(15)} textTransform="capitalize">
              {netInfo.type}
            </Text>
            <Icon
              as={<FontAwesome5 name="signal" />}
              color={Colors.primary}
              ml={ms(25)}
              size={ms(16)}
            />
          </HStack>
        </HStack>
        <HStack
          alignItems="center"
          backgroundColor={Colors.white}
          borderRadius={5}
          height={ms(50)}
          justifyContent="space-between"
          mb={ms(10)}
          px={ms(20)}
          shadow={2}
          width="100%"
        >
          <Text flex="1" fontWeight="medium">
            {t('position')}
          </Text>
          <Box
            borderColor="#F0F0F0"
            borderLeftWidth={ms(1)}
            flex="1"
            height="100%"
            justifyContent="center"
          >
            <Text fontWeight="medium" ml={ms(15)}>
              {`${vesselDetails?.lastGeolocation?.latitude} | ${vesselDetails?.lastGeolocation?.longitude}`}
            </Text>
          </Box>
        </HStack>
        <Button
          _pressed={{
            bgColor: Colors.primary,
          }}
          backgroundColor={Colors.azure}
          // onPress={() => navigation.goBack()}
          my={ms(15)}
          onPress={() => close()}
        >
          {t('dismiss')}
        </Button>
      </Box>
    </Box>
  )
}
