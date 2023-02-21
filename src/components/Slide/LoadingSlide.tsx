import React from 'react'
import {Alert, View, Spinner, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

interface Props {
  label: string
  loading: boolean
  color: string
}

export default ({label, loading, color}: Props) => {
  return (
    <View>
      <Alert
        backgroundColor={color}
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        {loading && <Spinner color={Colors.white} pr={2} />}
        <Text color={Colors.white}>{label}</Text>
      </Alert>
    </View>
  )
}
