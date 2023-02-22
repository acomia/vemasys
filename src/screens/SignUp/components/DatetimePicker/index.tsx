/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import {HStack, Text} from 'native-base'
import {TouchableOpacity} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import {useTranslation} from 'react-i18next'

import {Colors} from '@bluecentury/styles'

interface IDatetimePicker {
  date: StringOrNull
  onChangeDate: () => void
  color: string
}

const DatetimePicker = ({date, onChangeDate, color}: IDatetimePicker) => {
  const {t} = useTranslation()
  return (
    <HStack
      alignItems="center"
      bg={Colors.light_grey}
      borderRadius={ms(5)}
      p="2"
    >
      <MaterialCommunityIcons
        color={color}
        name="calendar-month-outline"
        size={ms(22)}
      />
      <TouchableOpacity
        style={{
          flex: 1,
          marginLeft: 10,
        }}
        activeOpacity={0.7}
        onPress={onChangeDate}
      >
        <Text
          color={date ? Colors.text : Colors.disabled}
          fontSize={14}
          fontWeight="medium"
        >
          {date ? moment(date).format('D MMM YYYY') : t('noDateSet')}
        </Text>
      </TouchableOpacity>
      <MaterialIcons
        name="keyboard-arrow-down"
        size={ms(22)}
        onPress={onChangeDate}
      />
    </HStack>
  )
}

export default DatetimePicker
