import React, {useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Text} from 'native-base'
import {TabView, SceneMap, TabBar} from 'react-native-tab-view'

import {Bunkering, Engines} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {technicalTabs} from '@bluecentury/constants'

const renderScene = SceneMap({
  bunkering: Bunkering,
  engines: Engines,
  reservoirs: () => <Text>Reservoirs</Text>,
  tasks: () => <Text>tasks</Text>,
  routines: () => <Text>routines</Text>,
  certificates: () => <Text>certificates</Text>,
  inventory: () => <Text>inventory</Text>
})

export default function Technical() {
  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState(technicalTabs)

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: Colors.azure,
        height: 3,
        borderRadius: 3,
        width: ms(50),
        marginLeft: 25
      }}
      style={{backgroundColor: Colors.primary}}
      tabStyle={{width: ms(100), height: ms(45)}}
      renderLabel={({route, color}) => (
        <Text color={color} fontWeight="bold" width="full">
          {route.title}
        </Text>
      )}
      scrollEnabled={true}
    />
  )

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  )
}
