import {View, Text} from 'react-native'
import React from 'react'
import {Box, Button, HStack, Skeleton} from 'native-base'
import _ from 'lodash'
import {Colors} from '@bluecentury/styles'
import {NavigationLog} from '@bluecentury/models'

interface IEtaNorButtons {
  navigationLog: NavigationLog
  onETAPress: () => void
  onNORPress: () => void
  isLoading: boolean
}

export const EtaNorButtons = ({
  navigationLog,
  onETAPress,
  onNORPress,
  isLoading,
}: IEtaNorButtons) => {
  return (
    <HStack>
      <Skeleton
        flex="1"
        h="7"
        isLoaded={isLoading}
        rounded="md"
        startColor="coolGray.200"
      >
        <Button
          bg={
            _.isNull(navigationLog?.captainDatetimeEta)
              ? Colors.primary
              : Colors.disabled
          }
          colorScheme={Colors.disabled}
          flex="1"
          size="sm"
          onPress={onETAPress}
        >
          ETA
        </Button>
      </Skeleton>
      <Box w={3} />
      <Skeleton flex="1" h="7" isLoaded={isLoading} rounded="md" speed={6}>
        <Button bg={Colors.primary} flex="1" size="sm" onPress={onNORPress}>
          NOR
        </Button>
      </Skeleton>
    </HStack>
  )
}
