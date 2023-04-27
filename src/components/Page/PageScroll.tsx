import React from 'react'
import {RefreshControl} from 'react-native'
import {Box, ScrollView} from 'native-base'
import {ms} from 'react-native-size-matters'

interface Props {
  children: Element
  refreshing: boolean
  onPullToReload?: () => void
}

export default (props: Props) => {
  return (
    <Box flex={1}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={props.refreshing}
            onRefresh={props.onPullToReload}
          />
        }
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(10)}
        scrollEventThrottle={16}
      >
        {props.children}
      </ScrollView>
    </Box>
  )
}
