/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react'
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
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {Colors} from '@bluecentury/styles'
import {DatetimePicker} from './components'
import {Vemasys} from '@bluecentury/helpers'
import {_t} from '@bluecentury/constants'
import {useEntity} from '@bluecentury/stores'
import {NoInternetConnectionMessage} from '@bluecentury/components'

const allFieldsRequired = _t('allFieldsRequired')
const userFirstname = _t('newUserFirstname')
const userLastname = _t('newUserLastname')
const userPhone = _t('newUserPhone')
const userEmail = _t('newUserEmail')

type Props = NativeStackScreenProps<RootStackParamList>
export default function SignUp({navigation}: Props) {
  const {t} = useTranslation()
  const {createSignUpRequest, isLoadingSignUpRequest} = useEntity()

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    // birthdate: '',
    // startdate: '',
    // language: '',
    // roles: '',
    mmsi: '',
    euid: '',
    // certificate_level: '',
    // password: '',
    // confirm_password: '',
  })
  const [isAllFieldEmpty, setIsAllFieldEmpty] = useState(false)
  const [isFirstnameEmpty, setIsFirstnameEmpty] = useState(false)
  const [isLastnameEmpty, setIsLastnameEmpty] = useState(false)
  const [isPhoneEmpty, setIsPhoneEmpty] = useState(false)
  const [isEmailEmpty, setIsEmailEmpty] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [requestAsOwner, setRequestAsOwner] = useState(false)

  const onDatesChange = (date: Date) => {
    const formattedDate = Vemasys.formatDate(date)
    if (selectedDate === 'birthdate') {
      setValues({...values, birthdate: formattedDate})
    } else {
      setValues({...values, startdate: formattedDate})
    }
  }

  const onSignUpSubmit = () => {
    if (
      values.firstName === '' &&
      values.lastName === '' &&
      values.phone === '' &&
      values.email === ''
    ) {
      setIsAllFieldEmpty(true)
      return
    }
    if (
      values.firstName === '' ||
      values.lastName === '' ||
      values.phone === '' ||
      values.email === ''
    ) {
      values.firstName === ''
        ? setIsFirstnameEmpty(true)
        : setIsFirstnameEmpty(false)
      values.lastName === ''
        ? setIsLastnameEmpty(true)
        : setIsLastnameEmpty(false)
      values.phone === '' ? setIsPhoneEmpty(true) : setIsPhoneEmpty(false)
      values.email === '' ? setIsEmailEmpty(true) : setIsEmailEmpty(false)
      return
    }
    if (requestAsOwner) createSignUpRequest(values, [])
    navigation.navigate('SignUpVerification', {
      signUpInfo: values,
      requestAsOwner,
    })
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
            placeholder=" "
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.firstName}
            onChangeText={e => {
              setValues({...values, firstName: e})
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
            placeholder=" "
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.lastName}
            onChangeText={e => {
              setValues({...values, lastName: e})
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userLastname}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={isPhoneEmpty} mt={ms(10)}>
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
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userEmail}
          </FormControl.ErrorMessage>
        </FormControl>
        {/* <HStack>
          <FormControl flex="1" isInvalid={false} mt={ms(10)}>
            <FormControl.Label color={Colors.disabled}>
              Birth date
            </FormControl.Label>
            <DatetimePicker
              color={Colors.azure}
              date={values.birthdate}
              onChangeDate={() => {
                setSelectedDate('birthdate')
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
        </HStack> */}
        {/* <FormControl isInvalid={false} mt={ms(10)}>
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
            <Select.Item label="English" value="english" />
            <Select.Item label="French" value="french" />
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please select a language
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={false} mt={ms(10)}>
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
        <HStack alignItems="center" my={ms(10)} space={2}>
          <Switch
            size="md"
            value={requestAsOwner}
            onValueChange={() => setRequestAsOwner(!requestAsOwner)}
          />
          <Text fontWeight="medium">Request as owner (no role)</Text>
        </HStack>
        {requestAsOwner ? (
          <>
            <FormControl isInvalid={false} mt={ms(10)}>
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
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                MMSI number
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={false} mt={ms(10)}>
              <FormControl.Label color={Colors.disabled}>
                EUID
              </FormControl.Label>
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
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                EUID
              </FormControl.ErrorMessage>
            </FormControl>
          </>
        ) : null}
        {/* <FormControl isInvalid={false} mt={ms(10)}>
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
            selectedValue={values.certificate_level}
            onValueChange={e => setValues({...values, certificate_level: e})}
          >
            <Select.Item label="Admin" value="admin" />
            <Select.Item label="Patent Captain" value="patent_captain" />
            <Select.Item label="Captain" value="captain" />
            <Select.Item label="Mate" value="mate" />
            <Select.Item label="Sailor" value="sailor" />
            <Select.Item label="Full Sailor" value="full_sailor" />
            <Select.Item label="Dexman" value="dexman" />
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please select a certificate level
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={false} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            Password
          </FormControl.Label>
          <Input
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            type="password"
            value={values.password}
            onChangeText={e => {
              setValues({...values, password: e})
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Password
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={false} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            Confirm Password
          </FormControl.Label>
          <Input
            placeholder=""
            size="lg"
            style={{backgroundColor: '#F7F7F7'}}
            type="password"
            value={values.confirm_password}
            onChangeText={e => {
              setValues({...values, confirm_password: e})
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Confirm Password
          </FormControl.ErrorMessage>
        </FormControl> */}

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
          isLoading={isLoadingSignUpRequest}
          isLoadingText="Creating request"
          m={ms(16)}
          size="md"
          onPress={onSignUpSubmit}
        >
          {t('signUp')}
        </Button>
      </Shadow>
    </Box>
  )
}
