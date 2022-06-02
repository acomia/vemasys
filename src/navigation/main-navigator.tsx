import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Splash} from '@bluecentury/screens';

const {Navigator, Screen} = createNativeStackNavigator();

export const MainNavigator = () => {
  return (
    <Navigator>
      <Screen name="Splash" component={Splash} />
    </Navigator>
  );
};
