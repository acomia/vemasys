import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {StyleSheet, TouchableOpacity, Dimensions, Alert} from 'react-native'
import {Box, Flex, Text, Button, HStack, Image} from 'native-base'
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps'
import BottomSheet from 'reanimated-bottom-sheet'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'

import {
  PreviousNavLogInfo,
  PlannedNavLogInfo,
  CurrentNavLogInfo,
  LoadingIndicator,
  IconButton
} from '@bluecentury/components'
import {icons, Images} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {useMap, useAuth, useEntity} from '@bluecentury/stores'
import {formatLocationLabel} from '@bluecentury/constants'

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const DEFAULT_PADDING = {top: 45, right: 45, bottom: 45, left: 45}

export default function Map() {
  const {
    isLoadingMap,
    getPreviousNavigationLogs,
    getPlannedNavigationLogs,
    getCurrentNavigationLogs,
    getLastCompleteNavigationLogs,
    prevNavLogs,
    plannedNavLogs,
    currentNavLogs,
    lastCompleteNavLogs
  }: any = useMap()
  const {logout} = useAuth()
  const {vesselId, selectedVessel, vesselDetails} = useEntity()

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
    // logout()
    getPreviousNavigationLogs(vesselId)
    getPlannedNavigationLogs(vesselId)
    getCurrentNavigationLogs(vesselId)
  }, [])

  useEffect(() => {
    setRegion({
      ...region,
      latitude: currentNavLogs[0]?.location?.latitude,
      longitude: currentNavLogs[0]?.location?.longitude
    })
    getLastCompleteNavigationLogs(plannedNavLogs[0]?.id)

    fitToAllMarkers()
  }, [currentNavLogs])

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
        {selectedVessel?.alias}
      </Text>
      {snapStatus === 1 && <PreviousNavLogInfo />}
      <CurrentNavLogInfo />
      {snapStatus === 1 && <PlannedNavLogInfo />}
      {snapStatus === 1 && (
        <Button backgroundColor={Colors.azure}>View Navlog</Button>
      )}
    </Box>
  )

  function renderMarkerFrom() {
    const previousLocation = prevNavLogs?.find(
      (prev: any) => prev.plannedETA !== null
    )
    if (zoomLevel > 12) {
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
        <Callout onPress={() => Alert.alert('navigate to navlog details')}>
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

  function renderMarkerTo() {
    const nextLocation = plannedNavLogs?.find(
      (plan: any) => plan.plannedETA !== null
    )
    if (zoomLevel > 12) {
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
        <Callout onPress={() => Alert.alert('navigate to navlog details')}>
          <HStack borderRadius={ms(5)} alignItems="center" px={ms(5)}>
            <Text pb={ms(20)}>
              <Image
                alt="next-navlog-img"
                source={icons.unloading}
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
                {moment(nextLocation?.plannedETA).format('DD MMM YYYY | HH:mm')}
              </Text>
            </Box>
            <Icon name="angle-right" color="#ADADAD" size={25} />
          </HStack>
        </Callout>
      </Marker>
    )
  }

  function renderMarkerVesel() {
    return (
      <Marker
        key={`Vessel-${currentNavLogs[0]?.location?.id}`}
        coordinate={{
          latitude: currentNavLogs[0]?.location?.latitude,
          longitude: currentNavLogs[0]?.location?.longitude
        }}
        image={
          vesselDetails?.lastGeolocation?.speed > 0
            ? Images.vessel_navigating
            : Images.anchor
        }
        style={{zIndex: 1}}
      />
    )
  }

  function renderLastCompleteNavLogs(log: any) {
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
                    : log?.navigationLog?.plannedETA
                ).format('DD MMM YYYY | HH:mm')}
              </Text>
            )}
          </Box>
        </HStack>
      </Marker>
    )
  }

  function fitToAllMarkers() {
    const previousLocation: any = prevNavLogs?.filter(
      (e: any) => e && e.plannedETA !== null
    )
    const nextLocation: any = plannedNavLogs?.filter(
      (e: any) => e && e.plannedETA !== null
    )
    let markers: [] | any = []
    if (
      prevNavLogs.length > 0 &&
      plannedNavLogs.length > 0 &&
      currentNavLogs.length > 0
    ) {
      markers = [
        {
          latitude: previousLocation[0]?.location?.latitude,
          longitude: previousLocation[0]?.location?.longitude
        },
        {
          latitude: currentNavLogs[0]?.location?.latitude,
          longitude: currentNavLogs[0]?.location?.longitude
        },
        {
          latitude: nextLocation[0]?.location?.latitude,
          longitude: nextLocation[0]?.location?.longitude
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

  function centerMapToCurrentLocation() {
    mapRef.current?.animateCamera({
      center: {
        latitude: currentNavLogs[0]?.location?.latitude,
        longitude: currentNavLogs[0]?.location?.longitude
      },
      zoom: 15,
      heading: 0,
      pitch: 0,
      altitude: 5
    })
  }

  function handleRegionChange(reg: {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  }) {
    let zoom = Math.round(Math.log(360 / reg.longitudeDelta) / Math.LN2)
    setZoomLevel(zoom)
  }

  return (
    <Box flex={1} bg={Colors.light} safeArea>
      <Box flex={1} bg={Colors.white} borderRadius="3xl" overflow="hidden">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          initialRegion={region}
          onRegionChange={region => handleRegionChange(region)}
        >
          {prevNavLogs?.length > 0 ? renderMarkerFrom() : null}
          {currentNavLogs?.length > 0 ? renderMarkerVesel() : null}
          {plannedNavLogs?.length > 0 ? renderMarkerTo() : null}
          {lastCompleteNavLogs && lastCompleteNavLogs.length > 0
            ? lastCompleteNavLogs[0]?.waypoints?.map((log: any) =>
                renderLastCompleteNavLogs(log)
              )
            : null}
        </MapView>
        <IconButton
          source={Images.current_location}
          btnStyle={{alignSelf: 'flex-end'}}
          iconStyle={{width: 80, height: 80}}
          onPress={centerMapToCurrentLocation}
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
        {isLoadingMap ? (
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
        ) : null}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
})
