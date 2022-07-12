import React, {useEffect, useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Text} from 'native-base'
import {TabView, TabBar, SceneMap} from 'react-native-tab-view'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {PlanningLogbook, HistoryLogbook} from './tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {planningTabs} from '@bluecentury/constants'
import {useEntity, usePlanning} from '@bluecentury/stores'

const renderScene = SceneMap({
  planning: PlanningLogbook,
  logbook: HistoryLogbook
})

export default function Planning() {
  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState(planningTabs)

  const LazyPlaceholder = ({route}) => (
    <Box flex="1" alignItems="center" justifyContent="center">
      <Text>Loading {route.title}…</Text>
    </Box>
  )

  const renderLazyPlaceholder = ({route}) => <LazyPlaceholder route={route} />

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: Colors.azure,
        height: 3,
        borderRadius: 3,
        width: ms(50),
        marginHorizontal: layout.width / 6 + 5
      }}
      style={{backgroundColor: Colors.primary}}
      renderLabel={({route, color}) => (
        <Text color={color} fontWeight="bold" fontSize={ms(15)}>
          {route.title}
        </Text>
      )}
    />
  )

  return (
    <TabView
      lazy
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      renderLazyPlaceholder={renderLazyPlaceholder}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  )
}
