import React from 'react'
import {Text, Alert} from 'native-base'
import {useSettings} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {StyleSheet} from 'react-native'

export const NoInternetConnectionMessage = () => {
  const isOnline = useSettings().isOnline
  return !isOnline ? (
    <Alert
      backgroundColor={Colors.offlineWarning}
      borderRadius="0"
      display="flex"
      flexDirection="row"
      justifyContent="center"
    >
      <MaterialIcons
        color={Colors.white}
        name="wifi-off"
        size={ms(20)}
        style={styles.iconStyle}
      />
      <Text color={Colors.white} fontSize={ms(14)} fontWeight="medium">
        Offline mode. No internet connection.
      </Text>
    </Alert>
  ) : null
}

const styles = StyleSheet.create({
  iconStyle: {
    marginRight: ms(16),
  },
})
