import React, {useEffect, useRef, useState} from 'react'
import {Text} from 'native-base'

import {Details, CargoList, CargoHolds, Documents, Map, Actions} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {usePlanning} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs'

const Tab = createMaterialTopTabNavigator()

type Props = MaterialTopTabScreenProps<RootStackParamList>
export default function PlanningDetails({route}: Props) {
  const {t} = useTranslation()
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
        tabBarIndicatorStyle: {
          backgroundColor: Colors.azure,
          height: 3,
          borderRadius: 3,
          width: ms(45),
          marginLeft: 25,
        },
        tabBarItemStyle: {width: 100, height: 45},
        tabBarScrollEnabled: true,
        lazy: true,
        lazyPlaceholder: () => (
          <Text bold color={Colors.azure}>
            {t('loading')} {route.name}...
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
            tabBarLabel: ({focused}) => (
              <Text
                bold
                color={focused ? Colors.white : Colors.light}
                fontSize={ms(14)}
              >
                {route.name}
              </Text>
            ),
          })}
        />
      ))}
    </Tab.Navigator>
  )
}
