import React from 'react'
import {TouchableOpacity} from 'react-native'
import {HStack, Text} from 'native-base'
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
  onClearDate
}: any) => {
  return (
    <HStack alignItems="center" mt={ms(15)}>
      <Text fontSize={ms(16)} fontWeight="medium">
        {title}
      </Text>
      <HStack
        flex={1}
        bg="#F7F7F7"
        borderRadius={ms(5)}
        p="2"
        alignItems="center"
        ml={ms(15)}
      >
        <Icon
          name="calendar-month-outline"
          size={ms(26)}
          color={Colors.highlighted_text}
        />
        <TouchableOpacity
          activeOpacity={locked ? 0 : 0.7}
          style={{
            flex: 1,
            marginLeft: 10
          }}
          onPress={onChangeDate}
          disabled={locked}
        >
          <Text fontSize={ms(16)} fontWeight="medium">
            {date ? moment(date).format('D MMM YYYY') : null}
          </Text>
        </TouchableOpacity>
        <IconButton source={Icons.close} onPress={onClearDate} size={ms(25)} />
      </HStack>
    </HStack>
  )
}

export default DatetimePickerList
