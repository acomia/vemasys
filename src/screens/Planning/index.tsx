/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Text} from 'native-base'
import {TabView, TabBar, SceneMap} from 'react-native-tab-view'
import {PlanningLogbook, HistoryLogbook} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {
  ENTITY_TYPE_EXPLOITATION_GROUP,
  planningTabs,
} from '@bluecentury/constants'
import {FleetHeader, NoInternetConnectionMessage} from '@bluecentury/components'
import {useEntity} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'

const renderScene = SceneMap({
  planning: PlanningLogbook,
  logbook: HistoryLogbook,
})

export default function Planning() {
  const layout = useWindowDimensions()
  const {t} = useTranslation()

  const {entityType, selectFleetVessel, entityUsers} = useEntity()
  const [index, setIndex] = useState(0)
  const [routes] = useState(planningTabs)

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: Colors.azure,
        height: 3,
        borderRadius: 3,
        width: ms(50),
        marginHorizontal: layout.width / 6 + 5,
      }}
      renderLabel={({route, color}) => (
        <Text bold color={color} fontSize={ms(14)}>
          {t(route.title)}
        </Text>
      )}
      style={{backgroundColor: Colors.primary}}
    />
  )

  const onReloadFleetNavLogs = (idx: number, vessel: any) => {
    const selectedEntityVessel = entityUsers.find(
      e => e?.entity?.exploitationVessel?.id === vessel?.id
    )

    if (selectedEntityVessel && selectedEntityVessel?.id) {
      selectFleetVessel(idx, selectedEntityVessel)
    } else {
      selectFleetVessel(idx, vessel)
    }
  }

  return (
    <Box flex="1">
      {entityType === ENTITY_TYPE_EXPLOITATION_GROUP && (
        <FleetHeader
          onPress={(idx: number, vessel: any) =>
            onReloadFleetNavLogs(idx, vessel)
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
