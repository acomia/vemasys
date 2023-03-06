import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Box, HStack, Image, Text, View} from 'native-base'
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
        alignItems="center"
        bg={Colors.white}
        borderColor={Colors.light}
        borderRadius={5}
        borderWidth={1}
        mt={ms(10)}
        px={ms(12)}
        py={ms(8)}
        shadow={1}
      >
        <View height={ms(50)} mr={ms(10)} width={ms(50)}>
          <Image
            width={
              action?.type === 'Cleaning' && !_.isNull(action.end)
                ? '80%'
                : '100%'
            }
            alt="navlog-action-animated"
            height={'100%'}
            mr={ms(10)}
            resizeMode="contain"
            source={renderAnimatedIcon(action.type, action.end)}
          />
        </View>
        <Box flex="1">
          <HStack alignItems="center">
            <Text bold color={Colors.text} fontSize={ms(15)}>
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
          activeOpacity={0.7}
          disabled={_.isNull(action.end) ? false : true}
          onPress={onActionStopPress}
        >
          <Image
            alt="navlog-action-icon"
            height={ms(30)}
            resizeMode="contain"
            source={_.isNull(action.end) ? Icons.stop : null}
            width={ms(30)}
          />
        </TouchableOpacity>
      </HStack>
    </TouchableOpacity>
  )
}

export default ActionCard
