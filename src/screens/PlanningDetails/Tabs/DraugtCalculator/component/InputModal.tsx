import React, {useState} from 'react'
import {TouchableOpacity, StyleSheet} from 'react-native'
import {Modal, Text, Button, HStack, Input, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'
import {FormControl} from '@bluecentury/components'

interface Props {
  header: string
  isOpen: boolean
  setOpen: () => void
  onAction?: (value: any) => void
  onCancel?: () => void
  value?: any
  maxDraught: number
}

export default ({
  header,
  isOpen,
  setOpen,
  onAction,
  onCancel,
  value,
  maxDraught,
}: Props) => {
  const initialValues = {
    freeboard: '',
    draught: '',
  }
  const [formValues, setFormValues] = useState(initialValues)
  const [errors, setErrors] = useState<any>({})
  const {t} = useTranslation()
  const [active, setActive] = useState<number>(0)

  const inputRegex = /^[0-9,.]*$/

  const renderToggle = () => {
    return (
      <HStack bg={Colors.disabled} width={'100%'}>
        <TouchableOpacity
          style={{
            backgroundColor: active === 0 ? Colors.dark_green : Colors.disabled,
            ...styles.button,
          }}
          onPress={() => {
            setActive(0), setErrors({})
          }}
        >
          <Text>{t('freeboard')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: active === 1 ? Colors.dark_green : Colors.disabled,
            ...styles.button,
          }}
          onPress={() => {
            setActive(1)
            setErrors({})
          }}
        >
          <Text>{t('draught')}</Text>
        </TouchableOpacity>
      </HStack>
    )
  }

  const handleSaveDraught = () => {
    let tempValue = {
      value: 0,
      draughtValue: 0,
    }

    if (active === 0) {
      const draught = maxDraught - parseInt(formValues?.freeboard)

      if (draught < 0 || draught > maxDraught) {
        setErrors({
          ...errors,
          freeboard: 'Draught cannot be higher than Max Draught',
        })
      }

      tempValue = {
        value: parseInt(formValues?.freeboard),
        draughtValue: maxDraught - parseInt(formValues?.freeboard),
      }
    } else {
      const draught = parseInt(formValues?.draught)
      if (draught < 0 || draught > maxDraught) {
        setErrors({
          ...errors,
          draught: 'Draught cannot be higher than Max Draught',
        })
        return
      }

      tempValue = {
        value: maxDraught - draught,
        draughtValue: draught,
      }
    }

    if (tempValue.draughtValue > maxDraught || tempValue.draughtValue < 0) {
      setErrors({
        ...errors,
        [active === 0 ? 'freeboard' : 'draught']: `${
          active === 0 ? 'Freeboard' : 'Draught'
        } cannot be higher than Max Draught`,
      })

      return
    }
    onAction(tempValue)
  }

  console.log('errors', errors)
  console.log('formValues', formValues)

  const handleOnClose = () => {
    onCancel()
    setFormValues(initialValues)
    setErrors({})
  }

  const handleOnChange = (fieldName: string, value: string) => {
    setFormValues({...formValues, [fieldName]: value})
  }

  return (
    <Modal
      backgroundColor="blue"
      isOpen={isOpen}
      width={'full'}
      onClose={() => {
        setOpen()
      }}
    >
      <Modal.Content width={'full'}>
        <Modal.Header>
          <Text>{header}</Text>
        </Modal.Header>
        <Modal.Body>
          <VStack space={ms(20)}>
            {renderToggle()}

            <FormControl
              errorMessage="test error message"
              isDisabled={active === 1}
              isInvalid={'freeboard' in errors}
              label={t('freeboardMeasurement')}
            >
              <Input
                borderColor={
                  active === 0
                    ? 'freeboard' in errors
                      ? Colors.danger
                      : Colors.azure
                    : null
                }
                isDisabled={active === 1} // check if this is for freeboard input
                keyboardType="numeric"
                maxLength={3}
                placeholder={maxDraught.toString() || '0'}
                value={formValues?.freeboard}
                onChangeText={value => {
                  if (inputRegex.test(value)) {
                    handleOnChange('freeboard', value)
                  }
                }}
              />
            </FormControl>
            <FormControl
              errorMessage="test error message"
              isDisabled={active === 0}
              isInvalid={'draught' in errors}
              label={t('freeboardMeasurement')}
            >
              <Input
                borderColor={
                  active === 1
                    ? 'draught' in errors
                      ? Colors.danger
                      : Colors.azure
                    : null
                }
                isDisabled={active === 0} // check if this is for freeboard input
                keyboardType="numeric"
                maxLength={3}
                placeholder={maxDraught.toString() || '0'}
                value={formValues?.draught}
                onChangeText={value => {
                  if (inputRegex.test(value)) {
                    handleOnChange('draught', value)
                  }
                }}
              />
            </FormControl>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <HStack mt={ms(10)} space={ms(5)} width="100%">
            <Button
              colorScheme={'white'}
              flex={1}
              onPress={() => {
                handleOnClose()
              }}
            >
              <Text color={Colors.disabled}>{t('close')}</Text>
            </Button>
            <Button flex={1} onPress={() => handleSaveDraught()}>
              <Text>{t('save')}</Text>
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
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
