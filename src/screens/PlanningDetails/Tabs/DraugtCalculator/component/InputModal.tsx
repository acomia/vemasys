import React, {useState, useEffect} from 'react'
import {TouchableOpacity, StyleSheet, Alert} from 'react-native'
import {Modal, Text, Button, HStack, Input, Box, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'
import {useForm} from '@bluecentury/hooks'

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
  const {
    handleOnChange,
    formValues,
    setFormValues,
    errors,
    setError,
    setErrors,
    handleSubmit,
  } = useForm(initialValues)
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
    let tempValue

    if (active === 0) {
      tempValue = {
        value: formValues?.freeboard,
        draughtValue: maxDraught - formValues?.freeboard,
      }
    } else {
      tempValue = {
        value: maxDraught - formValues?.draught,
        draughtValue: formValues?.draught,
      }
    }

    if (tempValue.draughtValue > maxDraught || tempValue.draughtValue < 0) {
      setError(
        active === 0 ? 'freeboard' : 'draught',
        `${
          active === 0 ? 'Freeboard' : 'Draught'
        } cannot be higher than Max Draught`
      )
      return
    }
    onAction(tempValue)
  }

  const handleOnClose = () => {
    onCancel()
    setFormValues(initialValues)
    setErrors({})
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
            <Box>
              <Text>{t('freeboardMeasurement')}</Text>
              <Input
                borderColor={
                  active === 0
                    ? errors?.freeboard
                      ? Colors.danger
                      : Colors.azure
                    : null
                }
                isDisabled={active === 1} // check if this is for freeboard input
                keyboardType="numeric"
                maxLength={3}
                placeholder={value?.value?.toString() || '0'}
                value={formValues?.freeboard}
                onChangeText={value => {
                  if (inputRegex.test(value)) {
                    handleOnChange('freeboard', value)
                  }
                }}
              />
              {errors?.freeboard && active === 0 && (
                <Text color={Colors.danger}>{errors.freeboard}</Text>
              )}
            </Box>
            <Box>
              <Text>{t('draughtMeasurement')}</Text>
              <Input
                borderColor={
                  active === 1
                    ? errors?.draught
                      ? Colors.danger
                      : Colors.azure
                    : null
                }
                isDisabled={active === 0} // check if this is for draught input
                keyboardType="numeric"
                maxLength={3}
                placeholder={value?.draughtValue?.toString() || '0'}
                value={formValues?.draught}
                onChangeText={value => {
                  if (inputRegex.test(value)) {
                    handleOnChange('draught', value)
                  }
                }}
              />
              {errors?.draught && active === 1 && (
                <Text color={Colors.danger}>{errors.draught}</Text>
              )}
            </Box>
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
            <Button flex={1} onPress={() => handleSubmit(handleSaveDraught)}>
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
