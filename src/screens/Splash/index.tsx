import React, {useEffect} from 'react';
import {Text, View, Button} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Splash() {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => navigation.navigate('Login'), 2000);
  }, []);
  return (
    <View>
      <Text>test</Text>
    </View>
  );
}
