import React from 'react'
import {TouchableOpacity, StyleSheet} from 'react-native'
import {HStack, Text} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'

interface Props {
  active: number
  setActive: React.Dispatch<React.SetStateAction<number>>
}

export default (props: Props) => {
  return (
    <HStack bg={Colors.disabled} width={'100%'}>
      <TouchableOpacity
        style={{
          backgroundColor:
            props.active === 0 ? Colors.dark_green : Colors.disabled,
          ...styles.button,
        }}
        onPress={() => props.setActive(0)}
      >
        <Text>Before</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor:
            props.active === 1 ? Colors.dark_green : Colors.disabled,
          ...styles.button,
        }}
        onPress={() => props.setActive(1)}
      >
        <Text>After</Text>
      </TouchableOpacity>
    </HStack>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(10),
  },
})
