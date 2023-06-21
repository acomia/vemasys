/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react'
import {
  AppState,
  StyleSheet,
  Dimensions,
  Keyboard,
  ActivityIndicator,
} from 'react-native'
import {} from 'react-native'
import {
  Box,
  Text,
  HStack,
  Image,
  Icon,
  VStack,
  ChevronRightIcon,
  IconButton as NativeBaseIconButton,
  AlertDialog,
  Button,
} from 'native-base'
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Camera,
  Polyline,
} from 'react-native-maps'
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {
  CommonActions,
  CompositeScreenProps,
  useIsFocused,
} from '@react-navigation/native'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import {useTranslation} from 'react-i18next'

import {
  PreviousNavLogInfo,
  PlannedNavLogInfo,
  CurrentNavLogInfo,
  IconButton,
  FleetHeader,
  MapBottomSheetToggle,
  NoInternetConnectionMessage,
  LoadingSlide,
  NavigationLogType,
} from '@bluecentury/components'
import {Icons, Animated} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {useMap, useEntity, useNotif, usePlanning} from '@bluecentury/stores'
import {
  ENTITY_TYPE_EXPLOITATION_GROUP,
  formatLocationLabel,
} from '@bluecentury/constants'
import {
  MainStackParamList,
  RootStackParamList,
} from '@bluecentury/types/nav.types'
import {ExploitationVessel, NavigationLog} from '@bluecentury/models'
import {Search, MapNavLog} from './components'
import {useWindowDimensions} from 'react-native'

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

type Props = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList>,
  NativeStackScreenProps<RootStackParamList>
