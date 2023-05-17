import React, {useState, useRef} from 'react'
import {StyleSheet} from 'react-native'
import {Text, Input, Box, HStack} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import _ from 'lodash'

interface Props {
  label?: string
  maxLength: number
  onChange: (name: string, value: string) => void
  name: string
  isActive?: boolean
}

export default ({label, maxLength, onChange, name, isActive}: Props) => {
  const regex = /^[0-9]*$/
  const inputRefs = useRef<any>([])
  const [textValue, setTextValue] = useState(Array(maxLength).fill(''))

  const handleOnChange = (text: string, index: number) => {
    const updatedValues = [...textValue]

    if (text.length > 1) {
      updatedValues[index] = text[1]
    } else {
      updatedValues[index] = text[0]
    }
    setTextValue(updatedValues)

    onChange(name, updatedValues.join(''))

    if (text.length >= 1 && index < inputRefs.current.length - 1) {
      inputRefs?.current[index + 1]?.focus()
    }
  }

  return (
    <HStack alignItems={'center'} space={ms(10)}>
      <Box flex={1} px={ms(10)}>
        <Text fontSize="xs">{label}:</Text>
      </Box>
      <Box alignItems={'center'} flex={3} flexDirection={'row'}>
        {textValue.map((value, index) => {
          return (
            <Input
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              backgroundColor={isActive ? Colors.border : null}
              borderColor={isActive ? Colors.primary : null}
              fontSize={ms(20)}
              isDisabled={!isActive}
              keyboardType={'numeric'}
              maxLength={1}
              mx={ms(5)}
              textAlign={'center'}
              value={value}
              width={ms(50)}
              onChangeText={text => {
                if (regex.test(text)) {
                  handleOnChange(text, index)
                }
              }}
            />
          )
        })}
      </Box>
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
