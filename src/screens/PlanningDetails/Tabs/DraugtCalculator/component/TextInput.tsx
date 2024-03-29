import React, {useState, useRef, useEffect} from 'react'
import {StyleSheet} from 'react-native'
import {Text, Input, Box, HStack} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import _ from 'lodash'
import {numberRegex} from '@bluecentury/constants'

interface Props {
  label?: string
  maxLength: number
  onChange: (name: string, value: string) => void
  name: string
  isActive?: boolean
  value?: string
}

export default ({label, maxLength, onChange, name, isActive, value}: Props) => {
  const inputRefs = useRef<any>([])
  const [textValue, setTextValue] = useState(Array(maxLength).fill(''))

  useEffect(() => {
    if (!isActive && value === '') {
      setTextValue(Array(maxLength).fill(''))
    }

    if (!isActive && value.length > 0) {
      const paddedValue = value?.padStart(maxLength, '0')
      setTextValue(paddedValue?.split(''))
    }
  }, [value])

  const handleOnChange = (text: string, index: number) => {
    const updatedValues = [...textValue]

    updatedValues[index] = text
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
                if (numberRegex.test(text)) {
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
