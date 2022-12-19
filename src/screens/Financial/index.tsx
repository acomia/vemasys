import React, {useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Text} from 'native-base'
import {TabView, TabBar, SceneMap} from 'react-native-tab-view'

import {Overview, Costs, Revenue, Scan} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {
  ENTITY_TYPE_EXPLOITATION_GROUP,
  financialTabs,
} from '@bluecentury/constants'
import {useEntity} from '@bluecentury/stores'
import {FleetHeader} from '@bluecentury/components'

export default function Financial() {
  const layout = useWindowDimensions()
  const {entityType, entityUsers, selectFleetVessel} = useEntity()
  const [index, setIndex] = useState(0)
  const [routes] = useState(financialTabs)

  const renderScene = SceneMap({
    overview: Overview,
    costs: Costs,
    revenue: Revenue,
    scan: Scan,
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
        marginLeft: 23,
      }}
      style={{backgroundColor: Colors.primary}}
      tabStyle={{width: ms(95), height: ms(40)}}
      renderLabel={({route, color}) => (
        <Text color={color} bold textAlign="justify">
          {route.title}
        </Text>
      )}
      scrollEnabled={true}
    />
  )

  const onReloadFleetNavLogs = (index: number, vessel: any) => {
    const selectedEntityVessel = entityUsers.find(
      e => e?.entity?.exploitationVessel?.id === vessel?.id
    )

    if (typeof selectedEntityVessel === 'object' && selectedEntityVessel?.id) {
      selectFleetVessel(index, selectedEntityVessel)
    } else {
      selectFleetVessel(index, vessel)
    }
  }

  return (
    <Box flex="1">
      {entityType === ENTITY_TYPE_EXPLOITATION_GROUP && (
        <FleetHeader
          onPress={(index: number, vessel: any) =>
            onReloadFleetNavLogs(index, vessel)
          }
        />
      )}
      <TabView
        lazy
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        renderLazyPlaceholder={renderLazyPlaceholder}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </Box>
  )
}
