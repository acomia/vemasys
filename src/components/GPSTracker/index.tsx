import React, {useEffect, useState} from 'react'
import {Image as RNImage} from 'react-native'
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
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {useNetInfo} from '@react-native-community/netinfo'
import moment from 'moment'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useEntity, useMap, useSettings} from '@bluecentury/stores'
// import BackgroundGeolocation, {
//   Location,
// } from '@mauron85/react-native-background-geolocation'
import BackgroundGeolocation, {
  Location,
  Subscription
} from 'react-native-background-geolocation'

type Props = NativeStackScreenProps<RootStackParamList>
export const GPSTracker = ({navigation}: Props) => {
  const isMobileTracking = useSettings(state => state.isMobileTracking)
  const isLoadingMap = useMap(state => state.isLoadingMap)
  const vesselDetails = useEntity(state => state.vesselDetails)
  const netInfo = useNetInfo()
  const [position, setPosition] = useState<Location>()

  // useEffect(() => {
  //   if (isMobileTracking) {
  //     console.log('isMobileTracking ', isMobileTracking)
  //     BackgroundGeolocation.checkStatus(status => {
  //       if (!status.isRunning) {
  //         BackgroundGeolocation.start()
  //       }
  //     })
  //     BackgroundGeolocation.getCurrentLocation(loc => setPosition(loc))
  //   }
  // }, [isMobileTracking])

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
    if (isMobileTracking) return 'Current device'
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
    <Box flex="1" backgroundColor="rgba(0,0,0,0.5)">
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
          <Text flex="1" fontWeight="medium">
            Last ping
          </Text>
          <Box
            flex="1"
            borderLeftWidth={ms(1)}
            borderColor="#F0F0F0"
            height="100%"
            justifyContent="center"
          >
            <Text fontWeight="medium" ml={ms(15)}>
              {/*{!isMobileTracking*/}
              {/*  ? moment(vesselDetails?.lastGeolocation?.locationTime).fromNow()*/}
              {/*  : moment(position?.time).fromNow()}*/}
              {moment(
                vesselDetails?.lastGeolocation?.lastIterationTime
              ).fromNow()}
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
          <Text flex="1" fontWeight="medium">
            Data source
          </Text>
          <HStack
            flex="1"
            borderLeftWidth={ms(1)}
            borderColor="#F0F0F0"
            height="100%"
            alignItems="center"
          >
            <Image
              marginLeft={3}
              source={renderTrackerSourceImage()}
              tintColor="#44A7B9"
              alt="tracker-source-image"
            />
            <Text ml={ms(10)}>{renderTrackerSourceText()}</Text>
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
          <Text flex="1" fontWeight="medium">
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
          <Text flex="1" fontWeight="medium">
            GPS satelites
          </Text>
          <HStack
            flex="1"
            borderLeftWidth={ms(1)}
            borderColor="#F0F0F0"
            height="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text ml={ms(15)} textTransform="capitalize">
              {netInfo.type}
            </Text>
            <Icon
              as={<FontAwesome5 name="signal" />}
              size={ms(16)}
              color={Colors.primary}
              ml={ms(25)}
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
          <Text flex="1" fontWeight="medium">
            Position
          </Text>
          <Box
            flex="1"
            borderLeftWidth={ms(1)}
            borderColor="#F0F0F0"
            height="100%"
            justifyContent="center"
          >
            <Text fontWeight="medium" ml={ms(15)}>
              {/*{!isMobileTracking*/}
              {/*  ? `${vesselDetails?.lastGeolocation?.latitude} | ${vesselDetails?.lastGeolocation?.longitude}`*/}
              {/*  : isLoadingMap*/}
              {/*  ? 'Loading...'*/}
              {/*  : `${position?.latitude} | ${position?.longitude}`}*/}
              {`${vesselDetails?.lastGeolocation?.latitude} | ${vesselDetails?.lastGeolocation?.longitude}`}
            </Text>
          </Box>
        </HStack>
        <Button
          my={ms(15)}
          backgroundColor={Colors.azure}
          onPress={() => navigation.goBack()}
          _pressed={{
            bgColor: Colors.primary,
          }}
        >
          Dismiss
        </Button>
      </Box>
    </Box>
  )
}
