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
import {LoadingAnimated} from '@bluecentury/components'
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
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            color={Colors.white}
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
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 40}}
        scrollEventThrottle={16}
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Input
          w={{
            base: '100%',
          }}
          mb={ms(20)}
          backgroundColor="#F7F7F7"
          InputLeftElement={
            <Icon
              as={<MaterialCommunityIcons name="magnify" />}
              size={5}
              ml="2"
              color={Colors.disabled}
            />
          }
          placeholderTextColor={Colors.disabled}
          fontWeight="medium"
          placeholder="Search users..."
          variant="filled"
          size="sm"
          onChangeText={e => onSearchCrewMember(e)}
        />

        {searchedText !== '' ? (
          <Box
            position="absolute"
            top="8%"
            left={0}
            right={0}
            bg={Colors.white}
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

        <Text fontSize={ms(16)} bold color={Colors.text}>
          {t('userInfo')}
        </Text>
        <Divider mt={ms(5)} mb={ms(10)} />
        <FormControl isInvalid={isFirstnameEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>
            {t('firstName')}
          </FormControl.Label>
          <Input
            placeholder=" "
            autoCapitalize="words"
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
            placeholder=" "
            autoCapitalize="words"
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
            mt={ms(3)}
            bg="#F7F7F7"
            borderRadius={ms(5)}
            p="2"
            alignItems="center"
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flex: 1,
                marginLeft: 10,
              }}
              onPress={() => setOpenDatePicker(true)}
            >
              <Text
                fontSize={ms(16)}
                fontWeight="medium"
                color={values.birthdate ? Colors.text : Colors.disabled}
              >
                {values.birthdate
                  ? moment(new Date(values.birthdate)).format('DD MMM YYYY')
                  : ' '}
              </Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={ms(22)}
              color={Colors.primary}
            />
          </HStack>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {userBday}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={isEmailEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>Email</FormControl.Label>
          <Input
            placeholder=" "
            keyboardType="email-address"
            autoCapitalize="none"
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
            placeholder=" "
            keyboardType="phone-pad"
            returnKeyType="next"
            style={{backgroundColor: '#F7F7F7'}}
            value={values.phone}
            onChangeText={e => setValues({...values, phone: e})}
          />
        </FormControl>
        <FormControl isInvalid={isRoleEmpty} mt={ms(10)}>
          <FormControl.Label color={Colors.disabled}>Roles</FormControl.Label>
          <Select
            minWidth="300"
            accessibilityLabel=""
            placeholder=""
            bg="#F7F7F7"
            mt={ms(3)}
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
          <Text fontSize={ms(12)} color="red.500" my={ms(10)}>
            * {allFieldsRequired}
          </Text>
        ) : null}
        <Button
          size="md"
          mt={ms(20)}
          bg={Colors.primary}
          onPress={onCreateNewUser}
        >
          {t('addUser')}
        </Button>
      </ScrollView>
      <DatePicker
        modal
        open={openDatePicker}
        date={new Date()}
        mode="date"
        onConfirm={date => {
          setOpenDatePicker(false), onDatesChange(date)
        }}
        onCancel={() => {
          setOpenDatePicker(false)
        }}
      />
    </Box>
  )
}

export default AddCrewMember
