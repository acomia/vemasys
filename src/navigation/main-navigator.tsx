import React, {useCallback, useEffect} from 'react'
import {ImageSourcePropType} from 'react-native'
import {Box, HStack, View} from 'native-base'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {DrawerActions, useFocusEffect} from '@react-navigation/native'
import {
  Notification,
  Entity,
  Map,
  Planning,
  Charters,
  Technical
} from '@bluecentury/screens'
import {Sidebar, IconButton} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {Screens} from '@bluecentury/constants'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {useMap} from '@bluecentury/stores'

const {Navigator, Screen} = createDrawerNavigator<MainStackParamList>()

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

export default function MainNavigator({navigation}: Props) {
  const {activeFormations, getActiveFormations} = useMap()
  let scanIcon: ImageSourcePropType = Icons.qr
  let scanNavigateTo: () => void

  useFocusEffect(
    useCallback(() => {
      getActiveFormations()
    }, [])
  )

  useEffect(() => {
    if (activeFormations?.length > 0) {
      scanIcon = Icons.qr
      scanNavigateTo = () => navigation.navigate('QRScanner')
    } else {
      scanIcon = Icons.formations
      scanNavigateTo = () => navigation.navigate('Formations')
    }
  }, [activeFormations])

  return (
    <Navigator
      screenOptions={{
        drawerStyle: {
          width: ms(220)
        },
        headerTitleAlign: 'left',
        headerTitleStyle: {fontSize: 16, fontWeight: 'bold'},
        headerStyle: {backgroundColor: Colors.light},
        headerShadowVisible: false,
        headerRight: () => (
          <Box flexDirection="row" alignItems="center" mr={ms(20)}>
            <HStack space="3">
              <IconButton
                source={scanIcon}
                onPress={() => scanNavigateTo()}
                size={ms(20)}
              />
              <IconButton
                source={Icons.gps}
                onPress={() => navigation.navigate('GPSTracker')}
                size={ms(35)}
              />
            </HStack>
          </Box>
        ),
        headerLeft: () => (
          <Box ml={ms(20)}>
            <IconButton
              source={Icons.menu}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              size={ms(20)}
            />
          </Box>
        )
      }}
      initialRouteName={Screens.MapView}
      drawerContent={props => <Sidebar {...props} />}
    >
      <Screen name={Screens.MapView} component={Map} />
      <Screen name={Screens.Notifications} component={Notification} />
      <Screen name={Screens.Planning} component={Planning} />
      <Screen name={Screens.Charters} component={Charters} />
      <Screen name={Screens.Technical} component={Technical} />
      <Screen
        name={Screens.ChangeRole}
        component={Entity}
        options={{
          headerTitle: 'Select your role'
        }}
      />
    </Navigator>
  )
}
