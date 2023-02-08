import React, {useEffect, useRef, useState} from 'react'
import {useWindowDimensions} from 'react-native'
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
    {title: t('Details'), screen: Details},
    {title: t('Actions'), screen: Actions},
    {title: t('Cargo List'), screen: CargoList},
    {title: t('Cargo Holds'), screen: CargoHolds},
    {title: t('Documents'), screen: Documents},
    {title: t('Map'), screen: Map},
  ]
  const {navlog, title} = route.params
  const {navigationLogDetails} = usePlanning()
  const [routes, setRoutes] = useState(tabs)
  const isUnknownLocation = title === 'Unknown Location' ? true : false
  const screenWidth = useWindowDimensions().width
 
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
          marginLeft: screenWidth > 500 ? 60 : 25,
        },
        tabBarItemStyle: {
          width: screenWidth > 500 ? 200 : 100,
          height: screenWidth > 500 ? 60 : 45,
          paddingHorizontal: 5
        },
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
