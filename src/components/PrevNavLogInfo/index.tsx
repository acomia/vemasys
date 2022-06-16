import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Text, Image} from 'native-base'
import {ms} from 'react-native-size-matters'
import moment from 'moment'

import {icons} from '@bluecentury/assets'
import {useMap} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'

export const PreviousNavLogInfo = () => {
  const {prevNavLogs} = useMap()
  const navigationLog = prevNavLogs?.filter(e => e && e.plannedETA !== null)

  function formatLocationLabel(location: GeographicPoint) {
    if (location.locationName) {
      return `[${location.locationName}] ${location.name}`
    }
    return location.name
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => console.log('Previous')}>
      <Box ml={ms(15)}>
        {navigationLog === undefined ? (
          <Text fontWeight="700" color="#ADADAD">
            No Previous Terminal
          </Text>
        ) : (
          <>
            <Text fontWeight="700">
              From: {formatLocationLabel(navigationLog[0]?.location)}
            </Text>
            <Text color="#ADADAD">
              Arrived:{' '}
              {moment(navigationLog[0]?.arrivalDatetime).format(
                'DD MMM YYYY | HH:mm'
              )}
            </Text>
            <Text color="#ADADAD" fontSize={ms(11)}>
              Departure date:{' '}
              {moment(navigationLog[0]?.departureDatetime).format(
                'DD MMM YYYY | HH:mm'
              )}
            </Text>
          </>
        )}
      </Box>
      {navigationLog === undefined ? null : (
        <>
          <Box
            position="absolute"
            left={ms(-20)}
            width={ms(40)}
            height={ms(40)}
            borderRadius={ms(20)}
            backgroundColor="#F0F0F0"
            alignItems="center"
            justifyContent="center"
            zIndex={1}>
            <Image
              alt="prev-nav-log-img"
              source={icons.completed}
              width={ms(30)}
              height={ms(30)}
              resizeMode="contain"
            />
          </Box>
          <Box
            position="absolute"
            bottom={ms(-35)}
            width={ms(2)}
            height={ms(50)}
            backgroundColor={Colors.azure}
          />
        </>
      )}
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20
  }
})
