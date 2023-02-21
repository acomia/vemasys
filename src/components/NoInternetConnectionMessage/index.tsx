import React from 'react'
import {Box, Text} from 'native-base'
import {StyleSheet} from 'react-native'
import {useSettings} from '@bluecentury/stores'

export const NoInternetConnectionMessage = () => {
  const isOnline = useSettings().isOnline
  return !isOnline ? (
    <Box style={styles.container}>
      <Text style={styles.text}>Offline mode. No internet connection.</Text>
    </Box>
  ) : null
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 24,
    backgroundColor: '#f50529',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    color: '#fff'
  }
})

// const isOnline = useSettings().isOnline
