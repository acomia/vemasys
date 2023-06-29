import React, {useCallback, useEffect, useRef, useState} from 'react'
import Lottie from 'lottie-react-native'
import {useSettings} from '@bluecentury/stores'
import {AppState} from 'react-native'
import IconIon from 'react-native-vector-icons/Ionicons'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {Box} from 'native-base'

interface Props {
  isOpen: boolean
}

export function GPSAnimated({isOpen}: Props) {
  const animationRef = useRef<Lottie>(null)
  const {isMobileTracking} = useSettings()
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    if (isMobileTracking) animationRef.current?.play()
    else animationRef.current?.reset()
  }, [isMobileTracking])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (isMobileTracking) animationRef.current?.play()
        else animationRef.current?.reset()
      }
      appState.current = nextAppState
    })
    return () => {
      subscription.remove()
    }
  }, [isMobileTracking])

  return isMobileTracking ? (
    <Lottie
      ref={animationRef}
      loop
      autoPlay={false}
      source={require('@bluecentury/assets/animated/lottie/gps_phone.json')}
    />
  ) : (
    <Box alignItems={'center'} flex={1} justifyContent={'center'}>
      <IconIon
        color={isOpen ? Colors.danger : Colors.primary}
        name="navigate-circle"
        size={ms(23)}
      />
    </Box>
  )
}
