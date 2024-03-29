/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react'
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Select,
  Switch,
  Text,
  WarningOutlineIcon,
} from 'native-base'
import {useTranslation} from 'react-i18next'
import {ms} from 'react-native-size-matters'
import DatePicker from 'react-native-date-picker'
import {Shadow} from 'react-native-shadow-2'

import {Colors} from '@bluecentury/styles'
import {DatetimePicker} from '../../components'
import {Vemasys} from '@bluecentury/helpers'
import {_t} from '@bluecentury/constants'
import {useUser} from '@bluecentury/stores'
import {NoInternetConnectionMessage} from '@bluecentury/components'
import {Credentials, ExtendedUser} from '@bluecentury/models'
import {NavigationProp, useNavigation} from '@react-navigation/native'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {showToast} from '@bluecentury/hooks'

const allFieldsRequired = _t('allFieldsRequired')
const userFirstname = _t('newUserFirstname')
const userLastname = _t('newUserLastname')
const userEmailNotValid = _t('emailIsInvalid')
const userEmail = _t('newUserEmail')
const userBday = _t('birthdateIsRequired')
const language = _t('languageIsRequired')
const certificateLevel = _t('certificateLevelIsRequired')

interface Props {
  userInfo: ExtendedUser
  userCreds: Credentials
  mmsi: number
}

