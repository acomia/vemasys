import React from 'react';
import {View, Text} from 'react-native';
import {IconButton} from 'native-base';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Notification} from '@bluecentury/screens';
import {Drawer} from '@bluecentury/components';
import {icons} from '@bluecentury/assets';

const {Navigator, Screen} = createDrawerNavigator();

export const DrawerNavigator = () => {
  const navigation = useNavigation();
  return (
    <Navigator
      drawerContent={(props: any) => <Drawer {...props} />}
      screenOptions={{
        drawerActiveBackgroundColor: '#44A7B9',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          fontSize: 15,
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
            icon={<Icon name="menu" size={24} color="#23475C" />}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
      }}
      initialRouteName="Notification">
      <Screen
        name="Notification"
        component={Notification}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="bell-outline" size={size} color={color} />
          ),
        }}
      />
    </Navigator>
  );
};
