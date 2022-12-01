import React, {useEffect, useRef, useState} from 'react'
import {StyleSheet, Dimensions} from 'react-native'
import {Box, Text, Button, HStack, Image, Icon, VStack} from 'native-base'
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Camera,
  Polyline,
} from 'react-native-maps'
import BottomSheet from 'reanimated-bottom-sheet'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {CommonActions, useIsFocused} from '@react-navigation/native'
import {
  PreviousNavLogInfo,
  PlannedNavLogInfo,
  CurrentNavLogInfo,
  LoadingAnimated,
  IconButton,
  FleetHeader,
  MapBottomSheetToggle,
} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {useMap, useEntity} from '@bluecentury/stores'
import {
  ENTITY_TYPE_EXPLOITATION_GROUP,
  formatLocationLabel,
} from '@bluecentury/constants'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const DEFAULT_PADDING = {top: 80, right: 80, bottom: 80, left: 80}

type Props = NativeStackScreenProps<MainStackParamList>
export default function Map({navigation}: Props) {
  const focused = useIsFocused()
  const {vesselId, selectedVessel, entityType, selectFleetVessel, entityUsers} =
    useEntity()
  const {
    isLoadingVesselStatus,
    isLoadingCurrentNavLogs,
    isLoadingPlannedNavLogs,
    isLoadingPreviousNavLogs,
    isLoadingVesselTrack,
    getPreviousNavigationLogs,
    getPlannedNavigationLogs,
    getCurrentNavigationLogs,
    getLastCompleteNavigationLogs,
    getVesselStatus,
    getVesselTrack,
    prevNavLogs,
    plannedNavLogs,
    currentNavLogs,
    lastCompleteNavLogs,
    vesselStatus,
    vesselTracks,
  } = useMap()

  const isLoadingMap =
    isLoadingCurrentNavLogs ||
    isLoadingPlannedNavLogs ||
    isLoadingPreviousNavLogs ||
    isLoadingVesselStatus ||
    isLoadingVesselTrack

  const LATITUDE = 50.503887
  const LONGITUDE = 4.469936
  const sheetRef = useRef<BottomSheet>(null)
  const snapRef = useRef<boolean>(false)
  const mapRef = useRef<MapView>(null)
  const markerRef = useRef<Marker>(null)
  const [snapStatus, setSnapStatus] = useState(0)
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  })
  const [zoomLevel, setZoomLevel] = useState(null)
  const [trackViewMode, setTrackViewMode] = useState(false)
  const [page, setPage] = useState(1)
  const [vesselUpdated, setVesselUpdated] = useState(false)
  const uniqueTracks: any[] = []
  const uniqueVesselTracks: {latitude: any; longitude: any}[] = []

  const uniqueVesselTrack = vesselTracks?.filter(element => {
    const isDuplicate = uniqueTracks.includes(element.latitude)
    if (!isDuplicate) {
      uniqueTracks.push(element.latitude)
      return true
    }
    return false
  })

  uniqueVesselTrack?.forEach(track => {
    uniqueVesselTracks.push({
      latitude: track.latitude,
      longitude: track.longitude,
    })
  })
  let refreshId = useRef<any>()

  useEffect(() => {
    if (vesselId) {
      const init = async () => {
        await getVesselStatus(vesselId)
        await getPreviousNavigationLogs(vesselId)
        await getPlannedNavigationLogs(vesselId)
        await getCurrentNavigationLogs(vesselId)
        await getLastCompleteNavigationLogs(vesselId)
      }

      init()
    }

    if (focused) {
      refreshId.current = setInterval(() => {
        // Run updated vessel status
        setVesselUpdated(true)
        updateMap()
      }, 30000)
    }
    return () => clearInterval(refreshId.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselId, focused])

  useEffect(() => {
    if (currentNavLogs && currentNavLogs.length > 0) {
      setRegion({
        ...region,
        latitude: currentNavLogs[0]?.location?.latitude,
        longitude: currentNavLogs[0]?.location?.longitude,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNavLogs])

  useEffect(() => {
    if (vesselStatus && !vesselUpdated) {
      const {latitude, longitude}: VesselGeolocation = vesselStatus
      let camera = {
        center: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        zoom: 15,
        heading: 0,
        pitch: 0,
        altitude: 5,
      }
      let duration = 1000 * 3
      mapRef.current?.animateCamera(camera, {duration: duration})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselStatus])

  useEffect(() => {
    if (trackViewMode) {
      getVesselTrack(vesselId, page)
    }
    centerMapToCurrentLocation()
  }, [trackViewMode])

  useEffect(() => {
    if (trackViewMode) {
      if (page > 1) fitToAllMarkers()
      else centerMapToBeginningTrackLine()
    }
  }, [vesselTracks])

  const updateMap = async () => {
    if (vesselId) {
      await getPreviousNavigationLogs(vesselId)
      await getPlannedNavigationLogs(vesselId)
      await getCurrentNavigationLogs(vesselId)
      await getVesselStatus(vesselId)
    }
  }

  const handleOnPressBottomSheetArrow = () => {
    snapRef.current = !snapRef.current
    sheetRef.current?.snapTo(snapRef.current ? 0 : 1)
  }

  const renderBottomContent = () => {
    return (
      <Box backgroundColor="#fff" height="full" px={ms(30)} py={ms(20)}>
        <MapBottomSheetToggle
          onPress={handleOnPressBottomSheetArrow}
          snapRef={snapRef}
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
        {snapStatus === 1 && <PreviousNavLogInfo logs={prevNavLogs} />}
        <CurrentNavLogInfo />
        {snapStatus === 1 && <PlannedNavLogInfo logs={plannedNavLogs} />}
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
  }

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
          longitude: previousLocation?.location?.longitude,
        }}
        title={`From: ${previousLocation?.location?.name}`}
        zIndex={1}
        tracksViewChanges={false}
        anchor={{x: 0.5, y: 0.5}}
      >
        <Callout
          onPress={() =>
            navigation.navigate('PlanningDetails', {
              navlog: previousLocation,
              title: formatLocationLabel(previousLocation?.location),
            })
          }
        >
          <HStack borderRadius={ms(5)} alignItems="center" px={ms(5)}>
            <Icon
              as={<FontAwesome5Icon name="check-circle" />}
              color="#6BBF87"
              size={25}
              solid={true}
            />
            <Box mx={ms(5)}>
              <Text fontSize={ms(13)} fontWeight="semibold">
                {formatLocationLabel(previousLocation?.location)}
              </Text>
              <Text fontSize={ms(12)} fontWeight="medium" color="#ADADAD">
                Arrived:{' '}
                {moment(previousLocation?.arrivalDatetime).format(
                  'DD MMM YYYY | hh:mm A'
                )}
              </Text>
            </Box>
            <Icon
              as={<FontAwesome5Icon name="angle-right" />}
              color="#ADADAD"
              size={25}
            />
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
          longitude: nextLocation?.location?.longitude,
        }}
        title={`To: ${nextLocation?.location?.name}`}
        zIndex={1}
        tracksViewChanges={false}
        anchor={{x: 0.5, y: 0.5}}
      >
        <Callout
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate('PlanningDetails', {
                navlog: nextLocation,
                title: formatLocationLabel(nextLocation?.location),
              })
            )
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
                Planned:{' '}
                {moment(nextLocation?.plannedEta).format(
                  'DD MMM YYYY | hh:mm A'
                )}
              </Text>
            </Box>
            <Icon
              as={<FontAwesome5Icon name="angle-right" />}
              color="#ADADAD"
              size={25}
            />
          </HStack>
        </Callout>
      </Marker>
    )
  }

  const renderMarkerVessel = () => {
    const {latitude, longitude, speed}: VesselGeolocation = vesselStatus
    return (
      <Marker
        key={`Vessel-${currentNavLogs[0]?.location?.id}`}
        coordinate={{
          latitude: Number(latitude),
          longitude: Number(longitude),
        }}
        image={Number(speed) > 0 ? Icons.navigating : Icons.anchor}
        zIndex={1}
        anchor={{x: 0.5, y: 0.5}}
      />
    )
  }

  const renderTrackLineBeginningMarker = () => {
    const {latitude, longitude}: VesselGeolocation =
      uniqueVesselTracks[uniqueVesselTracks.length - 1]
    return (
      <Marker
        coordinate={{
          latitude: Number(latitude),
          longitude: Number(longitude),
        }}
        image={Icons.ellipsis_marker}
        anchor={{x: 0.5, y: 0.5}}
        zIndex={1}
      >
        <Callout
          onPress={() => (trackViewMode ? onLoadMoreVesselTrack() : null)}
        >
          <Text>Load more data...</Text>
        </Callout>
      </Marker>
    )
  }

  const renderLastCompleteNavLogs = (log: any, index: number) => {
    if (!log?.plannedEta && !log?.arrivalDatetime) {
      return null
    }
    return (
      <Marker
        key={`CompletedLogs-${index}-${log.location?.id}`}
        pinColor={'#F0f0f0'}
        coordinate={{
          latitude: log.location?.latitude,
          longitude: log.location?.longitude,
        }}
        zIndex={0}
        tracksViewChanges={false}
        anchor={{x: 0.5, y: 0.5}}
      >
        <HStack zIndex={0}>
          <Box
            backgroundColor={log?.arrivalDatetime ? '#44A7B9' : '#F0F0F0'}
            width={ms(20)}
            height={ms(20)}
            borderRadius={ms(20)}
            borderColor={'#fff'}
            borderWidth={ms(2)}
            mr={ms(5)}
            zIndex={0}
          />
          {zoomLevel && zoomLevel >= 12 ? (
            <Box
              backgroundColor="#fff"
              borderRadius={ms(5)}
              padding={ms(2)}
              zIndex={0}
            >
              <Text fontSize="xs" px={2}>
                {moment(
                  log?.arrivalDatetime ? log?.arrivalDatetime : log?.plannedEta
                ).format('MMM DD, y | hh:mm A')}
              </Text>
            </Box>
          ) : null}
        </HStack>
      </Marker>
    )
  }

  const fitToAllMarkers = () => {
    mapRef?.current?.fitToCoordinates(uniqueVesselTracks, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    })
  }

  const centerMapToCurrentLocation = () => {
    if (vesselStatus) {
      const {latitude, longitude}: VesselGeolocation = vesselStatus
      let camera: Camera = {
        center: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        zoom: 15,
        heading: 0,
        pitch: 0,
        altitude: 5,
      }
      let duration = 1000 * 3
      mapRef.current?.animateCamera(camera, {duration: duration})
    }
  }

  const centerMapToBeginningTrackLine = () => {
    if (uniqueVesselTracks) {
      const {latitude, longitude}: VesselGeolocation =
        uniqueVesselTracks[uniqueVesselTracks?.length - 1]
      let camera: Camera = {
        center: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        zoom: 14,
        heading: 0,
        pitch: 0,
        altitude: 5,
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

  const onReloadFleetNavLogs = (index: number, vessel: any) => {
    const selectedEntityVessel = entityUsers.find(
      e => e?.entity?.exploitationVessel?.id === vessel?.id
    )
    setPage(1)
    setTrackViewMode(false)
    if (typeof selectedEntityVessel === 'object' && selectedEntityVessel?.id) {
      selectFleetVessel(index, selectedEntityVessel)
    } else {
      selectFleetVessel(index, vessel)
    }
  }

  const onLoadMoreVesselTrack = () => {
    setPage(page + 1)
    getVesselTrack(vesselId, page + 1)
  }

  return (
    <Box flex="1" bg={Colors.light}>
      {entityType === ENTITY_TYPE_EXPLOITATION_GROUP && (
        <FleetHeader
          onPress={(index: number, vessel: any) =>
            onReloadFleetNavLogs(index, vessel)
          }
        />
      )}
      <Box flex="1">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{...StyleSheet.absoluteFillObject}}
          // customMapStyle={MapTheme}
          initialRegion={region}
          onRegionChange={region => handleRegionChange(region)}
        >
          {prevNavLogs?.length > 0 &&
            prevNavLogs.find((plan: any) => plan.plannedEta !== null) !==
              undefined &&
            renderMarkerFrom()}
          {vesselStatus && renderMarkerVessel()}
          {plannedNavLogs?.length > 0 &&
            plannedNavLogs.find((plan: any) => plan.plannedEta !== null) !==
              undefined &&
            renderMarkerTo()}
          {lastCompleteNavLogs.length > 0 &&
            lastCompleteNavLogs?.map((log: any, index: number) =>
              renderLastCompleteNavLogs(log, index)
            )}
          {trackViewMode && uniqueVesselTracks.length > 0 && (
            <Polyline
              coordinates={uniqueVesselTracks}
              strokeColor={Colors.warning}
              strokeWidth={5}
            />
          )}
          {trackViewMode &&
            uniqueVesselTracks.length > 0 &&
            renderTrackLineBeginningMarker()}
        </MapView>
        <Box position="absolute" right="0">
          <VStack space="5" justifyContent="flex-start" m="4">
            <Box bg={Colors.white} borderRadius="full" p="2" shadow={2}>
              <IconButton
                source={Icons.compass}
                size={ms(30)}
                onPress={centerMapToCurrentLocation}
              />
            </Box>
            <Box bg={Colors.white} borderRadius="full" p="2" shadow={2}>
              <IconButton
                source={Icons.location}
                size={ms(30)}
                onPress={centerMapToCurrentLocation}
              />
            </Box>
            <Box bg={Colors.white} borderRadius="full" p="2" shadow={2}>
              <IconButton
                source={Icons.navigating_route}
                size={ms(30)}
                onPress={() => setTrackViewMode(!trackViewMode)}
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
          snapPoints={['60%', '30%']}
          borderRadius={20}
          renderContent={renderBottomContent}
          onOpenEnd={() => setSnapStatus(1)}
          onCloseEnd={() => setSnapStatus(0)}
          enabledGestureInteraction={false}
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
            <LoadingAnimated />
          </Box>
        )}
      </Box>
    </Box>
  )
}
