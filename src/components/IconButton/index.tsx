import React, {FC} from 'react'
import {ImageSourcePropType} from 'react-native'
import {IconButton as ButtonIcon, Image} from 'native-base'
import {ms} from 'react-native-size-matters'

interface IProps {
  source: ImageSourcePropType
  onPress: () => void
  disabled?: boolean
  size?: number
}

export const IconButton: FC<IProps> = ({
  source,
  onPress,
  disabled,
  size = ms(30)
}) => (
  <ButtonIcon
    p={0}
    onPress={onPress}
    disabled={disabled}
    icon={
      <Image
        source={source}
        resizeMode="contain"
        size={size}
        alt="icon-button"
      />
    }
    variant="unstyled"
    _pressed={{
      opacity: 0.8
    }}
  />
)
