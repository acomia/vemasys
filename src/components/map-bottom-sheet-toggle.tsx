import React, {MutableRefObject} from 'react'
import {Icon, Pressable} from 'native-base'
import Feather from 'react-native-vector-icons/Feather'
import {GestureResponderEvent} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated'
import {Colors} from '@bluecentury/styles'

interface MapBottomSheetToggleProps {
  onPress: (e: GestureResponderEvent) => void
  snapRef: MutableRefObject<boolean>
}

export function MapBottomSheetToggle({
  onPress,
  snapRef,
}: MapBottomSheetToggleProps) {
  const animation = useSharedValue(0)
  const rotation = useDerivedValue(() => {
    return interpolate(animation.value, [0, 180], [0, 180])
  })
  const buttonRotation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: rotation.value + 'deg',
        },
      ],
    }
  })
  const startAnimation = () => {
    animation.value = withTiming(!snapRef.current ? 180 : 0, {
      duration: 400,
    })
  }

  return (
    <Pressable
      alignSelf="center"
      borderRadius="full"
      onPress={e => {
        startAnimation()
        onPress(e)
      }}
    >
      <Animated.View style={[buttonRotation]}>
        <Icon
          as={<Feather name="arrow-up-circle" />}
          size="2xl"
          color={Colors.primary}
        />
      </Animated.View>
    </Pressable>
  )
}
