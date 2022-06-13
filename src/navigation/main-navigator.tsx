import React from 'react'
import {IconButton, Icon} from 'native-base'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {DrawerActions} from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Map, Notification} from '@bluecentury/screens'
import {Sidebar} from '@bluecentury/components'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

const {Navigator, Screen} = createDrawerNavigator<MainStackParamList>()

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>

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
        // headerRight: () => (
        //   <View
        //     style={{
        //       flexDirection: 'row',
        //       alignItems: 'center',
        //       marginRight: 10,
        //     }}
        //   >
        //     <IconButton
        //       source={icons.qr}
        //       btnStyle={{ marginRight: 10 }}
        //       onPress={() => navigation.navigate('QRScanner')}
        //     />
        //     <IconButton
        //       source={icons.gps}
        //       iconStyle={{ width: 35, height: 35 }}
        //       onPress={() => navigation.navigate('QRScanner')}
        //     />
        //   </View>
        // ),
        headerLeft: () => (
          <IconButton
            icon={
              <Icon
                as={<MaterialCommunityIcons name="menu" />}
                size={ms(24)}
                color="#23475C"
              />
            }
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        )
      }}
      initialRouteName="Map"
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
      <Screen
        name="Map"
        component={Map}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon
              as={<MaterialCommunityIcons name="map" />}
              size={ms(size)}
              color={color}
            />
          )
        }}
      />
    </Navigator>
  )
}
