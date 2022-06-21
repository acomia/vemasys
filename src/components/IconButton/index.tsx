import React, {FC} from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle
} from 'react-native'

interface IProps {
  source: ImageSourcePropType
  onPress: () => void
  btnStyle?: StyleProp<ViewStyle>
  iconStyle?: StyleProp<ImageStyle>
  disabled?: boolean
}

export const IconButton: FC<IProps> = props => {
  const {source, onPress, btnStyle, iconStyle, disabled} = props
  return (
    <TouchableOpacity
      style={[styles.container, btnStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
    >
      <Image
        source={source}
        resizeMode="contain"
        style={[styles.icon, iconStyle]}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  icon: {
    width: 30,
    height: 30
  }
})
