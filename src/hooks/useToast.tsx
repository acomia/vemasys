import React from 'react'
import {Text, Toast} from 'native-base'
import {Colors} from '@bluecentury/styles'

export const showToast = (text: string, res: string) => {
  return Toast.show({
    duration: 1000,
    render: () => {
      return (
        <Text
          bg={res === 'success' ? 'emerald.500' : 'red.500'}
          color={Colors.white}
          mb={5}
          px="2"
          py="1"
          rounded="sm"
        >
          {text}
        </Text>
      )
    },
  })
}