>
export default function Map({navigation}: Props) {
  const {t} = useTranslation()
  const focused = useIsFocused()
  const screenWidth = useWindowDimensions().width
  const {vesselId, selectedVessel, entityType, selectFleetVessel, entityUsers} =
    useEntity()
  const {
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
    trackViewMode,
    setTrackViewMode,
    unmountLocations,
    geographicLocation,
    geoGraphicRoutes,
    getDirections,
    isGeographicRoutesLoading,
    getGeographicPoints,
  } = useMap()
  const {notifications, getAllNotifications, calculateBadge} = useNotif()
  const {
    getNavigationLogDetails,
    updateNavlogDatesError,
    updateNavlogDatesFailed,
    reset,
  } = usePlanning()

  const LATITUDE = 50.503887
  const LONGITUDE = 4.469936
  const sheetRef = useRef<BottomSheet>(null)
  const snapRef = useRef<boolean>(false)
  const mapRef = useRef<MapView>(null)
  const markerRef = useRef<Marker>(null)
  const searchMarkerRef = useRef<Marker>(null)
  const appState = useRef(AppState.currentState)
  const currentPositionRef = useRef<Marker>(null)
  const alertRef = useRef<any>(null)
  const [snapStatus, setSnapStatus] = useState(0)
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  })
  const [zoomLevel, setZoomLevel] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [vesselUpdated, setVesselUpdated] = useState(false)
  const uniqueTracks: Array<VesselGeolocation> = []
  const uniqueVesselTracks: {latitude: number; longitude: number}[] = []
  const [isLoadingMap, setLoadingMap] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [isSearchPin, setIsSearchPin] = useState(false)
  const [isFitToMarkers, setFitToMarkers] = useState(false)
  const [plannedNavLog, setPlannedNavLog] = useState(null)
  const [currentNavLog, setCurrentNavLog] = useState(null)
  const [prevNavLog, setPrevNavLog] = useState(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  // useEffect(() => {
  //   // currentPositionRef?.current?.showCallout()
  // })

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
    Keyboard.addListener('keyboardDidShow', handleKeyboardShow)
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide)

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        updateMap()
      }
      appState.current = nextAppState
    })
    unmountLocations()

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow')
      Keyboard.removeAllListeners('keyboardDidHide')
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    if (vesselId) {
      const init = async () => {
        setLoadingMap(true)
        getAllNotifications()
        await getVesselStatus(vesselId)
        await getPreviousNavigationLogs(vesselId)
        await getPlannedNavigationLogs(vesselId)
        await getCurrentNavigationLogs(vesselId)
        await getLastCompleteNavigationLogs(vesselId)

        getVesselTrack(vesselId, page)
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

    unmountLocations()

    return () => {
      clearInterval(refreshId.current)
      unmountLocations()
    }
  }, [vesselId, focused])

  useEffect(() => {
    if (currentNavLogs && currentNavLogs.length > 0) {
      setRegion({
        ...region,
        latitude: currentNavLogs[0]?.location?.latitude,
        longitude: currentNavLogs[0]?.location?.longitude,
      })
      if (focused) {
        const activeNavLog = plannedNavLogs.find(item => item.isActive)
        const currentNavigationLog = currentNavLogs[currentNavLogs?.length - 1]
        if (currentNavigationLog) {
          getNavigationLogDetails(currentNavigationLog?.id).then(response => {
            console.log('currentNavLog', response)
            if (response) setCurrentNavLog(response)
          })
        } else {
          setCurrentNavLog(activeNavLog)
        }
      }
    }
  }, [currentNavLogs, focused])

  useEffect(() => {
    if (prevNavLogs && prevNavLogs.length > 0 && focused) {
      if (prevNavLogs[0]) {
        getNavigationLogDetails(prevNavLogs[0].id).then(response => {
          if (response) setPrevNavLog(response)
        })
      }
    }
  }, [prevNavLogs, focused])

  useEffect(() => {
    if (plannedNavLogs && plannedNavLogs.length > 0 && focused) {
      const plannedNavLogIndex = plannedNavLogs.findIndex(
        planned => planned.isActive
      )
      const navLog = plannedNavLogIndex
        ? plannedNavLogs[plannedNavLogIndex - 1]
        : null
      if (navLog) {
        // getNavigationLogDetails(navLog?.id).then(response => {
        // if (response) setPlannedNavLog(response)
        // })
        setPlannedNavLog(navLog)
      }
    }
  }, [plannedNavLogs, focused])

  useEffect(() => {
    if (vesselStatus && !vesselUpdated) {
      centerMapToCurrentLocation()
    }
  }, [vesselStatus])

  useEffect(() => {
    if (notifications) {
      calculateBadge()
    }
  }, [notifications])

  useEffect(() => {
    if (vesselTracks.length > 0 && isFitToMarkers) {
      fitToAllMarkers(uniqueVesselTracks)
      setFitToMarkers(false)
    }
  }, [vesselTracks, isFitToMarkers])

  useEffect(() => {
    if (geoGraphicRoutes?.length > 0) {
      fitToAllMarkers(geoGraphicRoutes)
    }
  }, [geoGraphicRoutes])

  useEffect(() => {
    if (updateNavlogDatesFailed === 'FAILED') {
      reset()
      setIsAlertOpen(true)
    }
  }, [updateNavlogDatesFailed])

  const handleKeyboardShow = () => {
    setKeyboardVisible(true)
  }

  const handleKeyboardHide = () => {
    setKeyboardVisible(false)
  }

  const updateMap = async () => {
    if (vesselId) {
      setLoadingMap(true)
      getAllNotifications()
      await getPreviousNavigationLogs(vesselId)
      await getPlannedNavigationLogs(vesselId)
      await getCurrentNavigationLogs(vesselId)
      await getVesselStatus(vesselId)
      getVesselTrack(vesselId, page)
      setLoadingMap(false)
    }
  }

  const handleOnPressBottomSheetArrow = () => {
    snapRef.current = !snapRef.current
    sheetRef.current?.snapTo(snapRef.current ? 0 : 1)
  }

  const renderBottomContent = () => {
    if (plannedNavLog?.id === currentNavLog?.id && snapStatus === 1) {
      // sheetRef?.current?.snapToPosition('60%')
    }

    return (
      <Box backgroundColor={Colors.white} height="full">
        <Text
          color={Colors.azure}
          fontSize={ms(18)}
          fontWeight="700"
          my={ms(5)}
          textAlign="center"
        >
          {selectedVessel?.alias || null}
        </Text>

        {snapStatus === 1 ? (
          <BottomSheetScrollView>
            {plannedNavLog && (
              <MapNavLog
                key={2}
                itemColor={Colors.navLogItemBlue}
                label={t('next').toString()}
                navigationLog={plannedNavLog}
              />
            )}
            {currentNavLog && (
              <MapNavLog
                key={1}
                itemColor={Colors.navLogItemGreen}
                label={t('current').toString()}
                navigationLog={currentNavLog}
              />
            )}
            {prevNavLog && (
              <MapNavLog
                key={3}
                isFinished={true}
                itemColor={Colors.navLogItemPink}
                label={t('previous').toString()}
                navigationLog={prevNavLog}
              />
            )}
          </BottomSheetScrollView>
        ) : (
          <MapNavLog
            key={1}
            itemColor={Colors.navLogItemGreen}
            label={t('current').toString()}
            navigationLog={currentNavLog ? currentNavLog : plannedNavLog}
          />
        )}
      </Box>
    )
  }

  const handleSheetChanges = (index: number) => {
    console.log(index)
    setSnapStatus(index)
  }

  const renderMarkerFrom = () => {
    const previousLocation = prevNavLogs?.find(
      (prev: NavigationLog) => prev.plannedEta !== null
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
        pinColor={Colors.secondary}
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
              color={Colors.secondary}
              size={25}
            />
            <Box mx={ms(5)}>
              <Text fontSize={ms(13)} fontWeight="semibold">
                {formatLocationLabel(previousLocation?.location)}
              </Text>
              <Text
                color={Colors.disabled}
                fontSize={ms(12)}
                fontWeight="medium"
              >
                {t('arrived')}
                {moment(previousLocation?.arrivalDatetime).format(
                  'DD MMM YYYY | HH:mm'
                )}
              </Text>
            </Box>
            <Icon
              as={<FontAwesome5Icon name="angle-right" />}
              color={Colors.disabled}
              size={25}
            />
          </HStack>
        </Callout>
      </Marker>
    )
  }

  const renderMarkerTo = () => {
    const nextLocation = plannedNavLogs?.find(
      (plan: NavigationLog) => plan.plannedEta !== null
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
        pinColor={Colors.highlighted_text}
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
              <Text
                color={Colors.disabled}
                fontSize={ms(12)}
                fontWeight="medium"
              >
                {t('planned')}
                {moment(nextLocation?.plannedEta).format('DD MMM YYYY | HH:mm')}
              </Text>
            </Box>
            <Icon
              as={<FontAwesome5Icon name="angle-right" />}
              color={Colors.disabled}
              size={25}
            />
          </HStack>
        </Callout>
      </Marker>
    )
  }

  const processLocations = (location: string): boolean => {
    switch (location) {
      case 'Bridge':
        // Process bridge location
        return true
      case 'Waypoint':
        // Process waypoint location
        return true
      case 'Junction':
        // Process junction location
        return true
      default:
        // Handle other/custom location
        return false
    }
  }

  const renderMarkerVessel2 = useMemo(() => {
    if (!vesselStatus) return null
    const {latitude, longitude, speed, heading}: VesselGeolocation =
      vesselStatus
    const rotate = heading >= 0 && Number(speed) > 3 ? `${heading}deg` : null
    const navigationLog = plannedNavLogs.find(item => item.isActive)
    const isFilterLocations = processLocations(navigationLog?.location?.title)

    return (
      <Marker
        key={`Vessel-${vesselStatus?.vessel?.id}`}
        ref={currentPositionRef}
        coordinate={{
          latitude: Number(latitude),
          longitude: Number(longitude),
        }}
        onPress={() =>
          navigation.navigate('PlanningDetails', {
            navlog: navigationLog,
            title: formatLocationLabel(navigationLog?.location) as string,
          })
        }
      >
        <Box alignItems={'center'}>
          {navigationLog ? (
            <HStack alignItems="center" backgroundColor={Colors.white} w="80">
              <Box h={ms(48)} w={ms(48)}>
                <NavigationLogType isLotty navigationLog={navigationLog} />
              </Box>
              <Box flex={1} marginLeft={ms(8)}>
                <Text bold color={Colors.text} fontSize={ms(15)} noOfLines={1}>
                  {formatLocationLabel(navigationLog?.location)}
                </Text>
                <Text color={Colors.azure} fontWeight="medium">
                  {t('planned')}
                  {moment(navigationLog?.plannedEta).format(
                    'DD MMM YYYY | HH:mm'
                  )}
                </Text>
              </Box>
              <Box alignSelf="center">
                <NativeBaseIconButton
                  icon={
                    <ChevronRightIcon bold color={Colors.disabled} size="4" />
                  }
                  onPress={() => {
                    console.log(11)
                  }}
                />
              </Box>
            </HStack>
          ) : null}
          <Box width={ms(30)}>
            {(rotate && !navigationLog) || isFilterLocations ? (
              <Box style={{transform: [{rotate}]}}>
                <Image
                  alt="map-navigating-arrow-img"
                  resizeMode="contain"
                  source={Icons.navigating}
                />
              </Box>
            ) : (
              <Box bgColor={Colors.white} borderRadius={50}>
                <FontAwesome5Icon
                  style={{
                    padding: 7,
                  }}
                  color={Colors.azure}
                  name="anchor"
                  size={ms(15)}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Marker>
    )
  }, [vesselStatus, plannedNavLogs])

  const renderMarkerVessel = () => {
    const {latitude, longitude, speed, heading}: VesselGeolocation =
      vesselStatus
    const rotate = heading >= 0 && Number(speed) > 1 ? `${heading}deg` : null
    const navigationLog = plannedNavLogs.find(item => item.isActive)

    return (
      <Marker
        key={`Vessel-${currentNavLogs[0]?.location?.id}`}
        ref={currentPositionRef}
        coordinate={{
          latitude: Number(latitude),
          longitude: Number(longitude),
        }}
        anchor={{x: 0, y: 0.2}}
        tracksInfoWindowChanges={true}
        tracksViewChanges={true}
        zIndex={1}
      >
        {rotate ? (
          <Box style={{transform: [{rotate}]}}>
            <Image
              alt="map-navigating-arrow-img"
              resizeMode="contain"
              source={Icons.navigating}
            />
          </Box>
        ) : (
          <Box bgColor={Colors.white} borderRadius={50}>
            <FontAwesome5Icon
              style={{
                padding: 7,
              }}
              color={Colors.azure}
              name="anchor"
              size={ms(15)}
            />
          </Box>
        )}
        {navigationLog ? (
          <Callout
            // tooltip={true}
            onPress={() =>
              navigation.navigate('PlanningDetails', {
                navlog: navigationLog,
                title: formatLocationLabel(navigationLog?.location) as string,
              })
            }
          >
            <HStack alignItems="center" backgroundColor={Colors.white} w="80">
              <Box h={ms(48)} w={ms(48)}>
                <NavigationLogType isLotty navigationLog={navigationLog} />
              </Box>
              <Box flex={1} marginLeft={ms(8)}>
                <Text bold color={Colors.text} fontSize={ms(15)} noOfLines={1}>
                  {formatLocationLabel(navigationLog?.location)}
                </Text>
                <Text color={Colors.azure} fontWeight="medium">
                  {t('planned')}
                  {moment(navigationLog?.plannedEta).format(
                    'DD MMM YYYY | HH:mm'
                  )}
                </Text>
              </Box>
              <Box alignSelf="center">
                <NativeBaseIconButton
                  icon={
                    <ChevronRightIcon bold color={Colors.disabled} size="4" />
                  }
                  onPress={() => {
                    console.log(11)
                  }}
                />
              </Box>
            </HStack>
          </Callout>
        ) : null}
      </Marker>
    )
  }

  const renderTrackLineBeginningMarker = () => {
    const {latitude, longitude} =
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

  const renderLastCompleteNavLogs = (log: NavigationLog, index: number) => {
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
        pinColor={Colors.light}
        tracksViewChanges={false}
        zIndex={0}
      >
        <HStack zIndex={0}>
          <Box
            backgroundColor={
              log?.arrivalDatetime ? Colors.primary : Colors.light
            }
            borderColor={Colors.white}
            borderRadius={ms(20)}
            borderWidth={ms(2)}
            height={ms(20)}
            mr={ms(5)}
            width={ms(20)}
            zIndex={0}
          />
          {zoomLevel && zoomLevel >= 12 ? (
            <Box
              backgroundColor={Colors.white}
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

  const fitToAllMarkers = (tracks: any) => {
    mapRef?.current?.fitToCoordinates(tracks, {
      animated: true,
      edgePadding: {bottom: height * 0.3, top: 130, left: 50, right: 80},
    })
  }

  const centerMapToCurrentLocation = () => {
    if (vesselStatus) {
      const {latitude, longitude}: VesselGeolocation = vesselStatus
      centerMapToLocation(latitude, longitude)
    }
  }

  const centerMapToLocation = (lat: any, lng: any) => {
    if (lat && lng) {
      const camera: Camera = {
        center: {
          latitude: Number(lat),
          longitude: Number(lng),
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

  const handleRegionChange = (reg: {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  }) => {
    const zoom = Math.round(Math.log(360 / reg.longitudeDelta) / Math.LN2)
    setZoomLevel(zoom)
  }

  const onReloadFleetNavLogs = (index: number, vessel: ExploitationVessel) => {
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
  const renderSearchLocationMarker = useMemo(() => {
    if (isSearchPin && geographicLocation) {
      if (zoomLevel && zoomLevel > 12) {
        searchMarkerRef?.current?.showCallout()
      } else {
        searchMarkerRef?.current?.hideCallout()
      }
      return (
        <Marker
          key={`search-${geographicLocation?.id}`}
          ref={searchMarkerRef}
          coordinate={{
            latitude: Number(geographicLocation?.latitude),
            longitude: Number(geographicLocation?.longitude),
          }}
          zIndex={1}
          onPress={() => handleGetDirection()}
        >
          <Box alignItems={'center'}>
            <Box
              alignItems={'center'}
              backgroundColor={Colors.offlineWarning}
              borderRadius={ms(5)}
              justifyContent={'center'}
              px={ms(5)}
              width={ms(100)}
            >
              {isGeographicRoutesLoading ? (
                <ActivityIndicator size={ms(20)} />
              ) : (
                <Text color={Colors.white}>{t('getDirections')}</Text>
              )}
            </Box>

            <Box>
              <Image
                alt="searched-pin"
                height={ms(40)}
                source={Animated.searchedPin}
                width={ms(30)}
              />
            </Box>
          </Box>
        </Marker>
      )
    }
  }, [geographicLocation, isSearchPin, isGeographicRoutesLoading])

  const handleItemAction = async (item: any) => {
    const response = await getGeographicPoints(item?.id)
    if (response !== null) {
      Keyboard.dismiss()
      unmountLocations()
      setIsSearchPin(true)
      if (response?.latitude && response?.longitude) {
        centerMapToLocation(response?.latitude, response?.longitude)
      }
    }
  }

  const handleGetDirection = () => {
    getDirections(geographicLocation?.id?.toString())
  }

  const snapPoints = ['35%', '80%']

  return (
    <Box bg={Colors.light} height={'full'}>
      {entityType === ENTITY_TYPE_EXPLOITATION_GROUP && (
        <FleetHeader
          onPress={(index: number, vessel: ExploitationVessel) =>
            onReloadFleetNavLogs(index, vessel)
          }
        />
      )}
      <NoInternetConnectionMessage />
      <Box height={'full'}>
        <MapView
          ref={mapRef}
          initialRegion={region} // remove if not using Google Maps
          provider={PROVIDER_GOOGLE}
          // customMapStyle={MapTheme}
          style={{...StyleSheet.absoluteFillObject}}
          onRegionChange={regionItem => handleRegionChange(regionItem)}
        >
          {prevNavLogs?.length > 0 &&
            prevNavLogs.find(
              (plan: NavigationLog) => plan.plannedEta !== null
            ) !== undefined &&
            renderMarkerFrom()}
          {/* {vesselStatus && renderMarkerVessel()} */}
          {renderMarkerVessel2}
          {plannedNavLogs?.length > 0 &&
            plannedNavLogs.find(
              (plan: NavigationLog) => plan.plannedEta !== null
            ) !== undefined &&
            renderMarkerTo()}
          {lastCompleteNavLogs.length > 0 &&
            lastCompleteNavLogs?.map((log: NavigationLog, index: number) =>
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
          {renderSearchLocationMarker}
          {isSearchPin && geoGraphicRoutes.length > 0 && (
            <Polyline
              coordinates={geoGraphicRoutes}
              strokeColor={Colors.azure}
              strokeWidth={5}
            />
          )}
        </MapView>
        {isLoadingMap && (
          <LoadingSlide
            color={Colors.primary}
            label={`${t('refreshing')}...`}
            loading={true}
          />
        )}
      </Box>
      {/* search input */}
      <Box
        left={0}
        position="absolute"
        pt={ms(15)}
        px={ms(10)}
        right={0}
        top={ms(isLoadingMap ? 40 : 0)}
        zIndex={1}
      >
        <Search
          handleItemAction={handleItemAction}
          isKeyboardVisible={isKeyboardVisible}
          setIsSearchPin={setIsSearchPin}
          onBlur={() => setKeyboardVisible(false)}
          onFocus={() => setKeyboardVisible(true)}
        />
      </Box>
      <Box position="absolute" right="0" top={isLoadingMap ? '13%' : '8%'}>
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
              onPress={() => {
                if (trackViewMode) {
                  centerMapToCurrentLocation()
                } else {
                  getVesselTrack(vesselId, page)
                  setFitToMarkers(true)
                }
                setTrackViewMode(!trackViewMode)
              }}
            />
          </Box>
        </VStack>
      </Box>
      {vesselStatus && vesselStatus?.speed > 1 ? (
        <Box left="2" position="absolute" top={isLoadingMap ? '15%' : '10%'}>
          <Box
            alignItems="center"
            bg={Colors.white}
            borderColor={Colors.dark_blue}
            borderRadius={50}
            borderWidth={3}
            h={screenWidth > 500 ? ms(51) : ms(54)}
            justifyContent="center"
            p={ms(3)}
            w={screenWidth > 500 ? ms(51) : ms(54)}
          >
            <Text bold fontSize={ms(14)}>
              {vesselStatus?.speed}
            </Text>
            <Text fontSize={ms(10)} fontWeight="medium" mt={-1}>
              km/h
            </Text>
          </Box>
        </Box>
      ) : null}
      <Box
        bgColor={Colors.light}
        h={ms(1)}
        left={0}
        position="absolute"
        right={0}
        shadow={2}
        top={0}
      />
      {!isKeyboardVisible && currentNavLog ? (
        <BottomSheet
          ref={sheetRef}
          handleIndicatorStyle={{display: 'none'}}
          handleStyle={{display: 'none'}}
          snapPoints={snapPoints}
          style={{borderRadius: 40, overflow: 'hidden'}}
          onChange={index => setSnapStatus(index)}
        >
          {renderBottomContent()}
        </BottomSheet>
      ) : !isKeyboardVisible && !currentNavLog ? (
        <Box
          backgroundColor={'#fff'}
          borderTopRadius={25}
          bottom={0}
          h="50"
          position="absolute"
          w="100%"
        >
          <Text
            color={Colors.azure}
            fontSize={ms(18)}
            fontWeight="700"
            my={ms(5)}
            textAlign="center"
          >
            {selectedVessel?.alias || null}
          </Text>
        </Box>
      ) : null}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={alertRef}
        onClose={() => {
          setIsAlertOpen(false)
        }}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{t('updateFailed')}</AlertDialog.Header>
          <AlertDialog.Body>{updateNavlogDatesError}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              onPress={() => {
                setIsAlertOpen(false)
              }}
            >
              <Text color={Colors.white}>{t('OK')}</Text>
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  )
}
