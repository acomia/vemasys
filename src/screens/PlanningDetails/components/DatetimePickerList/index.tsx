import React from 'react'
import {HStack, Text, Pressable, VStack} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ArrowDownIcon from 'react-native-vector-icons/MaterialIcons'
import {ms} from 'react-native-size-matters'

import {IconButton} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import moment from 'moment'

const DatetimePickerList = ({
  title,
  date,
  locked,
  onChangeDate,
  onClearDate,
  readOnly = false,
}: any) => {
  return (
    <VStack mb={ms(10)}>
      <Text fontWeight="medium" color={Colors.disabled}>
        {title}
      </Text>
      <HStack
        flex="1"
        p="2"
        my={ms(5)}
        bg={readOnly ? Colors.white : '#F7F7F7'}
        borderRadius={ms(5)}
        alignItems="center"
      >
        <Pressable
          flex="1"
          _pressed={{
            opacity: locked ? 0 : 0.7,
          }}
          onPress={onChangeDate}
          disabled={locked || readOnly}
        >
          <HStack space="2" alignItems="center">
            <Icon
              name="calendar-month-outline"
              size={ms(22)}
              color={locked || readOnly ? Colors.azure : Colors.disabled}
            />
            <Text
              fontSize="md"
              fontWeight="medium"
              color={date ? Colors.text : Colors.disabled}
            >
              {date
                ? moment(date).format('D MMM YYYY | hh:mm A')
                : 'No Date & Time Set'}
            </Text>
          </HStack>
        </Pressable>
        {date ? (
          <IconButton
            source={Icons.close}
            onPress={onClearDate}
            size={ms(22)}
          />
        ) : (
          !readOnly && (
            <ArrowDownIcon
              name="keyboard-arrow-down"
              size={ms(22)}
              color={Colors.azure}
            />
          )
        )}
      </HStack>
    </VStack>
  )
}

export default DatetimePickerList
