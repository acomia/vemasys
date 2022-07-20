import React, {useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Text} from 'native-base'
import {TabView, TabBar, SceneMap} from 'react-native-tab-view'

import {Overview, Costs, Revenue, Scan} from './tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {financialTabs} from '@bluecentury/constants'

export default function Financial() {
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [routes] = useState(financialTabs)

  const renderScene = SceneMap({
    overview: Overview,
    costs: Costs,
    revenue: Revenue,
    scan: Scan
  })

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
        marginLeft: 23
      }}
      style={{backgroundColor: Colors.primary}}
      tabStyle={{width: ms(95), height: ms(40)}}
      renderLabel={({route, color}) => (
        <Text color={color} fontWeight="bold" textAlign="justify">
          {route.title}
        </Text>
      )}
      scrollEnabled={true}
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
