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
import {LoadingAnimated} from '@bluecentury/components'
import {_t} from '@bluecentury/constants'

const allFieldsRequired = _t('allFieldsRequired')
const newBunkeringSupplierRequired = _t('newBunkeringSupplierRequired')
const newBunkeringAmountRequired = _t('newBunkeringAmountRequired')
const newBunkeringGreaterAmount = _t('newBunkeringGreaterAmount')

export default function NewBunkering() {
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
    amount: '',
    description: '',
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
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
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
            <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
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
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text mb={ms(5)} color={Colors.disabled} fontWeight="medium">
          Date
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
            borderRadius: 5,
            backgroundColor: '#F7F7F7',
            paddingHorizontal: 12,
            marginBottom: 25,
          }}
          onPress={() => setOpenDatePicker(true)}
        >
          <HStack flex="1" alignItems="center">
            <Ionicons name="calendar-outline" size={20} color={Colors.text} />
            <Text ml={ms(12)} fontSize={15} fontWeight="medium">
              {moment(bunkering.date.toLocaleDateString()).format(
                'DD MMM YYYY'
              )}
            </Text>
          </HStack>

          <Ionicons name="chevron-down" size={22} color={Colors.text} />
        </TouchableOpacity>

        <FormControl isRequired isInvalid={isSupplierEmpty}>
          <FormControl.Label color={Colors.disabled}>
            Supplier
          </FormControl.Label>
          <Select
            minWidth="300"
            height={ms(40)}
            fontSize={ms(15)}
            fontWeight="medium"
            accessibilityLabel=""
            placeholder=""
            bg={'#F7F7F7'}
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
            {newBunkeringSupplierRequired}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={isAmountEmpty} mt={ms(25)}>
          <FormControl.Label color={Colors.disabled}>Amount</FormControl.Label>
          <Input
            bg={'#F7F7F7'}
            keyboardType="number-pad"
            height={ms(40)}
            fontSize={ms(15)}
            bold
            value={bunkering.amount}
            onChangeText={e => {
              setBunkering({...bunkering, amount: e})
              setIsAmountEmpty(false)
            }}
            returnKeyType="next"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {bunkering.bunkeringId === '' && bunkering.amount === ''
              ? allFieldsRequired
              : bunkering.amount === '0'
              ? newBunkeringGreaterAmount
              : newBunkeringAmountRequired}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={false} mt={ms(25)}>
          <FormControl.Label color={Colors.disabled}>
            Description
          </FormControl.Label>
          <TextArea
            numberOfLines={6}
            h="200"
            placeholder=""
            style={{backgroundColor: '#F7F7F7'}}
            onChangeText={e => setBunkering({...bunkering, description: e})}
            autoCompleteType={undefined}
          />
          <FormControl.ErrorMessage
            leftIcon={<WarningOutlineIcon size="xs" />}
          ></FormControl.ErrorMessage>
        </FormControl>
        <DatePicker
          modal
          open={openDatePicker}
          date={bunkering.date}
          mode="date"
          onConfirm={date => {
            setOpenDatePicker(false)
            setBunkering({...bunkering, date: date})
          }}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
        />
      </ScrollView>
      <Box bg={Colors.white} position="relative">
        <Shadow
          distance={25}
          viewStyle={{
            width: '100%',
          }}
        >
          <HStack>
            <Button
              flex="1"
              m={ms(16)}
              variant="ghost"
              colorScheme="muted"
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
            <Button
              flex="1"
              m={ms(16)}
              bg={Colors.primary}
              onPress={handleOnCreateBunkering}
            >
              Save
            </Button>
          </HStack>
        </Shadow>
      </Box>
    </Box>
  )
}
