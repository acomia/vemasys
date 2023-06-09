import React from 'react'
import {Button, Skeleton} from 'native-base'

interface ISingleButton {
  label: string
  onPress: () => void
  isLoading: boolean
  btnColor: string
}

export const SingleButton = ({
  label,
  onPress,
  isLoading,
  btnColor,
}: ISingleButton) => {
  return (
    <Skeleton
      flex="1"
      h="7"
      isLoaded={isLoading}
      rounded="md"
      startColor="coolGray.200"
    >
      <Button bg={btnColor} size="sm" onPress={onPress}>
        {label}
      </Button>
    </Skeleton>
  )
}
