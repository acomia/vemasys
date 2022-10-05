import React, {useEffect, useRef} from 'react'
import Lottie from 'lottie-react-native'
import {useSettings} from '@bluecentury/stores'

export function GPSAnimated() {
  const animationRef = useRef<Lottie>(null)
  const {isMobileTracking} = useSettings()
  useEffect(() => {
    if (isMobileTracking) animationRef.current?.play()
    else animationRef.current?.reset()
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
