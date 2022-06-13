import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {Box, Text, Image} from 'native-base'
import {ms} from 'react-native-size-matters'

import {icons} from '@bluecentury/assets'

export const PreviousNavLogInfo = () => (
  <TouchableOpacity style={styles.container}>
    <Box ml={ms(15)}>
      <Text fontWeight="700">From : Terminal Name</Text>
      <Text color="#ADADAD">Arrived: 22 Jun 2020 | 22:00</Text>
      <Text color="#ADADAD" fontSize={ms(11)}>
        Departure date: 22 Jun 2020 | 22:00
      </Text>
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
      {/* <Icon name="check-circle" color="#6BBF87" size={30} solid={true} /> */}
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
      backgroundColor="#23475C"
    />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20
  }
})
