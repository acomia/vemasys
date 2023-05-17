import React, {useState} from 'react'
import {Switch} from 'react-native'
import {Modal, Text, Button, HStack, VStack} from 'native-base'
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
    const draught = isDraught
      ? parseInt(formValues?.draught)
      : maxDraught - parseInt(formValues?.freeboard)

    const freeboard = isDraught
      ? maxDraught - draught
      : parseInt(formValues?.freeboard)

    if (draught < 0 || draught > maxDraught) {
      setErrors({
        ...errors,
        [isDraught ? 'draught' : 'freeboard']:
          'Draught cannot be higher than Max Draught',
      })
      return
    }

    onAction({draught, freeboard})
  }

  const handleOnClose = () => {
    setFormValues(initialValues)
    setErrors({})
    onCancel()
  }

  const handleOnChange = (fieldName: string, value: string) => {
    const draught = isDraught ? parseInt(value) : maxDraught - parseInt(value)
    const freeboard = isDraught ? maxDraught - parseInt(value) : parseInt(value)

    setFormValues({
      draught: draught.toString(),
      freeboard: freeboard.toString(),
    })
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
                value={formValues?.freeboard}
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
                value={formValues?.draught}
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
