import React, {useState} from 'react'
import {Switch, Platform, ActivityIndicator} from 'react-native'
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
import {FormControl, LoadingAnimated} from '@bluecentury/components'
import TextInput from './TextInput'
import {StandardContainerCargo} from '@bluecentury/models'

interface Props {
  header: string
  isOpen: boolean
  setOpen: () => void
  onAction?: (value: any) => void
  onCancel?: () => void
  container: StandardContainerCargo
  isLoading: boolean
}

export default ({
  header,
  isOpen,
  setOpen,
  onAction,
  onCancel,
  container,
  isLoading = false,
}: Props) => {
  const [formValues, setFormValues] =
    useState<StandardContainerCargo>(container)
  const [errors, setErrors] = useState<any>({})
  const {t} = useTranslation()
  const [isFIrstItem, setIsFIrstItem] = useState<boolean>(false)

  const renderToggle = () => {
    return (
      <HStack justifyContent={'space-evenly'} width={'100%'}>
        <Text
          color={!isFIrstItem ? Colors.primary : Colors.disabled}
          fontSize={ms(20)}
          fontWeight={'bold'}
          onPress={() => setIsFIrstItem(false)}
        >
          {t('out')}
        </Text>
        <Switch
          thumbColor={Colors.white}
          trackColor={{true: Colors.primary, false: Colors.primary}}
          value={isFIrstItem}
          onValueChange={() => setIsFIrstItem(prevValue => !prevValue)}
        />
        <Text
          color={isFIrstItem ? Colors.primary : Colors.disabled}
          fontSize={ms(20)}
          fontWeight={'bold'}
          onPress={() => setIsFIrstItem(true)}
        >
          {t('in')}
        </Text>
      </HStack>
    )
  }

  const handleSave = () => {
    onAction(formValues)
  }

  const handleOnClose = () => {
    setFormValues(null)
    setErrors({})
    setOpen()
    setIsFIrstItem(false)
  }

  const handleOnChange = (name: string, value: string) => {
    if (value === '') return
    const objValue = Number(value)

    setFormValues({
      ...container,
      [name]: isNaN(objValue) ? 0 : objValue,
    })
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
        <Modal.Content width={'full'}>
          <Modal.Header>
            <Text>{header}</Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={ms(5)}>
              {renderToggle()}
              <FormControl
                isDisabled={isFIrstItem}
                isInvalid={'nbOut' in errors}
              >
                <TextInput
                  isActive={!isFIrstItem}
                  label={t('out')}
                  maxLength={3}
                  name="nbOut"
                  placeholder={container?.nbOut?.toString()}
                  // value={outValue}
                  onChange={handleOnChange}
                />
              </FormControl>
              <FormControl
                isDisabled={!isFIrstItem}
                isInvalid={'inIn' in errors}
              >
                <TextInput
                  isActive={isFIrstItem}
                  label={t('in')}
                  maxLength={3}
                  name="nbIn"
                  placeholder={container?.nbIn?.toString()}
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
              <Button
                backgroundColor={
                  formValues === null || isLoading ? Colors.disabled : null
                }
                disabled={formValues === null || isLoading}
                flex={1}
                onPress={() => handleSave()}
              >
                {isLoading ? (
                  <ActivityIndicator size={ms(20)} />
                ) : (
                  <Text color={Colors.white}>{t('save')}</Text>
                )}
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </KeyboardAvoidingView>
  )
}
