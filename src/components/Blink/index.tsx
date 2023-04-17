import React, {ReactNode, useEffect} from 'react'
import {View, Text, Animated, StyleSheet, ViewStyle} from 'react-native'

interface IBlink {
  children: ReactNode
  duration: number
  viewStyle?: ViewStyle
}
export const Blink = ({children, duration, viewStyle}: IBlink) => {
  const opacity = new Animated.Value(0)

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start()
  })

  return (
    <View style={{...viewStyle}}>
      <Animated.View style={{opacity: opacity}}>{children}</Animated.View>
    </View>
  )
}
