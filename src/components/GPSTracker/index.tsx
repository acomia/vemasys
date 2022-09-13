import React, {useEffect, useState} from 'react'
import {
  Linking,
  Alert,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Image as RNImage
} from 'react-native'
import {
  HStack,
  Text,
  Box,
  Button,
  Image,
  Switch,
  Divider,
  Actionsheet,
  useDisclose,
  AlertDialog
} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Geolocation, {GeoPosition} from 'react-native-geolocation-service'
import {useNetInfo} from '@react-native-community/netinfo'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useEntity, useMap, useSettings} from '@bluecentury/stores'

type Props = NativeStackScreenProps<RootStackParamList>
export const GPSTracker = ({navigation}: Props) => {
  const isMobileTracking = useSettings(state => state.isMobileTracking)
  const isLoadingMap = useMap(state => state.isLoadingMap)
  const vesselDetails = useEntity(state => state.vesselDetails)
  const netInfo = useNetInfo()
  const [position, setPosition] = useState<GeoPosition>()
  const [isOpen, setIsOpen] = React.useState(false)

  useEffect(() => {
    if (isMobileTracking) {
      Geolocation.getCurrentPosition(pos => {
        console.log('Geolocation.getCurrentPosition ', pos)
        setPosition(pos)
      })
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
      console.log('hasPermissionIOS ', hasPermission)
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

  const handleOnValueChange = () => {
    // console.log('value ', value)
    // if (value) {
    //   const hasPermission = await hasLocationPermission()

    //   if (!hasPermission) {
    //     console.log('hmmm')
    //     return
    //   }
    // }
    // setIsMobileTracking(value)
    // navigation.goBack()
    // setIsOpen(!isOpen)
    navigation.navigate('TrackingServiceDialog')
  }

  const renderTrackerSource = (sourceData: string | undefined) => {
    let source = null
    if (typeof sourceData !== 'undefined') {
      if (sourceData.includes('ais')) {
        source = Icons.mobile_tracker
      } else if (sourceData.includes('vematrack')) {
        source = Icons.mobile_tracker
      }
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
                  ? Icons.mobile_tracker
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
            source={Icons.location_alt}
            mr={ms(10)}
            width={ms(20)}
            height={ms(20)}
          />
          <Text flex={1} fontWeight="medium">
            Set this device as Vessel GPS
          </Text>
          <Switch
            size="md"
            value={isMobileTracking}
            onTouchStart={handleOnValueChange}
            onToggle={handleOnValueChange}
            // onValueChange={handleOnValueChange}
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
          backgroundColor={Colors.azure}
          onPress={() => navigation.goBack()}
          _pressed={{
            bgColor: Colors.primary
          }}
        >
          Dismiss
        </Button>
      </Box>
    </Box>
  )
}
