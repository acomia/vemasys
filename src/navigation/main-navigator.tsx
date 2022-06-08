import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Login, Notification, Splash} from '@bluecentury/screens';
import {DrawerNavigator} from '@bluecentury/navigation';

const {Navigator, Screen} = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <Navigator>
      <Screen name="Splash" component={Splash} />
      <Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
    </Navigator>
  );
};
