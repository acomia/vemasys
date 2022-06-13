import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Text, Image} from 'native-base'
import {ms} from 'react-native-size-matters'

import {Animated} from '@bluecentury/assets'

export const CurrentNavLogInfo = () => (
  <TouchableOpacity style={styles.container}>
    <Text fontWeight="700" ml={ms(15)} textAlign="center">
      Navigating at <Text color="#29B7EF">xx km/h</Text>
    </Text>
    <Box
      position="absolute"
      left={ms(-20)}
      width={ms(40)}
      height={ms(40)}
      borderRadius={ms(20)}
      backgroundColor="#F0F0F0"
      alignItems="center"
      justifyContent="center">
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BEE3F8',
    padding: 20,
    marginBottom: 20,
    zIndex: 1
  }
})
