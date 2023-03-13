import React, {useEffect, useState} from 'react'
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

const allFieldsRequired = _t('allFieldsRequired')
const userFirstname = _t('newUserFirstname')
const userLastname = _t('newUserLastname')
const userEmailNotValid = _t('emailIsInvalid')
const userEmail = _t('newUserEmail')

interface Props {
  userInfo: ExtendedUser
  userCreds: Credentials
}

export default function SignUpForm2({userInfo, userCreds}: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const {t} = useTranslation()
  const {
    isLoadingSignupRequest,
    levelNavigationCertificate,
    getEntityData,
    entityData,
  } = useUser()

  const [values, setValues] = useState({
    id: userInfo.id,
    firstname: userInfo?.firstname,
    lastname: userInfo?.lastname,
    email: userInfo?.email,
    birthday: userInfo?.birthday,
    startdate: '',
    language: userInfo?.language,
    mmsi: '',
    euid: '',
    certificateLevel: '',
    username: userCreds.username,
  })
  const [isAllFieldEmpty, setIsAllFieldEmpty] = useState(false)
  const [isFirstnameEmpty, setIsFirstnameEmpty] = useState(false)
  const [isLastnameEmpty, setIsLastnameEmpty] = useState(false)
  const [isEmailNotValid, setIsEmailNotValid] = useState(false)
  const [isEmailEmpty, setIsEmailEmpty] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)

  useEffect(() => {
    if (entityData.length > 0) {
      navigation.navigate('SignUpVerification', {
        signUpInfo: values,
      })
    }
  }, [entityData])

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
    getEntityData(Number(values.mmsi))
    if (
      values.firstname === '' &&
      values.lastname === '' &&
      values.email === ''
    ) {
      setIsAllFieldEmpty(true)
      return
    }
    if (
      values.firstname === '' ||
      values.lastname === '' ||
      values.email === ''
    ) {
      values.firstname === ''
        ? setIsFirstnameEmpty(true)
        : setIsFirstnameEmpty(false)
      values.lastname === ''
        ? setIsLastnameEmpty(true)
        : setIsLastnameEmpty(false)
      // values.phone === '' ? setIsPhoneEmpty(true) : setIsPhoneEmpty(false)
      values.email === '' ? setIsEmailEmpty(true) : setIsEmailEmpty(false)
      return
    }
    if (!isValidEmail(values.email)) {
      setIsEmailNotValid(true)
      return
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
            autoCapitalize="words"
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.firstname}
            onChangeText={e => {
              setValues({...values, firstname: e})
            }}
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
            autoCapitalize="words"
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.lastname}
            onChangeText={e => {
              setValues({...values, lastname: e})
            }}
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
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder=""
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
          <FormControl flex="1" isInvalid={false} mt={ms(10)}>
            <FormControl.Label color={Colors.disabled}>
              Birth date
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
              Birth date
            </FormControl.ErrorMessage>
          </FormControl>
          <Box w={3} />
          <FormControl flex="1" isInvalid={false} mt={ms(10)}>
            <FormControl.Label color={Colors.disabled}>
              Start date
            </FormControl.Label>
            <DatetimePicker
              color={Colors.azure}
              date={values.startdate}
              onChangeDate={() => {
                setSelectedDate('startdate')
                setOpenDatePicker(true)
              }}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Start date
            </FormControl.ErrorMessage>
          </FormControl>
        </HStack>
        <FormControl isInvalid={false} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            Language
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
            Please select a language
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

        <FormControl isInvalid={false} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            Certificate level
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
            Please select a certificate level
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
          bg={Colors.primary}
          isLoading={isLoadingSignupRequest}
          isLoadingText="Processing"
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
