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
  LoadingSlide,
} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {useMap, useEntity} from '@bluecentury/stores'
import {
  ENTITY_TYPE_EXPLOITATION_GROUP,
  formatLocationLabel,
} from '@bluecentury/constants'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import {useTranslation} from 'react-i18next'

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const DEFAULT_PADDING = {top: 80, right: 80, bottom: 80, left: 80}

type Props = NativeStackScreenProps<MainStackParamList>
export default function Map({navigation}: Props) {
  const {t} = useTranslation()
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
  const [zoomLevel, setZoomLevel] = useState<number | null>(null)
  const [trackViewMode, setTrackViewMode] = useState(false)
  const [page, setPage] = useState(1)
  const [vesselUpdated, setVesselUpdated] = useState(false)
  const uniqueTracks: any[] = []
  const uniqueVesselTracks: {latitude: any; longitude: any}[] = []
  const [isLoadingMap, setLoadingMap] = useState(false)

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
  const refreshId = useRef<any>()

  useEffect(() => {
    if (vesselId) {
      const init = async () => {
        setLoadingMap(true)
        await getVesselStatus(vesselId)
        await getPreviousNavigationLogs(vesselId)
        await getPlannedNavigationLogs(vesselId)
        await getCurrentNavigationLogs(vesselId)
        await getLastCompleteNavigationLogs(vesselId)
        setLoadingMap(false)
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
      const camera = {
        center: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        zoom: 15,
        heading: 0,
        pitch: 0,
        altitude: 5,
      }
      const duration = 1000 * 3
      mapRef.current?.animateCamera(camera, {duration: duration})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vesselStatus])

  useEffect(() => {
    if (trackViewMode && vesselId) {
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
      setLoadingMap(true)
      await getPreviousNavigationLogs(vesselId)
      await getPlannedNavigationLogs(vesselId)
      await getCurrentNavigationLogs(vesselId)
      await getVesselStatus(vesselId)
      setLoadingMap(false)
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
          snapRef={snapRef}
          onPress={handleOnPressBottomSheetArrow}
        />
        <Text
          color={Colors.azure}
          fontSize={ms(18)}
          fontWeight="700"
          my={ms(10)}
          textAlign="center"
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
            {t('viewNavlog')}
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
        key={`Previous-${previousLocation?.location?.id}`}
        ref={markerRef}
        coordinate={{
          latitude: previousLocation?.location?.latitude,
          longitude: previousLocation?.location?.longitude,
        }}
        anchor={{x: 0, y: 0.5}}
        pinColor={'#6BBF87'}
        title={`${t('from')} ${previousLocation?.location?.name}`}
        tracksViewChanges={false}
        zIndex={1}
      >
        <Callout
          onPress={() =>
            navigation.navigate('PlanningDetails', {
              navlog: previousLocation,
              title: formatLocationLabel(previousLocation?.location),
            })
          }
        >
          <HStack alignItems="center" borderRadius={ms(5)} px={ms(5)}>
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
              <Text color="#ADADAD" fontSize={ms(12)} fontWeight="medium">
                {t('arrived')}
                {moment(previousLocation?.arrivalDatetime).format(
                  'DD MMM YYYY | HH:mm'
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
        key={`${t('planned-')}${nextLocation?.location?.id}`}
        ref={markerRef}
        coordinate={{
          latitude: nextLocation?.location?.latitude,
          longitude: nextLocation?.location?.longitude,
        }}
        anchor={{x: 0, y: 0.5}}
        pinColor={'#29B7EF'}
        title={`${t('to')} ${nextLocation?.location?.name}`}
        tracksViewChanges={false}
        zIndex={1}
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
          <HStack alignItems="center" borderRadius={ms(5)} px={ms(5)}>
            <Text pb={ms(20)}>
              <Image
                alt="next-navlog-img"
                height={ms(30)}
                resizeMode="contain"
                source={Icons.unloading}
                width={ms(30)}
              />
            </Text>
            <Box mx={ms(5)}>
              <Text fontSize={ms(13)} fontWeight="semibold">
                {formatLocationLabel(nextLocation?.location)}
              </Text>
              <Text color="#ADADAD" fontSize={ms(12)} fontWeight="medium">
                {t('planned')}
                {moment(nextLocation?.plannedEta).format('DD MMM YYYY | HH:mm')}
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
        anchor={{x: 0, y: 0.5}}
        image={Number(speed) > 0 ? Icons.navigating : Icons.anchor}
        zIndex={1}
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
        anchor={{x: 0, y: 0.5}}
        image={Icons.ellipsis_marker}
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
        coordinate={{
          latitude: log.location?.latitude,
          longitude: log.location?.longitude,
        }}
        anchor={{x: 0, y: 0.5}}
        pinColor={'#F0f0f0'}
        tracksViewChanges={false}
        zIndex={0}
      >
        <HStack zIndex={0}>
          <Box
            backgroundColor={log?.arrivalDatetime ? '#44A7B9' : '#F0F0F0'}
            borderColor={'#fff'}
            borderRadius={ms(20)}
            borderWidth={ms(2)}
            height={ms(20)}
            mr={ms(5)}
            width={ms(20)}
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
                ).format('MMM DD, y | HH:mm')}
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
      const camera: Camera = {
        center: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        zoom: 15,
        heading: 0,
        pitch: 0,
        altitude: 5,
      }
      const duration = 1000 * 3
      mapRef.current?.animateCamera(camera, {duration: duration})
    }
  }

  const centerMapToBeginningTrackLine = () => {
    if (uniqueVesselTracks) {
      const {latitude, longitude}: VesselGeolocation =
        uniqueVesselTracks[uniqueVesselTracks?.length - 1]
      const camera: Camera = {
        center: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        zoom: 14,
        heading: 0,
        pitch: 0,
        altitude: 5,
      }
      const duration = 1000 * 3
      mapRef.current?.animateCamera(camera, {duration: duration})
    }
  }

  const handleRegionChange = (reg: {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  }) => {
    const zoom = Math.round(Math.log(360 / reg.longitudeDelta) / Math.LN2)
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
    <Box bg={Colors.light} flex="1">
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
          initialRegion={region} // remove if not using Google Maps
          provider={PROVIDER_GOOGLE}
          // customMapStyle={MapTheme}
          style={{...StyleSheet.absoluteFillObject}}
          onRegionChange={regionItem => handleRegionChange(regionItem)}
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
        {isLoadingMap && (
          <LoadingSlide
            color={Colors.primary}
            label={`${t('refreshing')}...`}
            loading={true}
          />
        )}
        <Box position="absolute" right="0">
          <VStack justifyContent="flex-start" m="4" space="5">
            {/*<Box bg={Colors.white} borderRadius="full" p="2" shadow={2}>*/}
            {/*  <IconButton*/}
            {/*    source={Icons.compass}*/}
            {/*    size={ms(30)}*/}
            {/*    onPress={centerMapToCurrentLocation}*/}
            {/*  />*/}
            {/*</Box>*/}
            <Box bg={Colors.white} borderRadius="full" p="2" shadow={2}>
              <IconButton
                size={ms(30)}
                source={Icons.location}
                onPress={centerMapToCurrentLocation}
              />
            </Box>
            <Box bg={Colors.white} borderRadius="full" p="2" shadow={2}>
              <IconButton
                size={ms(30)}
                source={Icons.navigating_route}
                onPress={() => setTrackViewMode(!trackViewMode)}
              />
            </Box>
          </VStack>
        </Box>
        <Box
          bgColor={Colors.light}
          h={ms(1)}
          left={0}
          position="absolute"
          right={0}
          shadow={2}
          top={0}
        />
        <BottomSheet
          ref={sheetRef}
          borderRadius={20}
          enabledGestureInteraction={false}
          initialSnap={1}
          renderContent={renderBottomContent}
          snapPoints={['60%', '30%']}
          onCloseEnd={() => setSnapStatus(0)}
          onOpenEnd={() => setSnapStatus(1)}
        />
      </Box>
    </Box>
  )
}
