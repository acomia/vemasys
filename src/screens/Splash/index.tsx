import React from 'react';
import {Text, View} from 'native-base';
import {API_URL} from '@bluecentury/env';

export default function Splash() {
  return (
    <View>
      <Text>{API_URL}</Text>
    </View>
  );
}
