import React, {useEffect, useState} from 'react'
import {
  Linking,
  Alert,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Image as RNImage
} from 'react-native'
import {HStack, Text, Box, Button, Image, Switch, Divider} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Geolocation, {GeoPosition} from 'react-native-geolocation-service'
import {useNetInfo} from '@react-native-community/netinfo'
import BackgroundTimer from 'react-native-background-timer'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {Images} from '@bluecentury/assets'
import {useEntity, useMap} from '@bluecentury/stores'

type Props = NativeStackScreenProps<RootStackParamList>
export const GPSTracker = ({navigation}: Props) => {
  const {
    isLoadingMap,
    isMobileTrackingEnable,
    sendCurrentPosition,
    enableMobileTracking
  } = useMap()
  const {vesselDetails} = useEntity()
  const [position, setPosition] = useState<GeoPosition>(undefined)
  const [isMobileTracking, setIsMobileTracking] = useState(false)
  const netInfo = useNetInfo()

  useEffect(() => {
    setIsMobileTracking(isMobileTrackingEnable)
  }, [])

  useEffect(() => {
    if (isMobileTracking) {
      Geolocation.getCurrentPosition(
        position => {
          setPosition(position)
          sendCurrentPosition(position)
        },
        error => {
          Alert.alert(`Code ${error.code}`, error.message)
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best'
          },
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 0
        }
      )
      BackgroundTimer.runBackgroundTimer(() => {
        onBackgroundSendCurrentPosition()
      }, 60000)
    } else {
      BackgroundTimer.stopBackgroundTimer()
    }
  }, [isMobileTracking])

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openURL('app-settings:').catch(() => {
        Alert.alert('Unable to open settings')
      })
    }
    const status = await Geolocation.requestAuthorization('whenInUse')

    if (status === 'granted') {
      return true
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied')
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow Vemasys to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}}
        ]
      )
    }

    return false
  }

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS()
      return hasPermission
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )

    if (hasPermission) {
      return true
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG
      )
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG
      )
    }

    return false
  }

  const onSendCurrentPosition = async () => {
    const hasPermission = await hasLocationPermission()

    if (!hasPermission) {
      return
    }
    setIsMobileTracking(!isMobileTracking)
    enableMobileTracking()
  }

  const onBackgroundSendCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        setPosition(position)
        sendCurrentPosition(position)
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message)
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best'
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0
      }
    )
  }

  const renderTrackerSource = (sourceData: string) => {
    let source = null
    if (sourceData.includes('ais')) {
      source = Images.ais_tracker
    } else if (sourceData.includes('vematrack')) {
      source = Images.vemasys_tracker
    }
    return source
  }

  return (
    <Box flex={1} backgroundColor="rgba(0,0,0,0.5)">
      <Box
        backgroundColor="#fff"
        mb={ms(0)}
        mt="auto"
        borderTopLeftRadius={15}
        borderTopRightRadius={15}
        p={ms(15)}
      >
        <Text fontSize={ms(16)} fontWeight="bold" mt={ms(5)} mb={ms(10)}>
          GPS
        </Text>
        <Divider mb={ms(20)} />
        <HStack
          backgroundColor={Colors.white}
          borderRadius={5}
          justifyContent="space-between"
          alignItems="center"
          height={ms(50)}
          px={ms(20)}
          width="100%"
          mb={ms(10)}
          shadow={2}
        >
          <Text flex={1} fontWeight="medium">
            Last ping
          </Text>
          <Box
            flex={1}
            borderLeftWidth={ms(1)}
            borderColor="#F0F0F0"
            height="100%"
            justifyContent="center"
          >
            <Text fontWeight="medium" ml={ms(15)}>
              {!isMobileTracking
                ? moment(vesselDetails?.lastGeolocation?.locationTime).fromNow()
                : moment(position?.timestamp).fromNow()}
            </Text>
          </Box>
        </HStack>
        <HStack
          backgroundColor={Colors.white}
          borderRadius={5}
          justifyContent="space-between"
          alignItems="center"
          height={ms(50)}
          px={ms(20)}
          width="100%"
          mb={ms(10)}
          shadow={2}
        >
          <Text flex={1} fontWeight="medium">
            Data source
          </Text>
          <HStack
            flex={1}
            borderLeftWidth={ms(1)}
            borderColor="#F0F0F0"
            height="100%"
            alignItems="center"
          >
            <RNImage
              source={
                isMobileTracking
                  ? Images.mobile_tracker
                  : renderTrackerSource(
                      vesselDetails?.lastGeolocation?.sourceOfData
                    )
              }
              style={{tintColor: '#44A7B9', marginLeft: 20}}
            />
            <Text ml={ms(10)}>
              {!isMobileTracking
                ? vesselDetails?.lastGeolocation?.sourceOfData
                : 'Mobile phone'}
            </Text>
          </HStack>
        </HStack>
        <HStack
          backgroundColor={Colors.white}
          borderRadius={5}
          justifyContent="space-between"
          alignItems="center"
          height={ms(50)}
          px={ms(20)}
          width="100%"
          mb={ms(10)}
          shadow={2}
        >
          <Image
            alt="my-location"
            source={Images.my_location}
            tintColor={Colors.primary}
            mr={ms(10)}
            width={ms(24)}
            height={ms(24)}
          />
          <Text flex={1} fontWeight="medium">
            Set this device as Vessel GPS
          </Text>
          <Switch
            size="md"
            value={isMobileTracking}
            onValueChange={onSendCurrentPosition}
          />
        </HStack>
        <HStack
          backgroundColor={Colors.white}
          borderRadius={5}
          justifyContent="space-between"
          alignItems="center"
          height={ms(50)}
          px={ms(20)}
          width="100%"
          mb={ms(10)}
          shadow={2}
        >
          <Text flex={1} fontWeight="medium">
            GPS satelites
          </Text>
          <HStack
            flex={1}
            borderLeftWidth={ms(1)}
            borderColor="#F0F0F0"
            height="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text ml={ms(15)}>{netInfo.type}</Text>
            <Icon
              name="signal"
              size={ms(16)}
              color={Colors.primary}
              style={{marginLeft: 15}}
            />
          </HStack>
        </HStack>
        <HStack
          backgroundColor={Colors.white}
          borderRadius={5}
          justifyContent="space-between"
          alignItems="center"
          height={ms(50)}
          px={ms(20)}
          width="100%"
          mb={ms(10)}
          shadow={2}
        >
          <Text flex={1} fontWeight="medium">
            Position
          </Text>
          <Box
            flex={1}
            borderLeftWidth={ms(1)}
            borderColor="#F0F0F0"
            height="100%"
            justifyContent="center"
          >
            <Text fontWeight="medium" ml={ms(15)}>
              {!isMobileTracking
                ? `${vesselDetails?.lastGeolocation?.latitude} | ${vesselDetails?.lastGeolocation?.longitude}`
                : isLoadingMap
                ? 'Loading...'
                : `${position?.coords?.latitude} | ${position?.coords?.longitude}`}
            </Text>
          </Box>
        </HStack>
        <Button
          my={ms(15)}
          backgroundColor={Colors.light}
          onPress={() => navigation.goBack()}
        >
          <Text fontWeight="medium" color={Colors.disabled}>
            Dismiss
          </Text>
        </Button>
      </Box>
    </Box>
  )
}