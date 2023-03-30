import React, {useState, useRef, useEffect} from 'react'
import {
  Modal,
  Text,
  View,
  Pressable,
  HStack,
  VStack,
  Input,
  Button,
  FormControl,
  Spinner,
  Image,
} from 'native-base'
import {useTranslation} from 'react-i18next'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {Keyboard} from 'react-native'
import {Requirements} from './components'
import {useUser, useEntity} from '@bluecentury/stores'
import {showToast} from '@bluecentury/hooks'
import {Icons} from '@bluecentury/assets'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'

const ResetPasswordModal = () => {
  const {t} = useTranslation()
  const {
    isResetPasswordLoading,
    isResetPasswordSuccess,
    resetPassword,
    unmountResetPassword,
  } = useUser()
  const {user} = useEntity()

  const passwordRef = useRef(null)
  const cPasswordRef = useRef(null)

  const [isOpenModal, setOpenModal] = useState(false)
  const [formData, setFormdata] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

  useEffect(() => {
    const timeout = setTimeout(() => {
      passwordRef.current?.blur()
      passwordRef.current?.focus()
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (isResetPasswordSuccess) {
      closeModal()
      showToast(t('changePasswordSuccess'), 'success')
      unmountResetPassword()
    }
  }, [isResetPasswordSuccess])

  const onSubmit = () => {
    setErrors({})
    if (!validate()) return

    if (!errors && user?.id) {
      resetPassword(user?.id, {plainPassword: formData?.password})
    }
  }

  const validate = () => {
    if (formData.password === '' || formData.password === undefined) {
      setErrors({...errors, password: t('invalidPassword')})
      return false
    }

    if (!passwordRegex.exec(formData.password)) {
      setErrors({...errors, password: 'Password invalid format'})
      return false
    }

    if (
      formData.confirmPassword === '' ||
      formData.confirmPassword === undefined
    ) {
      setErrors({...errors, confirmPassword: t('confirmPasswordError')})
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({...errors, confirmPassword: t('confirmPasswordError')})
      return false
    }

    return true
  }

  const closeModal = () => {
    setErrors({})
    setFormdata({
      password: '',
      confirmPassword: '',
    })
    setOpenModal(false)
  }

  const renderPasswordError = () => {
    return (
      <View>
        <FormControl.ErrorMessage>
          <IconFA5 name="exclamation-circle" />{' '}
          <Text>{t('passwordErrorSub1')}</Text>
        </FormControl.ErrorMessage>

        <FormControl.ErrorMessage>
          <IconFA5 name="exclamation-circle" />{' '}
          <Text>{t('passwordErrorSub2')}</Text>
        </FormControl.ErrorMessage>
      </View>
    )
  }

  return (
    <View>
      <Pressable
        borderRadius="15"
        overflow="hidden"
        pb={ms(12)}
        width="100%"
        onPress={() => {
          setOpenModal(!isOpenModal)
          setTimeout(() => {
            passwordRef?.current?.blur()
            passwordRef?.current?.focus()
          }, 100)
        }}
      >
        <HStack
          alignItems="center"
          backgroundColor={Colors.white}
          borderColor={Colors.light}
          borderRadius="15"
          borderWidth="1"
          justifyContent={'space-between'}
          pl={ms(12)}
          pr={ms(24)}
          shadow="3"
        >
          <HStack alignItems={'center'}>
            <Image
              alt="key-skeleton"
              h={ms(17)}
              mr={ms(12)}
              my={ms(20)}
              resizeMode="contain"
              source={Icons.keySkeleton}
              w={ms(17)}
            />
            <Text fontWeight="500" w="70%">
              {t('changePassword')}
            </Text>
          </HStack>
        </HStack>
      </Pressable>

      <Modal
        backgroundColor="blue"
        initialFocusRef={passwordRef}
        isOpen={isOpenModal}
        width="full"
        onClose={() => {
          closeModal()
        }}
        // onLayout={() => {
        //   setTimeout(() => {
        //     passwordRef?.current?.blur()
        //     passwordRef?.current?.focus()
        //   }, 100)
        // }}
      >
        <Modal.Content width="full">
          <Modal.Header>
            <Text>{t('changePassword')}</Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={5}>
              <Requirements />
              <FormControl isRequired isInvalid={'password' in errors}>
                <FormControl.Label>{t('newPassword')}</FormControl.Label>
                <Input
                  ref={passwordRef}
                  backgroundColor={
                    'password' in errors ? Colors.navLogItemPink : null
                  }
                  returnKeyType="next"
                  type="password"
                  value={formData.password}
                  onChangeText={value => {
                    setFormdata({...formData, password: value})
                  }}
                  onSubmitEditing={() => {
                    cPasswordRef?.current?.focus()
                  }}
                />
                {'password' in errors && renderPasswordError()}
              </FormControl>
              <FormControl isRequired isInvalid={'confirmPassword' in errors}>
                <FormControl.Label>{t('reTypePassword')}</FormControl.Label>
                <Input
                  ref={cPasswordRef}
                  backgroundColor={
                    'password' in errors ? Colors.navLogItemPink : null
                  }
                  returnKeyType="go"
                  type="password"
                  value={formData.confirmPassword}
                  onChangeText={value => {
                    setFormdata({...formData, confirmPassword: value})
                  }}
                  onSubmitEditing={() => {
                    Keyboard.dismiss()
                  }}
                />
                {'confirmPassword' in errors && (
                  <FormControl.ErrorMessage>
                    <IconFA5 name="exclamation-circle" />{' '}
                    {errors?.confirmPassword}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <HStack
                alignItems="center"
                flex={1}
                // justifyContent="space-between"
                space={ms(13)}
              >
                <Button
                  backgroundColor={Colors.grey}
                  disabled={isResetPasswordLoading}
                  width="48%"
                  onPress={() => closeModal()}
                >
                  <Text color={Colors.disabled} fontWeight={'bold'}>
                    {t('cancel')}
                  </Text>
                </Button>
                <Button
                  backgroundColor={Colors.primary}
                  disabled={isResetPasswordLoading}
                  width="48%"
                  onPress={() => onSubmit()}
                >
                  {isResetPasswordLoading ? (
                    <Spinner color={Colors.white} />
                  ) : (
                    <Text color={Colors.white} fontWeight={'bold'}>
                      {t('save')}
                    </Text>
                  )}
                </Button>
              </HStack>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </View>
  )
}

export default ResetPasswordModal
