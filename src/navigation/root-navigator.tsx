import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login, Splash} from '@bluecentury/screens';
import MainNavigator from './main-navigator';

const {Navigator, Screen} = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
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
        name="Main"
        component={MainNavigator}
        options={{headerShown: false}}
      />
    </Navigator>
  );
}
