import React, {useEffect} from 'react';
import {Text, View, Button} from 'native-base';
import {useAuth} from '@bluecentury/stores';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CommonActions} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function Splash({navigation}: Props) {
  const {token, logout} = useAuth();
  // uncomment below to logout user
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (token) {
      navigation.dispatch(CommonActions.navigate({name: 'Main'}));
    } else {
      navigation.dispatch(CommonActions.navigate({name: 'Login'}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View>
      <Text>test</Text>
    </View>
  );
}
