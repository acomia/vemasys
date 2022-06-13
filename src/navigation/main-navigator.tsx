import React from 'react'
import {View, Text} from 'react-native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {DrawerActions, useNavigation} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {ms} from 'react-native-size-matters'
import {Notification, Entity, Map} from '@bluecentury/screens'
import {Sidebar, IconButton} from '@bluecentury/components'
import {icons} from '@bluecentury/assets'

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

const {Navigator, Screen} = createDrawerNavigator<MainStackParamList>()

export default function MainNavigator({navigation}: Props) {
  return (
    <Navigator
      screenOptions={{
        drawerActiveBackgroundColor: '#44A7B9',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 15
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
            }}>
            <IconButton
              source={icons.qr}
              btnStyle={{marginRight: 10}}
              onPress={() => {}}
            />
            <IconButton
              source={icons.gps}
              iconStyle={{width: 35, height: 35}}
              onPress={() => {}}
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
      initialRouteName="Notification"
      drawerContent={props => <Sidebar {...props} />}>
      <Screen
        name="Notification"
        component={Notification}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon
              as={<MaterialCommunityIcons name="bell-outline" />}
              size={ms(size)}
              color={color}
            />
          )
        }}
      />
      {/* <Screen
        name="Map"
        component={Map}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="map" size={size} color={color} />
          ),
        }}
      /> */}
      <Screen
        name="Change role"
        component={Entity}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="account-circle-outline" size={size} color={color} />
          ),
          headerTitle: 'Select your role'
        }}
      />
    </Navigator>
  )
}
