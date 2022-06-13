import React, {useEffect, useRef, useState} from 'react'
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native'
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

export default function Map() {
  const {getPreviousNavigationLogs} = useMap()
  const {logout} = useAuth()
  const sheetRef = useRef(null)
  const [snapStatus, setSnapStatus] = useState(0)

  // useEffect(() => {
  //   // logout()
  //   getPreviousNavigationLogs('6347')
  // }, [])

  const renderBottomContent = () => (
    <Box backgroundColor="#fff" height={ms(420)} px={ms(30)} py={ms(20)}>
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
        my={ms(20)}
        fontWeight="700"
        textAlign="center"
        color={Colors.azure}>
        Vessel Name Here
      </Text>
      {snapStatus === 1 && <PreviousNavLogInfo />}
      <CurrentNavLogInfo />
      {snapStatus === 1 && <PlannedNavLogInfo />}
      {snapStatus === 1 && <Button>View Navlog</Button>}
    </Box>
  )

  return (
    <Flex flex={1}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: 14.355333,
          longitude: 120.905387,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121
        }}
        minZoomLevel={14}>
        <Marker
          key={1}
          coordinate={{latitude: 14.355333, longitude: 120.905387}}
          title="Sample Marker"
          description="Sample Description"
        />
      </MapView>
      <BottomSheet
        ref={sheetRef}
        initialSnap={1}
        snapPoints={[420, 180]}
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
