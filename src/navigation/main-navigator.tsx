import React from 'react'
import {Box, HStack, View} from 'native-base'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {DrawerActions} from '@react-navigation/native'
import {Notification, Entity, Map, Planning} from '@bluecentury/screens'
import {Sidebar, IconButton} from '@bluecentury/components'
import {icons} from '@bluecentury/assets'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {Screens} from '@bluecentury/constants'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'

const {Navigator, Screen} = createDrawerNavigator<MainStackParamList>()

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

export default function MainNavigator({navigation}: Props) {
  return (
    <Navigator
      screenOptions={{
        drawerStyle: {
          width: ms(220)
        },
        headerTitleAlign: 'left',
        headerStyle: {
          backgroundColor: Colors.light
        },
        headerShadowVisible: false,
        headerRight: () => (
          <Box flexDirection="row" alignItems="center" mr={ms(20)}>
            <HStack space="3">
              <IconButton
                source={icons.qr}
                onPress={() => navigation.navigate('QRScanner')}
              />
              <IconButton
                source={icons.gps}
                onPress={() => navigation.navigate('GPSTracker')}
              />
            </HStack>
          </Box>
        ),
        headerLeft: () => (
          <Box ml={ms(20)}>
            <IconButton
              source={icons.menu}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              iconStyle={{width: 22, height: 22}}
            />
          </Box>
        )
      }}
      initialRouteName={Screens.MapView}
      drawerContent={props => <Sidebar {...props} />}
    >
      <Screen name={Screens.Notifications} component={Notification} />
      <Screen name={Screens.MapView} component={Map} />
      <Screen name={Screens.Planning} component={Planning} />
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
