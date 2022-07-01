import React, {useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, Text} from 'native-base'
import {TabView, SceneMap, TabBar} from 'react-native-tab-view'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {ChartersScreen, TimeChartersSreen} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {chartersTabs} from '@bluecentury/constants'

type Props = NativeStackScreenProps<RootStackParamList>
export default function Charters({navigation}: Props) {
  const layout = useWindowDimensions()

  const [index, setIndex] = useState(0)
  const [routes] = useState(chartersTabs)

  const LazyPlaceholder = ({route}) => (
    <Box flex="1" alignItems="center" justifyContent="center">
      <Text>Loading {route.title}…</Text>
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
