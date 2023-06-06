import React from 'react'
import {ActivityIndicator} from 'react-native'
import {Box} from 'native-base'
import {NavLogCard} from '@bluecentury/components'
import {NavigationLog} from '@bluecentury/models'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'

const MapNavLog = (props: {
  navigationLog: NavigationLog
  itemColor: string
  key: number
}) => {
  const {navigationLog, itemColor, key} = props

  return navigationLog ? (
    <Box right={ms(7)} width={'full'}>
      <NavLogCard
        key={key}
        defineFirstAndLastIndex={[]}
        index={key}
        isFinished={false}
        itemColor={itemColor}
        lastScreen={'planning'}
        navigationLog={navigationLog}
      />
    </Box>
  ) : (
    <ActivityIndicator size={ms(40)} />
  )
}

export default MapNavLog
