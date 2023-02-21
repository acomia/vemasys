import React from 'react'
import {Alert, Slide, Spinner, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

interface Props {
  isOpen: boolean
  label: string
  loading: boolean
  color: string
}

export default ({isOpen, label, loading, color}: Props) => {
  return (
    <Slide in={isOpen} mt={ms(53)} placement="top">
      <Alert
        backgroundColor={color}
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        {loading && <Spinner color={Colors.white} pr={2} />}
        <Text color={Colors.white}>{label}</Text>
      </Alert>
    </Slide>
  )
}
