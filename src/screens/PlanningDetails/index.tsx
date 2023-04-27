import React, {useEffect, useRef, useState} from 'react'
import {useWindowDimensions} from 'react-native'
import {Box, HStack, Text} from 'native-base'

import {
  Details,
  CargoList,
  CargoHolds,
  Documents,
  Map,
  Actions,
  DraughtCalculator,
} from './Tabs'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {usePlanning} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from '@react-navigation/material-top-tabs'

import {NoInternetConnectionMessage} from '@bluecentury/components'

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
    {title: t('draughtCalculator'), screen: DraughtCalculator},
  ]
  const {navlog, title} = route.params
  const {
    navigationLogDetails,
    navigationLogCargoHolds,
    navigationLogActions,
    navigationLogDocuments,
  } = usePlanning()
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

  const renderTabBadge = (tab: string) => {
    switch (tab) {
      case 'Actions':
        return navigationLogActions?.length ? (
          <Box bg={'#3E96A8'} borderRadius={12} px={2}>
            <Text color={Colors.white} fontSize={ms(12)} fontWeight="medium">
              ({navigationLogActions?.length})
            </Text>
          </Box>
        ) : null

      case 'Cargo List':
        return navigationLogDetails?.bulkCargo?.length ? (
          <Box bg={'#3E96A8'} borderRadius={12} px={2}>
            <Text color={Colors.white} fontSize={ms(12)} fontWeight="medium">
              ({navigationLogDetails?.bulkCargo?.length})
            </Text>
          </Box>
        ) : null
      case 'Cargo Holds':
        return navigationLogCargoHolds?.length ? (
          <Box bg={'#3E96A8'} borderRadius={12} h={ms(5)} px={2}>
            <Text color={Colors.white} fontSize={ms(12)} fontWeight="medium">
              ({navigationLogDetails?.bulkCargo?.length})
            </Text>
          </Box>
        ) : null
      case 'Documents':
        return navigationLogDocuments?.length ? (
          <Box bg={'#3E96A8'} borderRadius={12} px={2}>
            <Text color={Colors.white} fontSize={ms(12)} fontWeight="medium">
              ({navigationLogDetails?.bulkCargo?.length})
            </Text>
          </Box>
        ) : null
    }
  }

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarStyle: {backgroundColor: Colors.primary},
          tabBarIndicatorStyle: {
            backgroundColor: Colors.azure,
            height: 3,
            borderRadius: 3,
            width: ms(45),
            marginLeft: screenWidth > 500 ? ms(68) : ms(25),
          },
          tabBarItemStyle: {
            width: screenWidth > 500 ? ms(180) : ms(100),
            height: screenWidth > 500 ? ms(60) : ms(45),
            paddingHorizontal: ms(5),
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
        {routes.map((route, index) => {
          return (
            <Tab.Screen
              key={index}
              options={({route}) => ({
                tabBarLabel: ({focused}) => (
                  <HStack alignItems="center">
                    <Text
                      bold
                      color={focused ? Colors.white : Colors.light}
                      mr={1}
                    >
                      {route.name}
                    </Text>
                    {renderTabBadge(route.name)}
                  </HStack>
                ),
              })}
              component={route.screen}
              initialParams={{navlog, title}}
              name={route.title}
            />
          )
        })}
      </Tab.Navigator>
    </Box>
  )
}
