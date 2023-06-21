import React, {useState} from 'react'
import {Platform, ActivityIndicator} from 'react-native'
import {
  Modal,
  Text,
  Button,
  HStack,
  VStack,
  Box,
  Select,
  KeyboardAvoidingView,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {useTranslation} from 'react-i18next'
import {FormControl} from '@bluecentury/components'
import TextInput from './TextInput'
import {NavigationContainer} from '@bluecentury/models'
import {usePlanning} from '@bluecentury/stores'

interface Props {
  header: string
  isOpen: boolean
  setOpen: () => void
  isLoading?: boolean
}

export default ({header, isOpen, setOpen, isLoading = false}: Props) => {
  const {
    navigationContainers,
    navigationLogDetails,
    isCreateContainerLoading,
    createNavigationContainer,
  } = usePlanning()
  const [errors, setErrors] = useState<any>({})
  const [containerValue, setContainerValue] = useState('')
  const {t} = useTranslation()
  const [formValues, setFormValues] = useState<any>({})

  const handleSave = () => {
    const navContainer: NavigationContainer[] = navigationContainers.filter(
      navCon => navCon?.id?.toString() === formValues?.container
    )

    if (navigationLogDetails && navContainer) {
      createNavigationContainer({
        log: navigationLogDetails?.id?.toString(),
        type: containerValue?.toString(),

        ...formValues,
      })
    }
  }

  const handleOnClose = () => {
    setErrors({})
    setOpen()
    setContainerValue('')
  }

  const handleTextOnChange = (name: string, value: string) => {
    if (value === '') return
    const objValue = Number(value)

    setFormValues({
      ...formValues,
      [name]: isNaN(objValue) ? 0 : objValue,
    })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Modal isOpen={isOpen} onClose={() => setOpen()}>
        <Modal.Content width={'full'}>
          <Modal.Header>
            {' '}
            <Text>{header}</Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={ms(10)}>
              <Box>
                <Select
                  accessibilityLabel=""
                  bg={Colors.light_grey}
                  minWidth="300"
                  mt={ms(3)}
                  placeholder="Choose Container"
                  selectedValue={containerValue}
                  onValueChange={e => {
                    setContainerValue(e)
                  }}
                >
                  {navigationContainers?.map((navContainer, index) => {
                    return (
                      <Select.Item
                        key={index}
                        label={`[${navContainer?.isoType}] ${navContainer?.type?.title}`}
                        value={navContainer?.type?.id?.toString()}
                      />
                    )
                  })}
                </Select>
              </Box>
              <Box>
                <FormControl isInvalid={'nbOut' in errors}>
                  <TextInput
                    isActive={true}
                    label={t('out')}
                    maxLength={3}
                    name="nbOut"
                    value={formValues?.nbOut}
                    onChange={handleTextOnChange}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isInvalid={'inIn' in errors}>
                  <TextInput
                    isActive={true}
                    label={t('in')}
                    maxLength={3}
                    name="nbIn"
                    value={formValues?.nbIn}
                    onChange={handleTextOnChange}
                  />
                </FormControl>
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
                <Text color={Colors.disabled}>{t('cancel')}</Text>
              </Button>
              <Button
                backgroundColor={
                  formValues === null || isCreateContainerLoading
                    ? Colors.disabled
                    : null
                }
                disabled={formValues === null || isCreateContainerLoading}
                flex={1}
                onPress={() => handleSave()}
              >
                {isCreateContainerLoading ? (
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