export default function SignUpForm2({userInfo, userCreds, mmsi}: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {t} = useTranslation()
  const {
    isLoadingSignupRequest,
    isLoadingRegistration,
    isLoadingUpdateUserInfo,
    levelNavigationCertificate,
    entityData,
    updateUserData,
    updateUserInfoStatus,
    requestAccessToEntity,
    requestAccessToEntityStatus,
    resetStatus,
  } = useUser()

  const [values, setValues] = useState({
    id: userInfo.id,
    firstname: '',
    lastname: '',
    email: userInfo.email,
    birthday: '',
    startdate: '',
    language: '',
    certificateLevel: '',
    username: userCreds.username,
    mmsi: mmsi,
  })
  const [isAllFieldEmpty, setIsAllFieldEmpty] = useState(false)
  const [isFirstnameEmpty, setIsFirstnameEmpty] = useState(false)
  const [isLastnameEmpty, setIsLastnameEmpty] = useState(false)
  const [isEmailNotValid, setIsEmailNotValid] = useState(false)
  const [isEmailEmpty, setIsEmailEmpty] = useState(false)
  const [isBdayEmpty, setIsBdayEmpty] = useState(false)
  const [isLanguageEmpty, setIsLanguageEmpty] = useState(false)
  const [isCertLevelEmpty, setIsCertLevelEmpty] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const fnameRef = useRef<any>(null)
  const lnameRef = useRef<any>(null)
  const emailRef = useRef<any>(null)

  useEffect(() => {
    if (updateUserInfoStatus === 'SUCCESS') {
      resetStatus()
      if (entityData.length && entityData[0].hasLinkedUser) {
        requestAccessToEntity(entityData[0].id.toString())
      }
    }
    if (requestAccessToEntityStatus === 'SUCCESS') {
      resetStatus()
      navigation.navigate('SignUpFinish', {
        email: values.email,
      })
    }
    if (updateUserInfoStatus === 'FAILED') {
      showToast('Unable to update user info.', 'failed')
      resetStatus()
    }
    if (requestAccessToEntityStatus === 'FAILED') {
      showToast('Unable to request access to entity.', 'failed')
      resetStatus()
    }
  }, [updateUserInfoStatus, requestAccessToEntityStatus])

  const onDatesChange = (date: Date) => {
    const formattedDate = Vemasys.formatDate(date)
    if (selectedDate === 'birthday') {
      setValues({...values, birthday: formattedDate})
    } else {
      setValues({...values, startdate: formattedDate})
    }
  }

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const onSignUpSubmit = () => {
    if (
      values.firstname === '' &&
      values.lastname === '' &&
      values.email === '' &&
      values.birthday === '' &&
      values.language === '' &&
      values.certificateLevel === ''
    ) {
      setIsAllFieldEmpty(true)
      return
    }
    if (
      values.firstname === '' ||
      values.lastname === '' ||
      values.email === '' ||
      values.birthday === '' ||
      values.language === '' ||
      values.certificateLevel === ''
    ) {
      values.firstname === ''
        ? setIsFirstnameEmpty(true)
        : setIsFirstnameEmpty(false)
      values.lastname === ''
        ? setIsLastnameEmpty(true)
        : setIsLastnameEmpty(false)
      values.email === '' ? setIsEmailEmpty(true) : setIsEmailEmpty(false)
      values.birthday === '' ? setIsBdayEmpty(true) : setIsBdayEmpty(false)
      values.language === ''
        ? setIsLanguageEmpty(true)
        : setIsLanguageEmpty(false)
      values.certificateLevel === ''
        ? setIsCertLevelEmpty(true)
        : setIsCertLevelEmpty(false)
      return
    }
    if (!isValidEmail(values.email)) {
      setIsEmailNotValid(true)
      return
    }
    if (entityData.length && entityData[0].hasLinkedUser) {
      updateUserData(values, [])
    } else {
      navigation.navigate('SignUpVerification', {
        signUpInfo: values,
      })
    }
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
        <FormControl isRequired isInvalid={isFirstnameEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('firstName')}
          </FormControl.Label>
          <Input
            ref={fnameRef}
            autoCapitalize="words"
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.firstname}
            onChangeText={e => {
              setValues({...values, firstname: e})
            }}
            onSubmitEditing={() => lnameRef.current.focus()}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userFirstname}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={isLastnameEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('lastName')}
          </FormControl.Label>
          <Input
            ref={lnameRef}
            autoCapitalize="words"
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.lastname}
            onChangeText={e => {
              setValues({...values, lastname: e})
            }}
            onSubmitEditing={() => emailRef.current.focus()}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userLastname}
          </FormControl.ErrorMessage>
        </FormControl>
        {/* <FormControl isRequired isInvalid={isPhoneEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('phone')}
          </FormControl.Label>
          <Input
            keyboardType="numeric"
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.phone}
            onChangeText={e => {
              setValues({...values, phone: e})
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userPhone}
          </FormControl.ErrorMessage>
        </FormControl> */}
        <FormControl
          isRequired
          isInvalid={isEmailEmpty || isEmailNotValid}
          mt={ms(10)}
        >
          <FormControl.Label color={Colors.disabled}>
            {t('email')}
          </FormControl.Label>
          <Input
            ref={emailRef}
            autoCapitalize="none"
            keyboardType="email-address"
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.email}
            onChangeText={e => {
              setValues({...values, email: e})
              setIsEmailEmpty(false)
              setIsEmailNotValid(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {isEmailNotValid ? userEmailNotValid : userEmail}
          </FormControl.ErrorMessage>
        </FormControl>
        <HStack>
          <FormControl isRequired flex="1" isInvalid={isBdayEmpty} mt={ms(10)}>
            <FormControl.Label color={Colors.disabled}>
              {t('birthdate')}
            </FormControl.Label>
            <DatetimePicker
              color={Colors.azure}
              date={values.birthday}
              onChangeDate={() => {
                setSelectedDate('birthday')
                setOpenDatePicker(true)
              }}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {userBday}
            </FormControl.ErrorMessage>
          </FormControl>
          <Box w={3} />
          <FormControl flex="1" isInvalid={false} mt={ms(10)}>
            <FormControl.Label color={Colors.disabled}>
              {t('startDate')}
            </FormControl.Label>
            <DatetimePicker
              color={Colors.azure}
              date={values.startdate}
              onChangeDate={() => {
                setSelectedDate('startdate')
                setOpenDatePicker(true)
              }}
            />
          </FormControl>
        </HStack>
        <FormControl isRequired isInvalid={isLanguageEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('language')}
          </FormControl.Label>
          <Select
            _selectedItem={{
              endIcon: <CheckIcon size={5} />,
            }}
            bg={Colors.light_grey}
            fontSize={14}
            fontWeight="medium"
            placeholder="Choose Language"
            selectedValue={values.language}
            onValueChange={e => setValues({...values, language: e})}
          >
            <Select.Item label="English" value="en" />
            <Select.Item label="French" value="fr" />
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {language}
          </FormControl.ErrorMessage>
        </FormControl>
        {/* <FormControl isInvalid={false} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>Role</FormControl.Label>
          <Select
            _selectedItem={{
              endIcon: <CheckIcon size={5} />,
            }}
            bg={Colors.light_grey}
            fontSize={14}
            fontWeight="medium"
            isDisabled={requestAsOwner}
            placeholder="Choose Role"
            selectedValue={values.roles}
            onValueChange={e => setValues({...values, roles: e})}
          >
            <Select.Item label="Admin" value="admin" />
            <Select.Item label="Captain" value="captain" />
            <Select.Item label="Skipper" value="skipper" />
            <Select.Item label="User" value="user" />
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please select a role
          </FormControl.ErrorMessage>
        </FormControl> */}

        <FormControl isRequired isInvalid={isCertLevelEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('certificateLevel')}
          </FormControl.Label>
          <Select
            _selectedItem={{
              endIcon: <CheckIcon size={5} />,
            }}
            bg={Colors.light_grey}
            fontSize={14}
            fontWeight="medium"
            placeholder="Choose Level"
            selectedValue={values.certificateLevel}
            onValueChange={e => setValues({...values, certificateLevel: e})}
          >
            {levelNavigationCertificate.map((navCert, index) => (
              <Select.Item
                key={`LevelNavCert-${index}`}
                label={navCert.title}
                value={navCert.id.toString()}
              />
            ))}
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {certificateLevel}
          </FormControl.ErrorMessage>
        </FormControl>

        <DatePicker
          modal
          date={new Date()}
          mode="date"
          open={openDatePicker}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
          onConfirm={date => {
            setOpenDatePicker(false)
            onDatesChange(date)
          }}
        />
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
          isLoading={
            isLoadingSignupRequest ||
            isLoadingRegistration ||
            isLoadingUpdateUserInfo
          }
          bg={Colors.primary}
          isLoadingText="Processing..."
          m={ms(16)}
          size="md"
          onPress={onSignUpSubmit}
        >
          {t('next')}
        </Button>
      </Shadow>
    </Box>
  )
}
