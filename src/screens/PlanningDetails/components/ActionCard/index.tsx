import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Box, HStack, Image, Text} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import {ms} from 'react-native-size-matters'
import {useTranslation} from 'react-i18next'

import {Colors} from '@bluecentury/styles'
import {titleCase} from '@bluecentury/constants'
import {Animated, Icons} from '@bluecentury/assets'

interface IActionCard {
  action: {
    type: string
    start: Date
    end: Date
  }
  onActionPress: () => void
  onActionStopPress: () => void
}
const ActionCard = ({
  action,
  onActionPress,
  onActionStopPress,
}: IActionCard) => {
  const {t} = useTranslation()

  const renderAnimatedIcon = (type: string, end: Date) => {
    switch (type.toLowerCase()) {
      case 'unloading':
        return _.isNull(end) ? Animated.nav_unloading : Icons.unloading
      case 'loading':
        return _.isNull(end) ? Animated.nav_loading : Icons.loading
      case 'cleaning':
        return _.isNull(end) ? Animated.cleaning : Icons.broom
      default:
        break
    }
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onActionPress}>
      <HStack
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={5}
        px={ms(12)}
        py={ms(8)}
        mt={ms(10)}
        bg={Colors.white}
        shadow={1}
        alignItems="center"
      >
        <Image
          alt="navlog-action-animated"
          source={renderAnimatedIcon(action.type, action.end)}
          width={action.type === 'Cleaning' ? ms(30) : ms(40)}
          height={action.type === 'Cleaning' ? ms(30) : ms(40)}
          resizeMode="contain"
          mr={ms(10)}
        />
        <Box flex="1">
          <HStack alignItems="center">
            <Text bold fontSize={ms(15)} color={Colors.text}>
              {titleCase(action.type)}
            </Text>
          </HStack>
          <Text color={Colors.secondary} fontWeight="medium">
            {t('start')}
            {moment(action.start).format('D MMM YYYY | HH:mm')}
          </Text>
          {_.isNull(action.end) ? null : (
            <Text color={Colors.danger} fontWeight="medium">
              {t('end')}
              {moment(action.end).format('D MMM YYYY | HH:mm')}
            </Text>
          )}
        </Box>
        <TouchableOpacity
          disabled={_.isNull(action.end) ? false : true}
          activeOpacity={0.7}
          onPress={onActionStopPress}
        >
          <Image
            alt="navlog-action-icon"
            source={_.isNull(action.end) ? Icons.stop : null}
            width={ms(30)}
            height={ms(30)}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </HStack>
    </TouchableOpacity>
  )
}

export default ActionCard
