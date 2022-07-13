import React, {FC} from 'react'
import {ImageSourcePropType, ViewStyle} from 'react-native'
import {IconButton as ButtonIcon, Image} from 'native-base'
import {ms} from 'react-native-size-matters'

interface IProps {
  source: ImageSourcePropType
  onPress: () => void
  disabled?: boolean
  size?: number
  styles?: ViewStyle
  tintColor?: string
}

export const IconButton: FC<IProps> = ({
  source,
  onPress,
  disabled,
  size = ms(30),
  styles,
  tintColor
}) => (
  <ButtonIcon
    p={0}
    onPress={onPress}
    disabled={disabled}
    style={styles}
    icon={
      <Image
        source={source}
        resizeMode="contain"
        size={size}
        tintColor={tintColor}
        alt="icon-button"
      />
    }
    variant="unstyled"
    _pressed={{
      opacity: 0.8
    }}
  />
)
