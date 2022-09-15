import React, {useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Text} from 'native-base'
import {TabView, TabBar, SceneMap} from 'react-native-tab-view'
import {PlanningLogbook, HistoryLogbook} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {
  ENTITY_TYPE_EXPLOITATION_GROUP,
  planningTabs
} from '@bluecentury/constants'
import {FleetHeader} from '@bluecentury/components'
import {useEntity} from '@bluecentury/stores'

const renderScene = SceneMap({
  planning: PlanningLogbook,
  logbook: HistoryLogbook
})

export default function Planning() {
  const layout = useWindowDimensions()

  const {entityType, selectFleetVessel, entityUsers} = useEntity()
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
