import React, {useEffect, useState} from 'react'
import {TouchableOpacity} from 'react-native'
import {
  Box,
  ScrollView,
  Text,
  Select,
  Input,
  FormControl,
  Button,
  WarningOutlineIcon,
  TextArea,
  HStack,
  useToast,
} from 'native-base'
import {useNavigation} from '@react-navigation/native'
import {Shadow} from 'react-native-shadow-2'
import DatePicker from 'react-native-date-picker'
import {ms} from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import {Colors} from '@bluecentury/styles'
import {useTechnical} from '@bluecentury/stores'
import {
  LoadingAnimated,
  NoInternetConnectionMessage,
  OTPInput,
} from '@bluecentury/components'
import {useTranslation} from 'react-i18next'
import {fuelTypes} from '@bluecentury/constants'

export default function NewBunkering() {
  const {t} = useTranslation()
  const navigation = useNavigation()
  const {
    isTechnicalLoading,
    bunkeringSuppliers,
    getVesselBunkeringSuppliers,
    createVesselBunkering,
  } = useTechnical()

  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [bunkering, setBunkering] = useState({
    date: new Date(),
    bunkeringId: '',
    amount: '0',
    description: '',
    fuelType: '',
  })
  const [isSupplierEmpty, setIsSupplierEmpty] = useState(false)
  const [isAmountEmpty, setIsAmountEmpty] = useState(false)
  const toast = useToast()

  useEffect(() => {
    getVesselBunkeringSuppliers()
  }, [])

  const suppliers =
    bunkeringSuppliers?.length > 0
      ? bunkeringSuppliers.map(supplier => {
          return {label: supplier.alias, value: supplier.id.toString()}
        })
      : []

  const handleOnCreateBunkering = async () => {
    if (bunkering.bunkeringId === '' && bunkering.amount === '') {
      setIsSupplierEmpty(true)
      setIsAmountEmpty(true)
      return
    }
    if (bunkering.bunkeringId === '') {
      setIsSupplierEmpty(true)
      if (bunkering.amount === '') {
        return setIsAmountEmpty(true)
      }
      if (bunkering.amount === '0') {
        return setIsAmountEmpty(true)
      }
    }
    if (bunkering.amount === '') {
      return setIsAmountEmpty(true)
    }
    if (bunkering.amount === '0') {
      return setIsAmountEmpty(true)
    }

    const res = await createVesselBunkering(bunkering)
    if (res.length > 0) {
      toast.show({
        duration: 2000,
        render: () => {
          return (
            <Box bg="emerald.500" mb={5} px="2" py="1" rounded="sm">
              Bunkering added.
            </Box>
          )
        },
        onCloseComplete() {
          navigation.goBack()
        },
      })
    } else {
      toast.show({
        duration: 2000,
        render: () => {
          return (
            <Box bg="red.500" mb={5} px="2" py="1" rounded="sm">
              Bunkering failed.
            </Box>
          )
        },
      })
    }
  }

  if (isTechnicalLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      <ScrollView
        bg={Colors.white}
        contentContainerStyle={{flexGrow: 1}}
        px={ms(12)}
        py={ms(20)}
      >
        <Text color={Colors.disabled} fontWeight="medium" mb={ms(5)}>
          {t('date')}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
            borderRadius: 5,
            backgroundColor: '#F7F7F7',
            paddingHorizontal: 12,
            marginBottom: 25,
          }}
          activeOpacity={0.7}
          onPress={() => setOpenDatePicker(true)}
        >
          <HStack alignItems="center" flex="1">
            <Ionicons color={Colors.text} name="calendar-outline" size={20} />
            <Text fontSize={15} fontWeight="medium" ml={ms(12)}>
              {moment(bunkering.date.toLocaleDateString()).format(
                'DD MMM YYYY'
              )}
            </Text>
          </HStack>

          <Ionicons color={Colors.text} name="chevron-down" size={22} />
        </TouchableOpacity>

        <FormControl isRequired isInvalid={isSupplierEmpty}>
          <FormControl.Label color={Colors.disabled}>
            {t('supplier')}
          </FormControl.Label>
          <Select
            accessibilityLabel=""
            bg={'#F7F7F7'}
            fontSize={ms(15)}
            fontWeight="medium"
            height={ms(40)}
            minWidth="300"
            placeholder=""
            onValueChange={val => {
              setBunkering({...bunkering, bunkeringId: val})
              setIsSupplierEmpty(false)
            }}
          >
            {suppliers.map((supplier, index) => (
              <Select.Item
                key={index}
                label={supplier.label}
                value={supplier.value}
              />
            ))}
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('newBunkeringSupplierRequired')}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={isSupplierEmpty}>
          <FormControl.Label color={Colors.disabled}>
            {t('fueltype')}
          </FormControl.Label>
          <Select
            accessibilityLabel=""
            bg={'#F7F7F7'}
            fontSize={ms(15)}
            fontWeight="medium"
            height={ms(40)}
            minWidth="300"
            placeholder=""
            onValueChange={val => {
              setBunkering({...bunkering, fuelType: val})
              setIsSupplierEmpty(false)
            }}
          >
            {fuelTypes?.map((fuelType, index) => (
              <Select.Item
                key={fuelType + ' ' + index}
                label={fuelType?.label}
                value={fuelType?.value}
              />
            ))}
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('newBunkeringSupplierRequired')}
          </FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={isAmountEmpty} mt={ms(25)}>
          <FormControl.Label color={Colors.disabled}>
            {t('amount')}
          </FormControl.Label>
          <OTPInput
            getValue={val => {
              if (val) {
                setBunkering({...bunkering, amount: val})
                setIsAmountEmpty(false)
              }
            }}
            decimalLength={3}
            errorMessage={'Too match'}
            initialValue={bunkering.amount}
            numberLength={4}
          />
          {/* <Input
            bold
            bg={'#F7F7F7'}
            fontSize={ms(15)}
            height={ms(40)}
            keyboardType="number-pad"
            returnKeyType="next"
            value={bunkering.amount}
            onChangeText={e => {
              setBunkering({...bunkering, amount: e})
              setIsAmountEmpty(false)
            }}
          /> */}
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {bunkering.bunkeringId === '' && bunkering.amount === ''
              ? t('allFieldsRequired')
              : bunkering.amount === '0'
              ? t('newBunkeringGreaterAmount')
              : t('newBunkeringAmountRequired')}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={false} mt={ms(25)}>
          <FormControl.Label color={Colors.disabled}>
            {t('description')}
          </FormControl.Label>
          <TextArea
            autoCompleteType={undefined}
            h="200"
            numberOfLines={6}
            placeholder=""
            style={{backgroundColor: '#F7F7F7'}}
            onChangeText={e => setBunkering({...bunkering, description: e})}
          />
          <FormControl.ErrorMessage
            leftIcon={<WarningOutlineIcon size="xs" />}
          />
        </FormControl>
        <DatePicker
          modal
          date={bunkering.date}
          mode="date"
          open={openDatePicker}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
          onConfirm={date => {
            setOpenDatePicker(false)
            setBunkering({...bunkering, date: date})
          }}
        />
      </ScrollView>
      <Box bg={Colors.white} position="relative">
        <Shadow
          viewStyle={{
            width: '100%',
          }}
          distance={25}
        >
          <HStack>
            <Button
              colorScheme="muted"
              flex="1"
              m={ms(16)}
              variant="ghost"
              onPress={() => navigation.goBack()}
            >
              {t('cancel')}
            </Button>
            <Button
              bg={Colors.primary}
              flex="1"
              m={ms(16)}
              onPress={handleOnCreateBunkering}
            >
              {t('save')}
            </Button>
          </HStack>
        </Shadow>
      </Box>
    </Box>
  )
}
