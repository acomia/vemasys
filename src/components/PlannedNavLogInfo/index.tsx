import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Text, Image} from 'native-base'
import {ms} from 'react-native-size-matters'

import {Animated} from '@bluecentury/assets'

export const PlannedNavLogInfo = () => (
  <TouchableOpacity style={styles.container}>
    <Box ml={ms(15)}>
      <Text fontWeight="700">To : Terminal Name</Text>
      <Text color="#ADADAD">Planned: 25 Jun 2020 | 23:27</Text>
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
      zIndex={1}>
      <Image
        alt="planned-nav-log-img"
        source={Animated.nav_unloading}
        width={ms(30)}
        height={ms(30)}
        resizeMode="contain"
      />
    </Box>
    <Box
      position="absolute"
      top={ms(-35)}
      width={ms(2)}
      height={ms(50)}
      backgroundColor="#23475C"
    />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1.3,
    borderColor: '#BEE3F8',
    borderStyle: 'dashed',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20
  }
})
