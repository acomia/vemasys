import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login, Splash, Entity} from '@bluecentury/screens';
import MainNavigator from './main-navigator';

const {Navigator, Screen} = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Navigator screenOptions={{headerShadowVisible: false}}>
      <Screen name="Splash" component={Splash} />
      <Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="SelectEntity"
        component={Entity}
        options={{
          title: 'Select your role',
          headerStyle: {backgroundColor: '#F0F0F0'},
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
