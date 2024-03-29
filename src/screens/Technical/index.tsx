import React, {useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Text} from 'native-base'
import {TabView, SceneMap, TabBar} from 'react-native-tab-view'

import {
  Bunkering,
  Certificates,
  Engines,
  Inventory,
  Reservoirs,
  Routines,
  Tasks,
} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {
  ENTITY_TYPE_EXPLOITATION_GROUP,
  technicalTabs,
} from '@bluecentury/constants'
import {FleetHeader, NoInternetConnectionMessage} from '@bluecentury/components'
import {useEntity} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'

const renderScene = SceneMap({
  bunkering: Bunkering,
  engines: Engines,
  reservoirs: Reservoirs,
  tasks: Tasks,
  routines: Routines,
  certificates: Certificates,
  inventory: Inventory,
})

export default function Technical() {
  const {t} = useTranslation()
  const layout = useWindowDimensions()

  const {entityType, entityUsers, selectFleetVessel} = useEntity()
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
        marginLeft: 25,
      }}
      renderLabel={({route, color}) => (
        <Text bold color={color}>
          {t(route.title)}
        </Text>
      )}
      scrollEnabled={true}
      style={{backgroundColor: Colors.primary}}
      tabStyle={{width: ms(100), height: ms(45)}}
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
      <NoInternetConnectionMessage />
      <TabView
        lazy
        initialLayout={{width: layout.width}}
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
      />
    </Box>
  )
}
