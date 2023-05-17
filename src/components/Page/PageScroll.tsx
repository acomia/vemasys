import React from 'react'
import {RefreshControl} from 'react-native'
import {Box, ScrollView} from 'native-base'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

interface Props {
  children: Element
  refreshing: boolean
  onPullToReload?: () => void
  contentContainerStyle?: object
  backgroundColor: string
}

export default (props: Props) => {
  return (
    <Box flex={1}>
      <ScrollView
        contentContainerStyle={[
          {
            flexGrow: 1,
            paddingBottom: 30,
          },
          props.contentContainerStyle,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={props.refreshing}
            onRefresh={props.onPullToReload}
          />
        }
        bg={props.backgroundColor === '' ? Colors.white : props.backgroundColor}
        px={ms(12)}
        py={ms(10)}
        scrollEventThrottle={16}
      >
        {props.children}
      </ScrollView>
    </Box>
  )
}
