import React from 'react'
import {HStack, Text, Pressable, VStack, Skeleton} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ArrowDownIcon from 'react-native-vector-icons/MaterialIcons'
import {ms} from 'react-native-size-matters'
import moment from 'moment'
import _ from 'lodash'

import {IconButton} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {usePlanning} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'

const DatetimePickerList = ({
  title,
  date,
  locked,
  onChangeDate,
  onClearDate,
  readOnly = false,
}: any) => {
  const {t} = useTranslation()
  const {isPlanningDetailsLoading} = usePlanning()
  const icon = () => {
    return date ? (
      <IconButton size={ms(22)} source={Icons.close} onPress={onClearDate} />
    ) : (
      !readOnly && (
        <ArrowDownIcon
          color={Colors.azure}
          name="keyboard-arrow-down"
          size={ms(22)}
        />
      )
    )
  }
  return (
    <VStack mb={ms(10)}>
      <Text color={Colors.disabled} fontWeight="medium">
        {title}
      </Text>
      <HStack
        alignItems="center"
        bg={readOnly ? Colors.white : '#F7F7F7'}
        borderRadius={ms(5)}
        flex="1"
        my={ms(5)}
        p="2"
      >
        <Pressable
          _pressed={{
            opacity: locked ? 0 : 0.7,
          }}
          disabled={locked || readOnly}
          flex="1"
          onPress={onChangeDate}
        >
          <HStack alignItems="center" space="2">
            <Icon
              color={locked || readOnly ? Colors.azure : Colors.disabled}
              name="calendar-month-outline"
              size={ms(22)}
            />
            <Skeleton
              h="25"
              isLoaded={!isPlanningDetailsLoading}
              ml={ms(10)}
              rounded="md"
              startColor={Colors.grey}
            >
              <Text
                color={date && !locked ? Colors.text : Colors.disabled}
                fontSize="md"
                fontWeight="medium"
              >
                {date
                  ? moment(date).format('D MMM YYYY | HH:mm')
                  : t('noDate&TimeSet')}
              </Text>
            </Skeleton>
          </HStack>
        </Pressable>
        {!locked ? icon() : null}
      </HStack>
    </VStack>
  )
}

export default DatetimePickerList
