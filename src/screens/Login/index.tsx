import React, {useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FormControl, Input, Button, WarningOutlineIcon} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '@bluecentury/stores';
import {TCredentials} from '@bluecentury/api/models';

export default function Login() {
  const navigation = useNavigation();
  const {authenticate, isAuthenticatingUser} = useAuth();
  const [user, setUser] = useState<TCredentials>({username: '', password: ''});
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);

  const onUserLogin = () => {
    if (user.username === '' && user.password === '') {
      return setIsPasswordEmpty(true);
    }
    if (user.username === '') {
      return setIsUsernameEmpty(true);
    }
    if (user.password === '') {
      return setIsPasswordEmpty(true);
    }

    authenticate(user);
    // navigation.navigate('DrawerNavigator');
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <View style={loginStyles.content}>
        <Image
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          style={loginStyles.logo}
        />
        <Text style={loginStyles.loginLabel}>Login to your Account</Text>
        <FormControl isInvalid={isUsernameEmpty} mb="5" mt="5">
          <Input
            value={user.username}
            onChangeText={text => {
              setUser({...user, username: text}), setIsUsernameEmpty(false);
            }}
            placeholder="Username"
            InputLeftElement={
              <Icon
                name="person-outline"
                size={20}
                color="#23475C"
                style={{marginLeft: 10}}
              />
            }
            style={{
              color: '#ADADAD',
              fontSize: 15,
            }}
            size="lg"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            A username is required.
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={isPasswordEmpty} mb="4">
          <Input
            value={user.password}
            onChangeText={text => {
              setUser({...user, password: text}), setIsPasswordEmpty(false);
            }}
            type={isShowPassword ? 'text' : 'password'}
            placeholder="Password"
            InputLeftElement={
              <Icon
                name="lock-open-outline"
                size={20}
                color="#23475C"
                style={{marginLeft: 10}}
              />
            }
            InputRightElement={
              <Icon
                name={isShowPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#23475C"
                style={{marginRight: 10}}
                onPress={() => setIsShowPassword(!isShowPassword)}
              />
            }
            style={{
              color: '#ADADAD',
              fontSize: 15,
            }}
            size="lg"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {user.username === '' && user.password === ''
              ? 'Please fill in all required fields.'
              : 'A password is required.'}
          </FormControl.ErrorMessage>
        </FormControl>
        <Button marginTop="1/6" backgroundColor="#44A7B9" onPress={onUserLogin}>
          LOGIN
        </Button>
      </View>
    </SafeAreaView>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 312,
    height: 77,
    alignSelf: 'center',
    marginBottom: '20%',
  },
  loginLabel: {fontSize: 22, fontWeight: '600', color: '#23475C'},
});
