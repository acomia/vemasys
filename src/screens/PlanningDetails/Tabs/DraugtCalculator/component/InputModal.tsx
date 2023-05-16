import React, {useState} from 'react'
import {StyleSheet, Switch} from 'react-native'
import {Modal, Text, Button, HStack, Input, VStack} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'
import {FormControl, OTPInput} from '@bluecentury/components'
import TextInput from './TextInput'

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
  maxDraught,
}: Props) => {
  const initialValues = {
    freeboard: '',
    draught: '',
  }
  const [formValues, setFormValues] = useState(initialValues)
  const [errors, setErrors] = useState<any>({})
  const {t} = useTranslation()
  const [isDraught, setIsDraught] = useState<boolean>(false)

  const renderToggle = () => {
    return (
      <HStack justifyContent={'space-evenly'} width={'100%'}>
        <Text
          color={!isDraught ? Colors.primary : Colors.disabled}
          fontSize={ms(17)}
          fontWeight={'bold'}
          onPress={() => setIsDraught(false)}
        >
          {t('freeboard')}
        </Text>
        <Switch
          thumbColor={Colors.white}
          trackColor={{true: Colors.primary, false: Colors.primary}}
          value={isDraught}
          onValueChange={() => setIsDraught(prevValue => !prevValue)}
        />
        <Text
          color={isDraught ? Colors.primary : Colors.disabled}
          fontSize={ms(17)}
          fontWeight={'bold'}
          onPress={() => setIsDraught(true)}
        >
          {t('draught')}
        </Text>
      </HStack>
    )
  }

  const handleSaveDraught = () => {
    let tempValue = {
      value: 0,
      draughtValue: 0,
    }

    if (isDraught) {
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
    } else {
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
    }

    if (tempValue.draughtValue > maxDraught || tempValue.draughtValue < 0) {
      setErrors({
        ...errors,
        [!isDraught ? 'freeboard' : 'draught']: `${
          !isDraught ? 'Freeboard' : 'Draught'
        } cannot be higher than Max Draught`,
      })

      return
    }
    onAction(tempValue)
  }

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
              isDisabled={isDraught}
              isInvalid={'freeboard' in errors}
            >
              <TextInput
                isActive={!isDraught}
                label={t('freeboard')}
                maxLength={3}
                name="freeboard"
                onChange={handleOnChange}
              />
            </FormControl>
            <FormControl
              isDisabled={!isDraught}
              isInvalid={'draught' in errors}
            >
              <TextInput
                isActive={isDraught}
                label={t('draught')}
                maxLength={3}
                name="draught"
                onChange={handleOnChange}
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
              <Text color={Colors.disabled}>{t('cancel')}</Text>
            </Button>
            <Button flex={1} onPress={() => handleSaveDraught()}>
              <Text color={Colors.white}>{t('save')}</Text>
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
