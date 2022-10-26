import React, {useEffect, useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Text} from 'native-base'
import {TabView, TabBar, SceneMap} from 'react-native-tab-view'

import {Details, CargoList, CargoHolds, Documents, Map, Actions} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {planningDetailsTabs} from '@bluecentury/constants'
import {usePlanning} from '@bluecentury/stores'

export default function PlanningDetails() {
  const layout = useWindowDimensions()
  const {navigationLogDetails} = usePlanning()
  const [index, setIndex] = useState(0)
  const [routes, setRoutes] = useState(planningDetailsTabs)

  useEffect(() => {
    if (
      navigationLogDetails?.cargoType !== 'liquid_bulk' &&
      navigationLogDetails?.cargoType !== undefined
    ) {
      const newRoutes = planningDetailsTabs.filter(
        route => route.key !== 'cargoHolds'
      )
      setRoutes(newRoutes)
    } else {
      setRoutes(planningDetailsTabs)
    }
  }, [navigationLogDetails])

  const renderScene = SceneMap({
    details: Details,
    actions: Actions,
    cargoList: CargoList,
    cargoHolds: CargoHolds,
    documents: Documents,
    map: Map,
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
        marginLeft: 30,
      }}
      style={{backgroundColor: Colors.primary}}
      tabStyle={{width: ms(110), height: ms(40)}}
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
