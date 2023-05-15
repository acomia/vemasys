import React, {useState} from 'react'
import {TouchableOpacity, StyleSheet} from 'react-native'
import {VStack, Text, Input, Box, HStack} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import _ from 'lodash'

interface Props {
  active?: number
  setActive?: React.Dispatch<React.SetStateAction<number>>
  hasError?: boolean
  error?: string
  label: string
  maxLength: number
}

export default (props: Props) => {
  const [textValue, setTextValue] = useState(Array(props?.maxLength).fill(''))

  const handleOnChange = (text, index) => {
    const updatedValues = [...textValue]
    updatedValues[index] = text
    setTextValue(updatedValues)

    props?.onChange(updatedValues.join(''))
  }

  return (
    <VStack space={ms(10)}>
      <HStack alignItems={'center'} justifyContent={'left'}>
        <Text>{props?.label}</Text>
        <Box alignItems={'center'} flexDirection={'row'}>
          {textValue.map((value, index) => {
            return (
              <Box
                alignItems={'center'}
                justifyContent={'center'}
                mx={ms(10)}
                width={ms(50)}
              >
                <Input
                  key={index}
                  fontSize={ms(20)}
                  keyboardType={'numeric'}
                  maxLength={1}
                  placeholder={props?.placeholder}
                  textAlign={'center'}
                  value={value}
                  onChangeText={text => handleOnChange(text, index)}
                />
              </Box>
            )
          })}
        </Box>
      </HStack>
      {props?.hasError && <Text>{props?.error}</Text>}
    </VStack>
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
