import React from 'react'
import {TouchableOpacity, StyleSheet} from 'react-native'
import {HStack, Text} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'

interface Props {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

export default (props: Props) => {
  return (
    <HStack bg={Colors.disabled} width={'100%'}>
      <TouchableOpacity
        style={{
          backgroundColor: props.active ? Colors.dark_green : Colors.disabled,
          ...styles.button,
        }}
        onPress={() => props.setActive(true)}
      >
        <Text>Before</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: !props.active ? Colors.dark_green : Colors.disabled,
          ...styles.button,
        }}
        onPress={() => props.setActive(false)}
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
