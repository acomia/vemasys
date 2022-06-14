import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import {Box, Flex, Text, Button} from 'native-base'
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  Callout
} from 'react-native-maps'
import BottomSheet from 'reanimated-bottom-sheet'
import {ms} from 'react-native-size-matters'

import {
  PreviousNavLogInfo,
  PlannedNavLogInfo,
  CurrentNavLogInfo
} from '@bluecentury/components'
import {icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {useMap, useAuth} from '@bluecentury/stores'

const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
export default function Map() {
  const {
    getPreviousNavigationLogs,
    getPlannedNavigationLogs,
    getCurrentNavigationLogs,
    prevNavLogs,
    plannedNavLogs,
    currentNavLogs
  } = useMap()
  const {logout} = useAuth()

  const LATITUDE = 50.503887
  const LONGITUDE = 4.469936
  const sheetRef = useRef(null)
  const [snapStatus, setSnapStatus] = useState(0)
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  })

  useEffect(() => {
    // logout()
    getPreviousNavigationLogs('118')
    getPlannedNavigationLogs('118')
    getCurrentNavigationLogs('118')
  }, [])

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
        color={Colors.azure}>
        Vessel Name Here
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
    const previousLocation = Array.isArray(prevNavLogs)
      ? prevNavLogs?.find(nav => nav?.plannedETA !== null)
      : {}
    return (
      <Marker
        key={previousLocation?.location?.id}
        pinColor={'#6BBF87'}
        coordinate={{
          latitude: previousLocation?.location?.latitude,
          longitude: previousLocation?.location?.longitude
        }}
        title={`From: ${previousLocation?.location?.name}`}
        description="Sample Description"
      />
    )
  }

  function renderMarkerVesel() {
    return (
      <Marker
        // key={currentNavLogs[0]?.location?.id}
        coordinate={{
          latitude: currentNavLogs[0]?.location?.latitude,
          longitude: currentNavLogs[0]?.location?.longitude
        }}
        title="Sample Marker"
        description="Sample Description"
      />
    )
  }

  function renderMarkerTo() {
    const nextLocation = Array.isArray(plannedNavLogs)
      ? plannedNavLogs?.find(nav => nav?.plannedETA !== null)
      : {}
    return (
      <Marker
        key={nextLocation?.location?.id}
        pinColor={'#29B7EF'}
        coordinate={{
          latitude: nextLocation?.location?.latitude,
          longitude: nextLocation?.location?.longitude
        }}
        title={`To: ${nextLocation?.location?.name}`}
        description="Sample Description"
      />
    )
  }

  return (
    <Flex flex={1}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        initialRegion={region}
        // initialCamera={{
        //   center: {
        //     latitude: currentNavLogs[0]?.location?.latitude,
        //     longitude: currentNavLogs[0]?.location?.longitude
        //   },
        //   pitch: 45,
        //   heading: 90,
        //   altitude: 1000,
        //   zoom: 10
        // }}
        // region={{
        //   latitude: currentNavLogs[0]?.location?.latitude,
        //   longitude: currentNavLogs[0]?.location?.longitude,
        //   latitudeDelta: 0.015,
        //   longitudeDelta: 0.0121
        // }}
      >
        {prevNavLogs?.length > 0 ? renderMarkerFrom() : null}
        {currentNavLogs?.length > 0 ? renderMarkerVesel() : null}
        {plannedNavLogs?.length > 0 ? renderMarkerTo() : null}
      </MapView>
      <BottomSheet
        ref={sheetRef}
        initialSnap={1}
        snapPoints={[ms(440), ms(180)]}
        borderRadius={20}
        renderContent={renderBottomContent}
        onOpenEnd={() => setSnapStatus(1)}
        onCloseEnd={() => setSnapStatus(0)}
      />
    </Flex>
  )
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
})
