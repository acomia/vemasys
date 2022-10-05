import React from 'react'
import {NativeBaseProvider} from 'native-base'
import {NavigationContainer} from '@react-navigation/native'
import {theme} from '@bluecentury/styles'
import {navigationRef} from '@bluecentury/navigation'
interface Props {
  children: React.ReactNode
}

export default function AppContainer({children}: Props) {
  return (
    <NavigationContainer ref={navigationRef}>{children}</NavigationContainer>
  )
}
