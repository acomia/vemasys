import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import {Box, Text, Button, HStack, Image, VStack} from 'native-base'
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Camera
} from 'react-native-maps'
import BottomSheet from 'reanimated-bottom-sheet'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {
  PreviousNavLogInfo,
  PlannedNavLogInfo,
  CurrentNavLogInfo,
  LoadingIndicator,
  IconButton
} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {useMap, useEntity} from '@bluecentury/stores'
import {formatLocationLabel} from '@bluecentury/constants'

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const DEFAULT_PADDING = {top: 45, right: 45, bottom: 45, left: 45}

type Props = NativeStackScreenProps<MainStackParamList>
export default function Map({navigation}: Props) {
  const {vesselId, selectedVessel, vesselDetails} = useEntity()
  const {
    isLoadingCurrentNavLogs,
    isLoadingPlannedNavLogs,
    isLoadingPreviousNavLogs,
    getPreviousNavigationLogs,
    getPlannedNavigationLogs,
    getCurrentNavigationLogs,
    getLastCompleteNavigationLogs,
    prevNavLogs,
    plannedNavLogs,
    currentNavLogs,
    lastCompleteNavLogs
  } = useMap()

  const isLoadingMap =
    isLoadingCurrentNavLogs ||
    isLoadingPlannedNavLogs ||
    isLoadingPreviousNavLogs

  const LATITUDE = 50.503887
  const LONGITUDE = 4.469936
  const sheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapView>(null)
  const markerRef = useRef<Marker>(null)
  const [snapStatus, setSnapStatus] = useState(0)
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  })
  const [zoomLevel, setZoomLevel] = useState(null)
  useLayoutEffect(() => {
    if (vesselId) {
      getPreviousNavigationLogs(vesselId)
      getPlannedNavigationLogs(vesselId)
      getCurrentNavigationLogs(vesselId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselId])

  useEffect(() => {
    if (plannedNavLogs && plannedNavLogs.length > 0) {
      getLastCompleteNavigationLogs(plannedNavLogs[0]?.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plannedNavLogs])

  useEffect(() => {
    if (currentNavLogs && currentNavLogs.length > 0) {
      setRegion({
        ...region,
        latitude: currentNavLogs[0]?.location?.latitude,
        longitude: currentNavLogs[0]?.location?.longitude
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNavLogs])

  useEffect(() => {
    if (vesselDetails) {
      const {latitude, longitude} = vesselDetails.lastGeolocation
      let camera = {
        center: {
          latitude: latitude,
          longitude: longitude
        },
        zoom: 15,
        heading: 0,
        pitch: 0,
        altitude: 5
      }
      let duration = 1000 * 3
      mapRef.current?.animateCamera(camera, {duration: duration})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselDetails])

  const renderBottomContent = () => (
    <Box backgroundColor="#fff" height={ms(440)} px={ms(30)} py={ms(20)}>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          width: 80,
          height: 3,
          backgroundColor: '#23475C',
          borderRadius: 5
        }}
        onPress={() => sheetRef?.current?.snapTo(0)}
      />
      <Text
        fontSize={ms(18)}
        my={ms(10)}
        fontWeight="700"
        textAlign="center"
        color={Colors.azure}
      >
        {selectedVessel?.alias || null}
      </Text>
      {snapStatus === 1 && <PreviousNavLogInfo />}
      {currentNavLogs && currentNavLogs.length > 0 && <CurrentNavLogInfo />}
      {snapStatus === 1 && <PlannedNavLogInfo />}
      {snapStatus === 1 && (
        <Button
          bg={Colors.azure}
          onPress={() => navigation.navigate('Planning')}
        >
          View Navlog
        </Button>
      )}
    </Box>
  )

  const renderMarkerFrom = () => {
    const previousLocation = prevNavLogs?.find(
      (prev: any) => prev.plannedEta !== null
    )
    if (zoomLevel && zoomLevel > 12) {
      markerRef?.current?.showCallout()
    } else {
      markerRef?.current?.hideCallout()
    }
    return (
      <Marker
        ref={markerRef}
        key={`Previous-${previousLocation?.location?.id}`}
        pinColor={'#6BBF87'}
        coordinate={{
          latitude: previousLocation?.location?.latitude,
          longitude: previousLocation?.location?.longitude
        }}
        title={`From: ${previousLocation?.location?.name}`}
        style={{zIndex: 1}}
      >
        <Callout
          onPress={() =>
            navigation.navigate('PlanningDetails', {
              navlog: previousLocation,
              title: formatLocationLabel(previousLocation?.location)
            })
          }
        >
          <HStack borderRadius={ms(5)} alignItems="center" px={ms(5)}>
            <Icon name="check-circle" color="#6BBF87" size={25} solid={true} />
            <Box mx={ms(5)}>
              <Text fontSize={ms(13)} fontWeight="semibold">
                {formatLocationLabel(previousLocation?.location)}
              </Text>
              <Text fontSize={ms(12)} fontWeight="medium" color="#ADADAD">
                Arrived:{' '}
                {moment(previousLocation?.arrivalDatetime).format(
                  'DD MMM YYYY | HH:mm'
                )}
              </Text>
            </Box>
            <Icon name="angle-right" color="#ADADAD" size={25} />
          </HStack>
        </Callout>
      </Marker>
    )
  }

  const renderMarkerTo = () => {
    const nextLocation = plannedNavLogs?.find(
      (plan: any) => plan.plannedEta !== null
    )
    if (zoomLevel && zoomLevel > 12) {
      markerRef?.current?.showCallout()
    } else {
      markerRef?.current?.hideCallout()
    }
    return (
      <Marker
        ref={markerRef}
        key={`Planned-${nextLocation?.location?.id}`}
        pinColor={'#29B7EF'}
        coordinate={{
          latitude: nextLocation?.location?.latitude,
          longitude: nextLocation?.location?.longitude
        }}
        title={`To: ${nextLocation?.location?.name}`}
        style={{zIndex: 1}}
      >
        <Callout
          onPress={() =>
            navigation.navigate('PlanningDetails', {
              navlog: nextLocation,
              title: formatLocationLabel(nextLocation?.location)
            })
          }
        >
          <HStack borderRadius={ms(5)} alignItems="center" px={ms(5)}>
            <Text pb={ms(20)}>
              <Image
                alt="next-navlog-img"
                source={Icons.unloading}
                width={ms(30)}
                height={ms(30)}
                resizeMode="contain"
              />
            </Text>
            <Box mx={ms(5)}>
              <Text fontSize={ms(13)} fontWeight="semibold">
                {formatLocationLabel(nextLocation?.location)}
              </Text>
              <Text fontSize={ms(12)} fontWeight="medium" color="#ADADAD">
                Arrived:{' '}
                {moment(nextLocation?.plannedEta).format('DD MMM YYYY | HH:mm')}
              </Text>
            </Box>
            <Icon name="angle-right" color="#ADADAD" size={25} />
          </HStack>
        </Callout>
      </Marker>
    )
  }

  const renderMarkerVessel = () => {
    const {latitude, longitude, speed}: any = vesselDetails?.lastGeolocation
    return (
      <Marker
        key={`Vessel-${currentNavLogs[0]?.location?.id}`}
        coordinate={{
          latitude: latitude,
          longitude: longitude
        }}
        image={speed > 0 ? Icons.navigating : Icons.anchor}
        style={{zIndex: 1}}
      />
    )
  }

  const renderLastCompleteNavLogs = (log: any) => {
    if (
      !log?.navigationLog?.plannedEta &&
      !log?.navigationLog?.arrivalDatetime
    ) {
      return null
    }
    return (
      <Marker
        key={log.location?.id}
        pinColor={'#F0f0f0'}
        coordinate={{
          latitude: log.location?.latitude,
          longitude: log.location?.longitude
        }}
        style={{zIndex: 0}}
      >
        <HStack style={{zIndex: 0}}>
          <Box
            backgroundColor={
              log?.navigationLog?.arrivalDatetime ? '#44A7B9' : '#F0F0F0'
            }
            width={ms(20)}
            height={ms(20)}
            borderRadius={ms(20)}
            borderColor={'#fff'}
            borderWidth={ms(2)}
            mr={ms(5)}
            style={{zIndex: 0}}
          />
          <Box
            backgroundColor="#fff"
            borderRadius={ms(5)}
            padding={ms(2)}
            style={{zIndex: 0}}
          >
            {zoomLevel >= 12 && (
              <Text fontWeight="medium">
                {moment(
                  log?.navigationLog?.arrivalDatetime
                    ? log?.navigationLog?.arrivalDatetime
                    : log?.navigationLog?.plannedEta
                ).format('DD MMM YYYY | HH:mm')}
              </Text>
            )}
          </Box>
        </HStack>
      </Marker>
    )
  }

  const fitToAllMarkers = () => {
    console.log('fitToAllMarkers')
    const previousLocation: any = prevNavLogs?.filter(
      (e: any) => e && e.plannedEta !== null
    )
    const nextLocation: any = plannedNavLogs?.filter(
      (e: any) => e && e.plannedEta !== null
    )
    let markers: [] | any = []
    if (
      prevNavLogs.length > 0 ||
      plannedNavLogs.length > 0 ||
      currentNavLogs.length > 0
    ) {
      markers = [
        {
          latitude: previousLocation[0]?.location?.latitude,
          longitude: previousLocation[0]?.location?.longitude
        },
        {
          latitude: nextLocation[0]?.location?.latitude,
          longitude: nextLocation[0]?.location?.longitude
        },
        {
          latitude: currentNavLogs[0]?.location?.latitude,
          longitude: currentNavLogs[0]?.location?.longitude
        }
      ]
    } else {
      markers = [
        {
          latitude: LATITUDE,
          longitude: LONGITUDE
        }
      ]
    }

    mapRef?.current?.fitToCoordinates(markers, {
      edgePadding: DEFAULT_PADDING,
      animated: true
    })
  }

  const centerMapToCurrentLocation = () => {
    if (vesselDetails && vesselDetails.lastGeolocation) {
      const {latitude, longitude} = vesselDetails?.lastGeolocation
      let camera: Camera = {
        center: {
          latitude: latitude,
          longitude: longitude
        },
        zoom: 15,
        heading: 0,
        pitch: 0,
        altitude: 5
      }
      let duration = 1000 * 3
      mapRef.current?.animateCamera(camera, {duration: duration})
    }
  }

  const handleRegionChange = (reg: {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  }) => {
    let zoom = Math.round(Math.log(360 / reg.longitudeDelta) / Math.LN2)
    setZoomLevel(zoom)
  }

  return (
    <Box flex={1} bg={Colors.light}>
      <Box flex={1}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{
            ...StyleSheet.absoluteFillObject
          }}
          initialRegion={region}
          onRegionChange={region => handleRegionChange(region)}
        >
          {prevNavLogs?.length > 0 &&
            prevNavLogs.find((plan: any) => plan.plannedEta !== null) !==
              undefined &&
            renderMarkerFrom()}
          {vesselDetails && renderMarkerVessel()}
          {plannedNavLogs?.length > 0 &&
            plannedNavLogs.find((plan: any) => plan.plannedEta !== null) !==
              undefined &&
            renderMarkerTo()}
          {lastCompleteNavLogs &&
            lastCompleteNavLogs.length > 0 &&
            lastCompleteNavLogs[0]?.waypoints?.map((log: any) =>
              renderLastCompleteNavLogs(log)
            )}
        </MapView>
        <Box position="absolute" right="0">
          <VStack space="5" justifyContent="flex-start" m="4">
            <Box bg={Colors.white} borderRadius="full" p="2">
              <IconButton
                source={Icons.compass}
                size={ms(30)}
                onPress={centerMapToCurrentLocation}
              />
            </Box>
            <Box bg={Colors.white} borderRadius="full" p="2">
              <IconButton
                source={Icons.location}
                size={ms(30)}
                onPress={centerMapToCurrentLocation}
              />
            </Box>
          </VStack>
        </Box>
        <Box
          position="absolute"
          shadow={2}
          top={0}
          left={0}
          right={0}
          h={ms(1)}
          bgColor={Colors.light}
        />
        <BottomSheet
          ref={sheetRef}
          initialSnap={1}
          snapPoints={[ms(410), ms(150)]}
          borderRadius={20}
          renderContent={renderBottomContent}
          onOpenEnd={() => setSnapStatus(1)}
          onCloseEnd={() => setSnapStatus(0)}
        />

        {isLoadingMap && (
          <Box
            position="absolute"
            top="0"
            bottom="0"
            left="0"
            right="0"
            justifyContent="center"
            backgroundColor="rgba(0,0,0,0.5)"
            zIndex={999}
          >
            <LoadingIndicator width={200} height={200} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
