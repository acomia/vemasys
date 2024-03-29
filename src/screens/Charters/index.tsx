import React, {useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Text} from 'native-base'
import {TabView, SceneMap, TabBar} from 'react-native-tab-view'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {ChartersScreen, TimeChartersSreen} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {
  chartersTabs,
  ENTITY_TYPE_EXPLOITATION_GROUP,
} from '@bluecentury/constants'
import {FleetHeader, NoInternetConnectionMessage} from '@bluecentury/components'
import {useEntity} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList>
export default function Charters({navigation}: Props) {
  const {t} = useTranslation()
  const layout = useWindowDimensions()

  const {entityType, selectFleetVessel, entityUsers} = useEntity()
  const [index, setIndex] = useState(0)
  const [routes] = useState(chartersTabs)

  const LazyPlaceholder = ({route}) => (
    <Box flex="1" alignItems="center" justifyContent="center">
      <Text>
        {t('loading')} {route.title}…
      </Text>
    </Box>
  )

  const renderLazyPlaceholder = ({route}) => <LazyPlaceholder route={route} />

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'charters':
        return <ChartersScreen route={route.key} navigation={navigation} />
      case 'time_charters':
        return <TimeChartersSreen route={route.key} navigation={navigation} />
    }
  }

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
      style={{backgroundColor: Colors.primary}}
      renderLabel={({route, color}) => (
        <Text color={color} bold fontSize={ms(14)}>
          {t(route.title)}
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
      <NoInternetConnectionMessage />
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
