import React from 'react'
import {HStack, Text, Pressable} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
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
}: any) => {
  return (
    <HStack alignItems="center" mt={ms(15)}>
      <Text fontSize={ms(16)} fontWeight="medium">
        {title}
      </Text>
      <HStack
        flex="1"
        bg="#F7F7F7"
        borderRadius={ms(5)}
        p="2"
        alignItems="center"
        ml={ms(15)}
      >
        <Pressable
          flex="1"
          _pressed={{
            opacity: locked ? 0 : 0.7,
          }}
          onPress={onChangeDate}
          disabled={locked}
        >
          <HStack space="2">
            <Icon
              name="calendar-month-outline"
              size={ms(22)}
              color={Colors.highlighted_text}
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
        ) : null}
      </HStack>
    </HStack>
  )
}

export default DatetimePickerList
