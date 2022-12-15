import React, {useCallback, useEffect, useRef, useState} from 'react'
import Lottie from 'lottie-react-native'
import {useSettings} from '@bluecentury/stores'
import {AppState} from 'react-native'

export function GPSAnimated() {
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

  return (
    <Lottie
      ref={animationRef}
      autoPlay={false}
      loop
      source={require('@bluecentury/assets/animated/lottie/gps_phone.json')}
    />
  )
}
