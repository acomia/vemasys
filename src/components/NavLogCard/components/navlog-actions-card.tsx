import React from 'react'
import {TouchableOpacity} from 'react-native'
import {ms} from 'react-native-size-matters'
import {Box, HStack, Image, Skeleton, Text} from 'native-base'

import {Animated, Icons} from '@bluecentury/assets'
import {titleCase} from '@bluecentury/constants'
import {Colors} from '@bluecentury/styles'
import moment from 'moment'
import {useTranslation} from 'react-i18next'
import _ from 'lodash'

interface IActionCard {
  action: {
    type: string
    start: Date
    end: Date
  }
  onActionPress: () => void
  onActionStopPress: () => void
  isLoading: boolean
}

export const NavlogActionCard = ({
  action,
  onActionPress,
  onActionStopPress,
  isLoading,
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
      <HStack alignItems="center" bg={Colors.white}>
        <Skeleton
          isLoaded={isLoading}
          rounded="full"
          size="12"
          startColor="coolGray.200"
        >
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={_.isNull(action.end) ? false : true}
            style={{marginRight: ms(10)}}
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
        </Skeleton>
        <Box flex="1">
          <Skeleton
            flex="1"
            h="5"
            isLoaded={isLoading}
            rounded="md"
            startColor="coolGray.200"
          >
            <Text bold color={Colors.text} fontSize={ms(15)}>
              {titleCase(action.type)}
            </Text>
          </Skeleton>
          <Skeleton
            flex="1"
            h="5"
            isLoaded={isLoading}
            mt={ms(5)}
            rounded="md"
            startColor="coolGray.200"
          >
            <Text
              color={Colors.secondary}
              fontSize={ms(11)}
              fontWeight="medium"
            >
              {t('start')}
              {moment(action.start).format('D MMM YYYY | HH:mm')}
            </Text>
          </Skeleton>
        </Box>
        <Box
          alignItems="center"
          display="flex"
          height={ms(50)}
          justifyContent="center"
          width={ms(50)}
        >
          <Skeleton
            isLoaded={isLoading}
            rounded="full"
            size="12"
            startColor="coolGray.200"
          >
            <Image
              height={
                action?.type === 'Cleaning' && !_.isNull(action.end)
                  ? '70%'
                  : '100%'
              }
              width={
                action?.type === 'Cleaning' && !_.isNull(action.end)
                  ? '70%'
                  : '100%'
              }
              alt="navlog-action-animated"
              mr={ms(10)}
              resizeMode="contain"
              source={renderAnimatedIcon(action.type, action.end)}
            />
          </Skeleton>
        </Box>
      </HStack>
    </TouchableOpacity>
  )
}
