import React, {useState} from 'react'
import {Switch, Platform} from 'react-native'
import {
  Modal,
  Text,
  Button,
  HStack,
  VStack,
  KeyboardAvoidingView,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'
import {FormControl} from '@bluecentury/components'
import TextInput from './TextInput'

interface Props {
  header: string
  isOpen: boolean
  setOpen: () => void
  onAction?: (value: any) => void
  onCancel?: () => void
  inValue: string
  outValue: string
}

export default ({
  header,
  isOpen,
  setOpen,
  onAction,
  onCancel,
  inValue,
  outValue,
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
          fontSize={ms(20)}
          fontWeight={'bold'}
          onPress={() => setIsDraught(false)}
        >
          {t('out')}
        </Text>
        <Switch
          thumbColor={Colors.white}
          trackColor={{true: Colors.primary, false: Colors.primary}}
          value={isDraught}
          onValueChange={() => setIsDraught(prevValue => !prevValue)}
        />
        <Text
          color={isDraught ? Colors.primary : Colors.disabled}
          fontSize={ms(20)}
          fontWeight={'bold'}
          onPress={() => setIsDraught(true)}
        >
          {t('in')}
        </Text>
      </HStack>
    )
  }

  const handleSave = () => {
    console.log('test')
    handleOnClose()
  }

  const handleOnClose = () => {
    setFormValues(initialValues)
    setErrors({})
    setOpen()
  }

  const handleOnChange = (value: string) => {
    if (value === '') {
      setFormValues(initialValues)
      return
    }

    console.log('test')
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Modal
        backgroundColor="blue"
        isOpen={isOpen}
        width={'full'}
        onClose={() => {
          setOpen()
        }}
      >
        {console.log('', outValue, ' ', inValue)}
        <Modal.Content width={'full'}>
          <Modal.Header>
            <Text>{header}</Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={ms(5)}>
              {renderToggle()}
              <FormControl
                isDisabled={isDraught}
                isInvalid={'freeboard' in errors}
              >
                <TextInput
                  isActive={!isDraught}
                  label={t('out')}
                  maxLength={3}
                  name="out_input"
                  placeholder={outValue}
                  // value={outValue}
                  onChange={handleOnChange}
                />
              </FormControl>
              <FormControl
                isDisabled={!isDraught}
                isInvalid={'draught' in errors}
              >
                <TextInput
                  isActive={isDraught}
                  label={t('in')}
                  maxLength={3}
                  name="in_input"
                  placeholder={inValue}
                  // value={inValue}
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
              <Button flex={1} onPress={() => handleSave()}>
                <Text color={Colors.white}>{t('save')}</Text>
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </KeyboardAvoidingView>
  )
}
