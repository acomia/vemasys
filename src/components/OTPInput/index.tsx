import React, {useState, useEffect, useRef} from 'react'
import {TextInput, StyleSheet, Text, Pressable} from 'react-native'
import {ms} from 'react-native-size-matters'
import {Button, HStack, Modal, useToast} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'

type Props = {
  numberLength: number
  decimalLength: number
  getValue: (value: string) => void
  initialValue: number
  maxValue?: number
  minValue?: number
  errorMessage?: string
  isDisabled?: boolean
}

export const OTPInput = ({
  numberLength,
  decimalLength,
  getValue,
  initialValue,
  maxValue,
  minValue,
  errorMessage,
  isDisabled,
}: Props) => {
  const [number, setNumber] = useState('')
  const [decimal, setDecimal] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInputInvalid, setIsInputInvalid] = useState(false)
  const [initialNumber, setInitialNumber] = useState<string | null>(null)
  const [initialDecimal, setInitialDecimal] = useState<string | null>(null)
  const {t} = useTranslation()
  const inputRefs = useRef<any>([])
  const decimalRefs = useRef<any>([])

  useEffect(() => {
    if (initialValue) {
      if (initialValue % 1 === 0) {
        setDecimal('0'.padEnd(decimalLength, '0'))
        setInitialDecimal('0'.padEnd(decimalLength, '0'))
      } else {
        setDecimal(
          initialValue.toString().split('.')[1].padEnd(decimalLength, '0')
        )
        setInitialDecimal(
          initialValue.toString().split('.')[1].padEnd(decimalLength, '0')
        )
      }
      setNumber(Math.trunc(initialValue).toString().padStart(numberLength, '0'))
      setInitialNumber(
        Math.trunc(initialValue).toString().padStart(numberLength, '0')
      )
    }
  }, [initialValue])

  useEffect(() => {
    formNewNumber(number, decimal)
  }, [number, decimal])

  const handleNumberChange = (value: string, index: number) => {
    if (value) {
      const newOtp = [...Array.from(number.toString())]
      newOtp[index] = value
      const newNumber = newOtp.join('')
      setNumber(newNumber.padStart(numberLength, '0'))
      setIsInputInvalid(false)

      if (value.length >= 1 && index < inputRefs.current.length - 1) {
        inputRefs?.current[index + 1]?.focus()
      }

      if (index === inputRefs.current.length - 1) {
        decimalRefs?.current[0]?.focus()
      }
    }
  }

  const handleDecimalChange = (value: string, index: number) => {
    if (value) {
      const newOtp = [...Array.from(decimal.toString())]
      newOtp[index] = value
      const newNumber = newOtp.join('')
      setDecimal(newNumber.padEnd(decimalLength, '0'))
      setIsInputInvalid(false)

      if (value.length >= 1 && index < decimalRefs.current.length - 1) {
        decimalRefs?.current[index + 1]?.focus()
      }
    }
  }

  const formNewNumber = (num: string, dec: string) => {
    const newNumber = parseFloat(`${num}.${dec}`)
    if (maxValue && minValue) {
      if (newNumber > maxValue || newNumber < minValue) {
        return setIsInputInvalid(true)
      }
    }
    if (maxValue) {
      if (newNumber > maxValue) {
        return setIsInputInvalid(true)
      }
    }
    if (minValue) {
      if (newNumber < minValue) {
        return setIsInputInvalid(true)
      }
    }
  }

  const onModalSave = (num: string, dec: string) => {
    getValue(`${num}.${dec}`)
    setIsModalOpen(false)
  }

  const onModalCancel = (initialNum: string, initialDec: string) => {
    setNumber(initialNum)
    setDecimal(initialDec)
    setIsModalOpen(false)
  }

  return (
    <Pressable
      style={styles.container}
      onPress={!isDisabled ? () => setIsModalOpen(true) : null}
    >
      {Array.from(number.toString()).map((digit, index) => (
        <TextInput
          key={index}
          defaultValue={digit}
          editable={false}
          keyboardType="numeric"
          maxLength={1}
          style={styles.box}
          onPressIn={!isDisabled ? () => setIsModalOpen(true) : null}
        />
      ))}
      <Text style={styles.coma}>,</Text>
      {decimalLength
        ? Array.from(decimal.toString()).map((digit, index) => (
            <TextInput
              key={index}
              defaultValue={digit}
              editable={false}
              keyboardType="numeric"
              maxLength={1}
              style={styles.decimalBox}
              onPressIn={!isDisabled ? () => setIsModalOpen(true) : null}
            />
          ))
        : null}
      <Modal animationPreset="slide" isOpen={isModalOpen} size="full">
        <Modal.Content>
          <Modal.Header>
            <Text>Enter tonnage</Text>
          </Modal.Header>
          <Modal.Body>
            <HStack justifyContent="space-between">
              {Array.from(number.toString()).map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  defaultValue={digit}
                  keyboardType="numeric"
                  maxLength={1}
                  style={styles.box}
                  onChangeText={value => handleNumberChange(value, index)}
                />
              ))}
              <Text style={styles.coma}>,</Text>
              {decimalLength
                ? Array.from(decimal.toString()).map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => (decimalRefs.current[index] = ref)}
                      defaultValue={digit}
                      keyboardType="numeric"
                      maxLength={1}
                      style={styles.decimalBox}
                      onChangeText={value => handleDecimalChange(value, index)}
                    />
                  ))
                : null}
            </HStack>
            {isInputInvalid && (
              <Text style={styles.error}>
                Tonnage can't be higher than maximal tonnage
              </Text>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              bg="#E0E0E0"
              flex="1"
              m={ms(5)}
              onPress={() => {
                onModalCancel(initialNumber, initialDecimal)
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              bg={Colors.primary}
              flex="1"
              m={ms(5)}
              onPress={() => {
                onModalSave(number, decimal)
              }}
            >
              {t('save')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  numbersContainer: {
    height: ms(40),
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 4,
  },
  numbersWithoutDecimal: {
    height: ms(40),
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 4,
  },
  decimalContainer: {
    height: ms(40),
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 3,
  },
  box: {
    borderWidth: 1,
    borderColor: '#44A7B9',
    borderRadius: 5,
    width: ms(40),
    height: ms(40),
    textAlign: 'center',
    backgroundColor: '#44A7B942',
    fontSize: 14,
  },
  decimalBox: {
    borderWidth: 1,
    borderColor: '#23475C',
    borderRadius: 5,
    width: ms(40),
    height: ms(40),
    textAlign: 'center',
    backgroundColor: '#23475C42',
    fontSize: 14,
  },
  coma: {
    alignSelf: 'flex-end',
  },
  error: {
    color: Colors.danger,
    textAlign: 'center',
    paddingTop: ms(5),
  },
})
