import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  Text,
  Image,
  FormControl,
  Icon,
  Input,
  Button,
  WarningOutlineIcon,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ms} from 'react-native-size-matters';
import {Colors} from '@bluecentury/styles';
import {useAuth} from '@bluecentury/stores';
import {TCredentials} from '@bluecentury/api/models';
import {Images} from '@bluecentury/assets';
import {_t} from '@bluecentury/constants';

type Props = NativeStackScreenProps<RootStackParamList>;

export default function Login({navigation}: Props) {
  const {authenticate, isAuthenticatingUser, token} = useAuth();
  useEffect(() => {
    if (token) {
      navigation.navigate('SelectEntity');
    }
  }, [navigation, token]);

  const [user, setUser] = useState<TCredentials>({username: '', password: ''});
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);

  const onUserLogin = () => {
    if (user.username === '' && user.password === '') {
      setIsPasswordEmpty(true);
      setIsUsernameEmpty(true);
      return;
    }
    if (user.username === '') {
      return setIsUsernameEmpty(true);
    }
    if (user.password === '') {
      return setIsPasswordEmpty(true);
    }

    authenticate(user);
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <View style={loginStyles.content}>
        <TouchableOpacity activeOpacity={1}>
          <Image
            alt="Company Logo"
            source={Images.logo}
            resizeMode="contain"
            style={loginStyles.logo}
          />
        </TouchableOpacity>
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
                as={<Ionicons name="person-outline" />}
                size={ms(20)}
                color={Colors.azure}
                marginLeft={ms(10)}
              />
            }
            _disabled={{bgColor: '#ADADAD'}}
            fontSize={ms(15)}
            size="lg"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {_t('usernameRequired')}
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
                as={<Ionicons name="lock-open-outline" />}
                size={ms(20)}
                color="#23475C"
                marginLeft={ms(10)}
              />
            }
            InputRightElement={
              <Icon
                as={
                  <Ionicons
                    name={isShowPassword ? 'eye-outline' : 'eye-off-outline'}
                  />
                }
                size={ms(20)}
                color={Colors.azure}
                marginRight={ms(10)}
                onPress={() => setIsShowPassword(!isShowPassword)}
              />
            }
            fontSize={ms(15)}
            color={Colors.disabled}
            size="lg"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {user.username === '' && user.password === ''
              ? _t('usernamePasswordRequired')
              : _t('passwordRequired')}
          </FormControl.ErrorMessage>
        </FormControl>
        <Button
          marginTop="1/6"
          colorScheme="azure"
          onPress={onUserLogin}
          isLoading={isAuthenticatingUser}
          _loading={<ActivityIndicator size="small" />}>
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
