/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react'
import {
  Box,
  Button,
  FormControl,
  Input,
  ScrollView,
  Text,
  WarningOutlineIcon,
} from 'native-base'
import {useTranslation} from 'react-i18next'
import {ms} from 'react-native-size-matters'
import {Shadow} from 'react-native-shadow-2'

import {Colors} from '@bluecentury/styles'
import {_t} from '@bluecentury/constants'
import {useEntity} from '@bluecentury/stores'
import {NoInternetConnectionMessage} from '@bluecentury/components'

const allFieldsRequired = _t('allFieldsRequired')
const userUsername = _t('usernameRequired')
const userEmail = _t('newUserEmail')
const userPassword = _t('passwordRequired')
const userConfirmPassword = _t('confirmPasswordRequired')

interface Props {
  next: () => void
}

export default function SignUpForm1({next}: Props) {
  const {t} = useTranslation()
  const {isLoadingSignUpRequest} = useEntity()

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [isAllFieldEmpty, setIsAllFieldEmpty] = useState(false)
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false)
  const [isEmailEmpty, setIsEmailEmpty] = useState(false)
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)
  const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false)

  const onNextSubmit = () => {
    if (
      values.username === '' &&
      values.email === '' &&
      values.password === '' &&
      values.confirm_password === ''
    ) {
      setIsAllFieldEmpty(true)
      return
    }
    if (
      values.username === '' ||
      values.email === '' ||
      values.password === '' ||
      values.confirm_password === ''
    ) {
      values.username === ''
        ? setIsUsernameEmpty(true)
        : setIsUsernameEmpty(false)
      values.email === '' ? setIsEmailEmpty(true) : setIsEmailEmpty(false)
      values.password === ''
        ? setIsPasswordEmpty(true)
        : setIsPasswordEmpty(false)
      values.confirm_password === ''
        ? setIsConfirmPasswordEmpty(true)
        : setIsConfirmPasswordEmpty(false)
      return
    }
    next()
  }

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: ms(14),
          backgroundColor: Colors.white,
          borderTopLeftRadius: ms(15),
          borderTopRightRadius: ms(15),
          paddingBottom: ms(20),
        }}
        showsVerticalScrollIndicator={false}
      >
        <FormControl isRequired isInvalid={isUsernameEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('username')}
          </FormControl.Label>
          <Input
            autoCapitalize="words"
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.username}
            onChangeText={e => {
              setValues({...values, username: e})
              setIsAllFieldEmpty(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userUsername}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={isEmailEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('email')}
          </FormControl.Label>
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder=" "
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.email}
            onChangeText={e => {
              setValues({...values, email: e})
              setIsAllFieldEmpty(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userEmail}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={isPasswordEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('password')}
          </FormControl.Label>
          <Input
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            type="password"
            value={values.password}
            onChangeText={e => {
              setValues({...values, password: e})
              setIsAllFieldEmpty(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userPassword}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={isConfirmPasswordEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('confirmPassword')}
          </FormControl.Label>
          <Input
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            type="password"
            value={values.confirm_password}
            onChangeText={e => {
              setValues({...values, confirm_password: e})
              setIsAllFieldEmpty(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userConfirmPassword}
          </FormControl.ErrorMessage>
        </FormControl>
        {isAllFieldEmpty ? (
          <Text color="red.500" fontSize={ms(12)} my={ms(10)}>
            * {allFieldsRequired}
          </Text>
        ) : null}
      </ScrollView>
      <Shadow viewStyle={{width: '100%'}}>
        <Button
          _text={{
            fontWeight: 'bold',
            fontSize: 16,
          }}
          bg={Colors.primary}
          isLoading={isLoadingSignUpRequest}
          isLoadingText="Creating request"
          m={ms(16)}
          size="md"
          onPress={onNextSubmit}
        >
          {t('next')}
        </Button>
      </Shadow>
    </Box>
  )
}
