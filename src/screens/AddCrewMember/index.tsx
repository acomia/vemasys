import React, {useEffect, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Input,
  ScrollView,
  Select,
  Text,
  useToast,
  WarningOutlineIcon,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import DatePicker from 'react-native-date-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {useCrew, useEntity} from '@bluecentury/stores'
import {titleCase, _t} from '@bluecentury/constants'
import {LoadingAnimated, NoInternetConnectionMessage} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'

const allFieldsRequired = _t('allFieldsRequired')
const userFirstname = _t('newUserFirstname')
const userLastname = _t('newUserLastname')
const userBday = _t('newUserBday')
const userEmail = _t('newUserEmail')
const userRole = _t('newUserRole')

type Props = NativeStackScreenProps<RootStackParamList>
const AddCrewMember = ({navigation}: Props) => {
  const {t} = useTranslation()
  const {isCrewLoading, crew, roles, getUserRoles, createNewUser, getCrew} =
    useCrew()
  const {entityId, vesselId} = useEntity()
  const [crewData, setCrewData] = useState(crew)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    birthdate: '',
    email: '',
    phone: '',
    roles: '',
  })
  const [isAllFieldEmpty, setIsAllFieldEmpty] = useState(false)
  const [isFirstnameEmpty, setIsFirstnameEmpty] = useState(false)
  const [isLastnameEmpty, setIsLastnameEmpty] = useState(false)
  const [isBdayEmpty, setIsBdayEmpty] = useState(false)
  const [isEmailEmpty, setIsEmailEmpty] = useState(false)
  const [isRoleEmpty, setIsRoleEmpty] = useState(false)
  const [searchedText, setSearchedText] = useState('')
  const toast = useToast()

  useEffect(() => {
    getUserRoles()
  }, [])

  const onDatesChange = (date: Date) => {
    setValues({...values, birthdate: date.toLocaleDateString()})
    setIsBdayEmpty(false)
  }

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 1000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            color={Colors.white}
            mb={5}
            px="2"
            py="1"
            rounded="sm"
          >
            {text}
          </Text>
        )
      },
      onCloseComplete() {
        res === 'success' ? navigation.goBack() : null
      },
    })
  }

  const onCreateNewUser = async () => {
    if (
      values.firstname === '' &&
      values.lastname === '' &&
      values.birthdate === '' &&
      values.email === '' &&
      values.roles === ''
    ) {
      setIsAllFieldEmpty(true)
      return
    }
    if (
      values.firstname === '' ||
      values.lastname === '' ||
      values.birthdate === '' ||
      values.email === '' ||
      values.roles === ''
    ) {
      values.firstname === ''
        ? setIsFirstnameEmpty(true)
        : setIsFirstnameEmpty(false)
      values.lastname === ''
        ? setIsLastnameEmpty(true)
        : setIsLastnameEmpty(false)
      values.birthdate === '' ? setIsBdayEmpty(true) : setIsBdayEmpty(false)
      values.email === '' ? setIsEmailEmpty(true) : setIsEmailEmpty(false)
      values.roles === '' ? setIsRoleEmpty(true) : setIsRoleEmpty(false)
      return
    }

    try {
      const res = await createNewUser(entityId, values)
      if (typeof res === 'object') {
        getCrew(vesselId)
        showToast('New crew member created.', 'success')
      } else {
        showToast('New crew member failed.', 'failed')
      }
    } catch (error) {
      showToast('New crew member failed.', 'failed')
    }
  }

  const onSearchCrewMember = (value: string) => {
    setSearchedText(value)
    const searched: any = crew?.filter((c: any) => {
      const containsKey = value
        ? `${c?.firstname?.toLowerCase()}`?.includes(value?.toLowerCase()) ||
          `${c?.lastname?.toLowerCase()}`?.includes(value?.toLowerCase())
        : true

      return containsKey
    })
    setCrewData(searched)
  }

  if (isCrewLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      <ScrollView
        bg={Colors.white}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 40}}
        px={ms(12)}
        py={ms(20)}
        scrollEventThrottle={16}
      >
        <Input
          InputLeftElement={
            <Icon
              as={<MaterialCommunityIcons name="magnify" />}
              color={Colors.disabled}
              ml="2"
              size={5}
            />
          }
          w={{
            base: '100%',
          }}
          backgroundColor={Colors.light_grey}
          fontWeight="medium"
          mb={ms(20)}
          placeholder="Search users..."
          placeholderTextColor={Colors.disabled}
          size="sm"
          variant="filled"
          onChangeText={e => onSearchCrewMember(e)}
        />

        {searchedText !== '' ? (
          <Box
            bg={Colors.white}
            left={0}
            position="absolute"
            right={0}
            top="8%"
            zIndex={999}
          >
            {' '}
            {crewData?.map((user: any, index) => (
              <TouchableOpacity
                key={`User-${index}`}
                style={{
                  backgroundColor: Colors.white,
                  paddingHorizontal: 10,
                }}
                // onPress={(): Promise<any> => selectCrewMember(user)}
              >
                <HStack alignItems="center">
                  <Text fontWeight="medium">
                    {titleCase(user.firstname)} {titleCase(user.lastname)}
                  </Text>
                </HStack>
                <Divider my={ms(10)} />
              </TouchableOpacity>
            ))}
          </Box>
        ) : null}

        <Text bold color={Colors.text} fontSize={ms(16)}>
          {t('userInfo')}
        </Text>
        <Divider mb={ms(10)} mt={ms(5)} />
        <FormControl isInvalid={isFirstnameEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('firstName')}
          </FormControl.Label>
          <Input
            autoCapitalize="words"
            placeholder=" "
            returnKeyType="next"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.firstname}
            onChangeText={e => {
              setValues({...values, firstname: e})
              setIsFirstnameEmpty(false)
              setIsAllFieldEmpty(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userFirstname}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={isLastnameEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('lastName')}
          </FormControl.Label>
          <Input
            autoCapitalize="words"
            placeholder=" "
            returnKeyType="next"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.lastname}
            onChangeText={e => {
              setValues({...values, lastname: e})
              setIsLastnameEmpty(false)
              setIsAllFieldEmpty(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userLastname}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={isBdayEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('birthdate')}
          </FormControl.Label>
          <HStack
            alignItems="center"
            bg={Colors.light_grey}
            borderRadius={ms(5)}
            mt={ms(3)}
            p="2"
          >
            <TouchableOpacity
              style={{
                flex: 1,
                marginLeft: 10,
              }}
              activeOpacity={0.7}
              onPress={() => setOpenDatePicker(true)}
            >
              <Text
                color={values.birthdate ? Colors.text : Colors.disabled}
                fontSize={ms(16)}
                fontWeight="medium"
              >
                {values.birthdate
                  ? moment(new Date(values.birthdate)).format('DD MMM YYYY')
                  : ' '}
              </Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              color={Colors.primary}
              name="calendar-month-outline"
              size={ms(22)}
            />
          </HStack>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userBday}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={isEmailEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>Email</FormControl.Label>
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder=" "
            returnKeyType="next"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.email}
            onChangeText={e => {
              setValues({...values, email: e})
              setIsEmailEmpty(false)
              setIsAllFieldEmpty(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userEmail}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>Phone</FormControl.Label>
          <Input
            keyboardType="phone-pad"
            placeholder=" "
            returnKeyType="next"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.phone}
            onChangeText={e => setValues({...values, phone: e})}
          />
        </FormControl>
        <FormControl isInvalid={isRoleEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>Roles</FormControl.Label>
          <Select
            accessibilityLabel=""
            bg={Colors.light_grey}
            minWidth="300"
            mt={ms(3)}
            placeholder=""
            selectedValue={values.roles}
            onValueChange={e => {
              setValues({...values, roles: e})
              setIsRoleEmpty(false)
              setIsAllFieldEmpty(false)
            }}
          >
            {roles?.map((option: any, index) => (
              <Select.Item
                key={index}
                label={option.label}
                value={option.value}
              />
            ))}
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userRole}
          </FormControl.ErrorMessage>
        </FormControl>
        {isAllFieldEmpty ? (
          <Text color="red.500" fontSize={ms(12)} my={ms(10)}>
            * {allFieldsRequired}
          </Text>
        ) : null}
        <Button
          bg={Colors.primary}
          mt={ms(20)}
          size="md"
          onPress={onCreateNewUser}
        >
          {t('addUser')}
        </Button>
      </ScrollView>
      <DatePicker
        modal
        date={new Date()}
        mode="date"
        open={openDatePicker}
        onCancel={() => {
          setOpenDatePicker(false)
        }}
        onConfirm={date => {
          setOpenDatePicker(false), onDatesChange(date)
        }}
      />
    </Box>
  )
}

export default AddCrewMember
