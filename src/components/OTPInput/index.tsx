import React, {useState, useEffect} from 'react'
import {TextInput, StyleSheet, Text, Pressable} from 'react-native'
import {ms} from 'react-native-size-matters'
import {Button, HStack, Modal} from 'native-base'
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
  lineIndex?: number
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
  lineIndex,
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

  const onModalSave = (num: string, dec: string) => {
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

    getValue(`${num}.${dec}`)
    setIsModalOpen(false)
  }

  const onModalCancel = (initialNum: string, initialDec: string) => {
    setNumber(initialNum)
    setDecimal(initialDec)
    setIsModalOpen(false)
  }

  const defineInputStyle = (
    initial: number,
    num: string,
    index: number,
    dec: boolean
  ) => {
    let wholeNumber
    let decimalNumber = ''
    if (initial % 1 === 0) {
      wholeNumber = initial.toString()
    } else {
      wholeNumber = initial.toString().split('.')[0]
      decimalNumber = initial.toString().split('.')[1]
    }
    if (dec) {
      return decimalNumber.length - 1 < index
    } else {
      return numberLength - wholeNumber.length - 1 >= index
    }
  }

  return (
    <Pressable
      style={styles.container}
      onPress={!isDisabled ? () => setIsModalOpen(true) : null}
    >
      {Array.from(number.toString()).map((digit, index) => (
        <TextInput
          key={index}
          style={
            defineInputStyle(initialValue, number, index, false)
              ? (lineIndex && lineIndex % 2 === 0) || lineIndex === 0
                ? styles.disabled
                : [styles.disabled, {backgroundColor: Colors.white}]
              : styles.boxSmall
          }
          defaultValue={digit}
          editable={false}
          keyboardType="numeric"
          maxLength={1}
          onPressIn={!isDisabled ? () => setIsModalOpen(true) : null}
        />
      ))}
      <Text style={styles.coma}>,</Text>
      {decimalLength
        ? Array.from(decimal.toString()).map((digit, index) => (
            <TextInput
              key={index}
              style={
                defineInputStyle(initialValue, number, index, true)
                  ? (lineIndex && lineIndex % 2 === 0) || lineIndex === 0
                    ? styles.disabled
                    : [styles.disabled, {backgroundColor: Colors.white}]
                  : styles.decimalBoxSmall
              }
              defaultValue={digit}
              editable={false}
              keyboardType="numeric"
              maxLength={1}
              onPressIn={!isDisabled ? () => setIsModalOpen(true) : null}
            />
          ))
        : null}
      <Modal animationPreset="slide" isOpen={isModalOpen} size="full">
        <Modal.Content>
          <Modal.Header>
            <Text>{t('enterNumber')}</Text>
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
    paddingHorizontal: ms(6),
    height: ms(58),
  },
  numbersContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  numbersWithoutDecimal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  decimalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  box: {
    borderWidth: 1,
    borderColor: '#44A7B9',
    borderRadius: 5,
    textAlign: 'center',
    backgroundColor: '#44A7B942',
    fontSize: 14,
    aspectRatio: 1,
  },
  boxSmall: {
    borderWidth: 1,
    borderColor: '#44A7B9',
    borderRadius: 5,
    height: '50%',
    aspectRatio: 1,
    textAlign: 'center',
    backgroundColor: '#44A7B942',
    fontSize: 14,
    paddingVertical: 0,
    marginVertical: 0,
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
  decimalBoxSmall: {
    borderWidth: 1,
    borderColor: '#23475C',
    borderRadius: 5,
    height: '50%',
    aspectRatio: 1,
    textAlign: 'center',
    backgroundColor: '#23475C42',
    fontSize: 14,
    paddingVertical: 0,
    marginVertical: 0,
  },
  coma: {
    alignSelf: 'center',
  },
  error: {
    color: Colors.danger,
    textAlign: 'center',
    paddingTop: ms(5),
  },
  disabled: {
    borderRadius: 5,
    height: '50%',
    aspectRatio: 1,
    textAlign: 'center',
    backgroundColor: Colors.light_grey,
    fontSize: 14,
    color: Colors.disabled,
    paddingVertical: 0,
    marginVertical: 0,
  },
})