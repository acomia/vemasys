import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Text, Image} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'

import {Animated} from '@bluecentury/assets'
import {useEntity, useMap} from '@bluecentury/stores'

export const CurrentNavLogInfo = () => {
  const {currentNavLogs, prevNavLogs}: any = useMap()
  const {vesselDetails}: any = useEntity()

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => console.log('Current')}
    >
      <Box ml={ms(15)}>
        {vesselDetails?.lastGeolocation?.speed > 0 ? (
          <Text fontWeight="700">
            Navigating at{' '}
            <Text color="#29B7EF">
              {vesselDetails?.lastGeolocation?.speed} xx km/h
            </Text>
          </Text>
        ) : currentNavLogs?.length !== 0 ? (
          <>
            <Text fontWeight="700">{currentNavLogs[0]?.location?.name}</Text>
            <Text color="#ADADAD">
              Arrival:{' '}
              {moment(currentNavLogs[0]?.arrivalDatetime).format(
                'DD MMM YYYY | HH:mm'
              )}
            </Text>
          </>
        ) : (
          <>
            <Text fontWeight="700">Unknown Location</Text>
            <Text color="#ADADAD">
              Last seen:{' '}
              {moment(prevNavLogs[0]?.arrivalDatetime).format(
                'DD MMM YYYY | HH:mm'
              )}
            </Text>
          </>
        )}
      </Box>

      <Box
        position="absolute"
        left={ms(-20)}
        width={ms(40)}
        height={ms(40)}
        borderRadius={ms(20)}
        backgroundColor="#F0F0F0"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          alt="current-nav-log-img"
          source={Animated.nav_navigating}
          width={ms(30)}
          height={ms(30)}
          resizeMode="contain"
        />
      </Box>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BEE3F8',
    padding: 15,
    marginBottom: 20,
    zIndex: 1
  }
})