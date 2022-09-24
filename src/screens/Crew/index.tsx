import React, {useEffect, useState} from 'react'
import {ImageSourcePropType, useWindowDimensions} from 'react-native'
import {Box, HStack, Text} from 'native-base'
import {ms} from 'react-native-size-matters'
import {TabView, TabBar, SceneMap} from 'react-native-tab-view'

import {Me, Planning} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {crewTabs, ENTITY_TYPE_EXPLOITATION_GROUP} from '@bluecentury/constants'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {FleetHeader, IconButton} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {useEntity, useMap} from '@bluecentury/stores'

const renderScene = SceneMap({
  me: Me,
  planning: Planning
})

type Props = NativeStackScreenProps<RootStackParamList>
export default function Crew({navigation}: Props) {
  const {activeFormations} = useMap()
  const {entityType, entityUsers, selectFleetVessel} = useEntity()
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [routes] = useState(crewTabs)
  let scanIcon: ImageSourcePropType =
    activeFormations?.length > 0 ? Icons.qr : Icons.formations
  let scanNavigateTo: () => void =
    activeFormations?.length > 0
      ? () => navigation.navigate('QRScanner')
      : () => navigation.navigate('Formations')

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Box flexDirection="row" alignItems="center" mr={ms(20)}>
          <HStack space="3">
            <IconButton
              source={scanIcon}
              onPress={() => scanNavigateTo()}
              size={ms(25)}
            />
            <IconButton
              source={Icons.gps}
              onPress={() => navigation.navigate('GPSTracker')}
              size={ms(30)}
            />
            <IconButton
              source={Icons.user_plus}
              onPress={() => navigation.navigate('AddCrewMember')}
              size={ms(25)}
            />
          </HStack>
        </Box>
      )
    })
  }, [])

  const LazyPlaceholder = ({route}: any) => (
    <Box flex="1" alignItems="center" justifyContent="center">
      <Text>Loading {route.title}…</Text>
    </Box>
  )

  const renderLazyPlaceholder = ({route}: any) => (
    <LazyPlaceholder route={route} />
  )

  const renderTabBar = (props: any) => (
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
