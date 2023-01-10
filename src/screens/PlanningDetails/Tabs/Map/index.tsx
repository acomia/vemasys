import React from 'react'
import {Dimensions, StyleSheet} from 'react-native'
import {Box, Text} from 'native-base'
import MapView, {Marker} from 'react-native-maps'
import {ms} from 'react-native-size-matters'

import {usePlanning} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'

const {width, height} = Dimensions.get('window')

const Map = () => {
  const {t} = useTranslation()
  const {navigationLogDetails} = usePlanning()
  const ASPECT_RATIO = width / height
  const LATITUDE = navigationLogDetails?.location?.latitude || 0
  const LONGITUDE = navigationLogDetails?.location?.longitude || 0
  const LATITUDE_DELTA = 0.0922
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

  const NAVLOG_REGION = {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  }

  return (
    <Box flex="1" bg={Colors.white} p={ms(12)}>
      <Text fontSize={ms(20)} bold color={Colors.azure}>
        {t('navLogMap')}
      </Text>
      <MapView style={styles.map} initialRegion={NAVLOG_REGION}>
        <Marker coordinate={NAVLOG_REGION} />
      </MapView>
    </Box>
  )
}

const styles = StyleSheet.create({
  map: {
    height: 200,
    marginTop: 30,
  },
})

export default Map
