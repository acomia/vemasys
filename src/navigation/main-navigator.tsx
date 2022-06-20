import React from 'react'
import {View} from 'native-base'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {DrawerActions} from '@react-navigation/native'
import {
  Notification,
  Entity,
  Map,
  Formations,
  QRScanner
} from '@bluecentury/screens'
import {Sidebar, IconButton} from '@bluecentury/components'
import {icons} from '@bluecentury/assets'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {Screens} from '@bluecentury/constants'
import {ms} from 'react-native-size-matters'

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
        headerStyle: {backgroundColor: '#F0F0F0'},
        headerShadowVisible: false,
        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10
            }}
          >
            <IconButton
              source={icons.qr}
              btnStyle={{marginRight: 10}}
              onPress={() => navigation.navigate('QRScanner')}
            />
            <IconButton
              source={icons.gps}
              iconStyle={{width: 35, height: 35}}
              onPress={() => navigation.navigate('GPSTracker')}
            />
          </View>
        ),
        headerLeft: () => (
          <IconButton
            source={icons.menu}
            btnStyle={{marginLeft: 10}}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            iconStyle={{width: 22, height: 22}}
          />
        )
      }}
      initialRouteName={Screens.Notifications}
      drawerContent={props => <Sidebar {...props} />}
    >
      <Screen name={Screens.Notifications} component={Notification} />
      <Screen name={Screens.MapView} component={Map} />
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
