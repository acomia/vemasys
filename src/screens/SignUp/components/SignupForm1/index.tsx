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
import {useUser} from '@bluecentury/stores'
import {NoInternetConnectionMessage} from '@bluecentury/components'
import {Credentials, UserRegistration} from '@bluecentury/models'

const allFieldsRequired = _t('allFieldsRequired')
const userUsername = _t('usernameRequired')
const userEmail = _t('newUserEmail')
const userEmailNotValid = _t('emailIsInvalid')
const mmsiRequired = _t('mmsiIsRequired')
const mmsiNotExist = _t('mmsiNotExist')
const userPassword = _t('passwordRequired')
const userConfirmPassword = _t('confirmPasswordRequired')

// interface Props {
//   next: () => void
// }

interface IForm1State extends UserRegistration {
  mmsi: string
  euid: string
  confirmPassword?: string
}

type Props = {
  loginCreds: (creds: Credentials) => void
}

export default function SignUpForm1({loginCreds}: Props) {
  const {t} = useTranslation()
  const {isLoadingRegistration, registerNewUser, getEntityData} = useUser()

  const [values, setValues] = useState<IForm1State>({
    username: '',
    email: '',
    mmsi: '',
    euid: '',
    plainPassword: '',
    confirmPassword: '',
  })
  const [isAllFieldEmpty, setIsAllFieldEmpty] = useState(false)
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false)
  const [isEmailEmpty, setIsEmailEmpty] = useState(false)
  const [isEmailNotValid, setIsEmailNotValid] = useState(false)
  const [isMMSIEmpty, setIsMMSIEmpty] = useState(false)
  const [isMMSIExist, setIsMMSIExist] = useState(false)
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)
  const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false)
  const [isPasswordMatch, setIsPasswordMatch] = useState(true)

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const onNextSubmit = () => {
    if (
      values.username === '' &&
      values.email === '' &&
      values.mmsi === '' &&
      values.plainPassword === '' &&
      values.confirmPassword === ''
    ) {
      setIsAllFieldEmpty(true)
      return
    }
    if (
      values.username === '' ||
      values.email === '' ||
      values.mmsi === '' ||
      values.plainPassword === '' ||
      values.confirmPassword === ''
    ) {
      values.username === ''
        ? setIsUsernameEmpty(true)
        : setIsUsernameEmpty(false)
      values.email === '' ? setIsEmailEmpty(true) : setIsEmailEmpty(false)
      values.mmsi === '' ? setIsMMSIEmpty(true) : setIsMMSIEmpty(false)
      values.plainPassword === ''
        ? setIsPasswordEmpty(true)
        : setIsPasswordEmpty(false)
      values.confirmPassword === ''
        ? setIsConfirmPasswordEmpty(true)
        : setIsConfirmPasswordEmpty(false)
      return
    }
    if (values.plainPassword !== values.confirmPassword) {
      setIsPasswordMatch(false)
      return
    }
    if (!isValidEmail(values.email)) {
      setIsEmailNotValid(true)
      return
    }
    loginCreds({username: values.username, password: values.plainPassword})
    getEntityData(Number(values.mmsi))
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
            autoCapitalize="none"
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

        <FormControl
          isRequired
          isInvalid={isEmailEmpty || isEmailNotValid}
          mt={ms(10)}
        >
          <FormControl.Label color={Colors.disabled}>
            {t('email')}
          </FormControl.Label>
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.email}
            onChangeText={e => {
              setValues({...values, email: e})
              setIsAllFieldEmpty(false)
              setIsEmailNotValid(false)
              setIsEmailEmpty(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {isEmailNotValid ? userEmailNotValid : userEmail}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={isMMSIEmpty || isMMSIExist}
          mt={ms(10)}
        >
          <FormControl.Label color={Colors.disabled}>
            MMSI number
          </FormControl.Label>
          <Input
            autoCapitalize="words"
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.mmsi}
            onChangeText={e => {
              setValues({...values, mmsi: e})
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {isMMSIExist ? mmsiNotExist : mmsiRequired}{' '}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={false} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>EUID</FormControl.Label>
          <Input
            autoCapitalize="words"
            placeholder=" "
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.euid}
            onChangeText={e => {
              setValues({...values, euid: e})
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            EUID
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
            value={values.plainPassword}
            onChangeText={e => {
              setValues({...values, plainPassword: e})
              setIsAllFieldEmpty(false)
              setIsPasswordMatch(true)
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
            value={values.confirmPassword}
            onChangeText={e => {
              setValues({...values, confirmPassword: e})
              setIsAllFieldEmpty(false)
              setIsPasswordMatch(true)
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
        {!isPasswordMatch ? (
          <Text color="red.500" fontSize={ms(12)} my={ms(10)}>
            Password is not match.
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
          isLoading={isLoadingRegistration}
          isLoadingText="Creating new user"
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
