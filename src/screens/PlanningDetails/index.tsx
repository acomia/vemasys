// import React, {useEffect, useRef, useState} from 'react'
// import {useWindowDimensions} from 'react-native'
// import {Box, Text} from 'native-base'
// import {TabView, TabBar, SceneMap, TabBarProps} from 'react-native-tab-view'
// import {NativeStackScreenProps} from '@react-navigation/native-stack'

// import {Details, CargoList, CargoHolds, Documents, Map, Actions} from './Tabs'
// import {Colors} from '@bluecentury/styles'
// import {ms} from 'react-native-size-matters'
// import {planningDetailsTabs} from '@bluecentury/constants'
// import {usePlanning} from '@bluecentury/stores'
// import {useRoute} from '@react-navigation/native'

// type Props = NativeStackScreenProps<RootStackParamList>
// export default function PlanningDetails() {
//   const route = useRoute()
//   const {title} = route.params
//   const layout = useWindowDimensions()
//   const {navigationLogDetails, onPlanningTabChange} = usePlanning()
//   const [index, setIndex] = useState(0)
//   const [routes, setRoutes] = useState(planningDetailsTabs)
//   const isUnknownLocation = title === 'Unknown Location' ? true : false

//   useEffect(() => {
//     if (
//       navigationLogDetails?.cargoType !== 'liquid_bulk' &&
//       navigationLogDetails?.cargoType !== undefined
//     ) {
//       const newRoutes = planningDetailsTabs
//         .filter(route => route.key !== 'cargoHolds')
//         .filter(route =>
//           isUnknownLocation ? route.key !== 'cargoList' : route
//         )
//       setRoutes(newRoutes)
//     } else {
//       const newRoutes = isUnknownLocation
//         ? planningDetailsTabs.filter(
//             route => route.key !== 'cargoHolds' && route.key !== 'cargoList'
//           )
//         : planningDetailsTabs
//       setRoutes(newRoutes)
//     }
//   }, [navigationLogDetails])

//   const renderScene = SceneMap({
//     details: Details,
//     actions: Actions,
//     cargoList: CargoList,
//     cargoHolds: CargoHolds,
//     documents: Documents,
//     map: Map,
//   })

//   const LazyPlaceholder = ({route}) => (
//     <Box flex="1" alignItems="center" justifyContent="center">
//       <Text>Loading {route.title}…</Text>
//     </Box>
//   )

//   const renderLazyPlaceholder = ({route}) => <LazyPlaceholder route={route} />

//   const renderTabBar = props => (
//     <TabBar
//       {...props}
//       indicatorStyle={{
//         backgroundColor: Colors.azure,
//         height: 3,
//         borderRadius: 3,
//         width: ms(50),
//         marginLeft: 30,
//       }}
//       style={{backgroundColor: Colors.primary}}
//       tabStyle={{width: ms(110), height: ms(40)}}
//       renderLabel={({route, color}) => (
//         <Text color={color} bold textAlign="justify">
//           {route.title}
//         </Text>
//       )}
//       scrollEnabled={true}
//     />
//   )

//   const onTabChange = (idx: number) => {
//     setIndex(idx)
//     onPlanningTabChange(idx)
//   }

//   return (
//     <TabView
//       lazy
//       navigationState={{index, routes}}
//       renderScene={renderScene}
//       renderTabBar={renderTabBar}
//       renderLazyPlaceholder={renderLazyPlaceholder}
//       // onIndexChange={(index: number) => onTabChange(index)}
//       onIndexChange={setIndex}
//       initialLayout={{width: layout.width}}
//     />
//   )
// }

import React, {useEffect, useRef, useState} from 'react'
import {Box, Text} from 'native-base'
import {TabView, TabBar, SceneMap, TabBarProps} from 'react-native-tab-view'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {Details, CargoList, CargoHolds, Documents, Map, Actions} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {planningDetailsTabs} from '@bluecentury/constants'
import {usePlanning} from '@bluecentury/stores'
import {useRoute} from '@react-navigation/native'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator()

type Props = MaterialTopTabScreenProps<RootStackParamList>
export default function PlanningDetails({route}: Props) {
  const tabs = [
    {title: 'Details', screen: Details},
    {title: 'Actions', screen: Actions},
    {title: 'Cargo List', screen: CargoList},
    {title: 'Cargo Holds', screen: CargoHolds},
    {title: 'Documents', screen: Documents},
    {title: 'Map', screen: Map},
  ]
  const {navlog, title} = route.params
  const {navigationLogDetails} = usePlanning()
  const [routes, setRoutes] = useState(tabs)
  const isUnknownLocation = title === 'Unknown Location' ? true : false

  useEffect(() => {
    if (
      navigationLogDetails?.cargoType !== 'liquid_bulk' &&
      navigationLogDetails?.cargoType !== undefined
    ) {
      const newRoutes = tabs
        .filter(route => route.title !== 'Cargo Holds')
        .filter(route =>
          isUnknownLocation ? route.title !== 'Cargo List' : route
        )
      setRoutes(newRoutes)
    } else {
      const newRoutes = isUnknownLocation
        ? tabs.filter(
            route =>
              route.title !== 'Cargo Holds' && route.title !== 'Cargo List'
          )
        : tabs
      setRoutes(newRoutes)
    }
  }, [navigationLogDetails])

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {backgroundColor: Colors.primary},
        tabBarLabelStyle: {
          fontSize: ms(14),
          fontWeight: 'bold',
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.azure,
          height: 3,
          borderRadius: 3,
          width: ms(50),
          marginLeft: 25,
        },
        tabBarItemStyle: {width: 100, height: 45},
        tabBarScrollEnabled: true,
        lazy: true,
        lazyPlaceholder: () => (
          <Text bold color={Colors.azure}>
            Loading {route.name}...
          </Text>
        ),
      })}
      backBehavior="firstRoute"
    >
      {routes.map((route, index) => (
        <Tab.Screen
          key={index}
          name={route.title}
          component={route.screen}
          initialParams={{navlog, title}}
          options={({route}) => ({
            tabBarLabel: ({focused, color}) => (
              <Text bold color={focused ? Colors.white : Colors.light}>
                {route.name}
              </Text>
            ),
          })}
        />
      ))}
    </Tab.Navigator>
  )
}
