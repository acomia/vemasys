import React from 'react'
import {HStack, Image, Skeleton, Text} from 'native-base'
import {ms} from 'react-native-size-matters'

import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'

interface ICompleted {
  label: string
  isLoading: boolean
}

export const Completed = ({label, isLoading}: ICompleted) => {
  return (
    <HStack alignItems="center">
      <Skeleton.Text isLoaded={isLoading}>
        <Text bold color={Colors.secondary} flex="1" fontSize={ms(16)}>
          {label}
        </Text>
      </Skeleton.Text>
      <Skeleton
        isLoaded={isLoading}
        rounded="full"
        size="12"
        startColor="coolGray.200"
      >
        <Image
          alt="navlog-completed-icon"
          resizeMode="contain"
          size="xs"
          source={Icons.completed}
        />
      </Skeleton>
    </HStack>
  )
}
