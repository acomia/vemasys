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
} from 'native-base'
import {useTranslation} from 'react-i18next'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {Keyboard} from 'react-native'
import {Requirements} from './components'
import {useUser, useEntity} from '@bluecentury/stores'
import {showToast} from '@bluecentury/hooks'

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
    if (isResetPasswordSuccess) {
      setOpenModal(false)
      showToast(t('changePasswordSuccess'), 'success')
      setErrors({})
      setFormdata({
        password: '',
        confirmPassword: '',
      })
      unmountResetPassword()
    }
  }, [isResetPasswordSuccess])

  const onSubmit = () => {
    setErrors({})
    if (!validate()) return

    if (user?.id) {
      resetPassword(user?.id, {plainPassword: formData?.password})
    }
  }

  const validate = () => {
    setErrors({})
    if (formData.password === '' || formData.password === undefined) {
      setErrors({...errors, password: t('invalidPassword')})
      return false
    }

    if (!passwordRegex.exec(formData.password)) {
      setErrors({...errors, password: 'Password invalid format'})
      return
    }

    if (
      formData.confirmPassword === '' ||
      formData.confirmPassword === undefined
    ) {
      setErrors({...errors, confirmPassword: 'Confirm password is required'})
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({...errors, confirmPassword: t('confirmPasswordError')})
      return false
    }

    return true
  }

  return (
    <View>
      <Pressable
        borderRadius="15"
        overflow="hidden"
        pb={ms(12)}
        width="100%"
        onPress={() => setOpenModal(!isOpenModal)}
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
            <IconFA5
              style={{
                height: ms(17),
                marginRight: ms(12),
                marginVertical: ms(20),
                width: ms(17),
              }}
              color={Colors.primary}
              name="key"
              size={ms(17)}
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
          setOpenModal(false)
        }}
      >
        <Modal.Content width="full">
          <Modal.Header>
            <Text>{t('changePassword')}</Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={5}>
              <Requirements />

              <FormControl isRequired isInvalid={'password' in errors}>
                <Input
                  ref={passwordRef}
                  placeholder={t('password') || ''}
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
                {'password' in errors && (
                  <FormControl.ErrorMessage>
                    {errors?.password}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={'confirmPassword' in errors}>
                <Input
                  ref={cPasswordRef}
                  placeholder={t('confirmPassword') || ''}
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
                    {errors?.confirmPassword}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <Button
                disabled={isResetPasswordLoading}
                onPress={() => onSubmit()}
              >
                {isResetPasswordLoading ? (
                  <Spinner color={Colors.white} />
                ) : (
                  t('submit')
                )}
              </Button>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </View>
  )
}

export default ResetPasswordModal
