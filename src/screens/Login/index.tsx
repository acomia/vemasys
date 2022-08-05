import React, {useEffect, useRef, useState} from 'react'
import {Platform} from 'react-native'
import {
  Box,
  VStack,
  Text,
  Image,
  FormControl,
  Icon,
  Input,
  Button,
  WarningOutlineIcon,
  Center,
  KeyboardAvoidingView
} from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {TCredentials} from '@bluecentury/api/models'
import {Images} from '@bluecentury/assets'
import {_t} from '@bluecentury/constants'
import {useAuth} from '@bluecentury/stores'
import {CommonActions, useNavigation} from '@react-navigation/native'

const usernameRequired = _t('usernameRequired')
const passwordRequired = _t('passwordRequired')
const allFieldsRequired = _t('allFieldsRequired')
const login = _t('login')

function Login() {
  const navigation = useNavigation()
  const {
    isAuthenticatingUser,
    authenticate,
    token,
    hasAuthenticationError,
    errorMessage
  } = useAuth()
  const [user, setUser] = useState<TCredentials>({username: '', password: ''})
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false)
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)
  const passwordRef = useRef<any>()
  const handleOnPressLogin = () => {
    if (user.username === '' && user.password === '') {
      setIsPasswordEmpty(true)
      setIsUsernameEmpty(true)
      return
    }
    if (user.username === '') {
      return setIsUsernameEmpty(true)
    }
    if (user.password === '') {
      return setIsPasswordEmpty(true)
    }

    authenticate(user)
  }
  const handleOnSubmitEditingPassword = () => handleOnPressLogin()
  useEffect(() => {
    if (token) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Splash'}]
        })
      )
    }
  })
  return (
    <KeyboardAvoidingView
      h={{
        base: '100%',
        lg: 'auto'
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Box flex="1" safeArea>
        <VStack space="10" flex="1" p="5" justifyContent="center">
          <Center>
            <Image
              alt="Company Logo"
              source={Images.logo}
              resizeMode="contain"
            />
          </Center>
          <VStack space="5">
            <Text bold fontSize="2xl" color={Colors.azure}>
              Login to your Account
            </Text>
            <FormControl isInvalid={isUsernameEmpty}>
              <Input
                bg={Colors.white}
                value={user.username}
                onChangeText={text => {
                  setUser({...user, username: text})
                  setIsUsernameEmpty(false)
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
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                _disabled={{bgColor: '#ADADAD'}}
                fontSize={ms(15)}
                size="lg"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current.focus()}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {/* {_t(language, 'usernameRequired')} */}
                {usernameRequired}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={isPasswordEmpty}>
              <Input
                bg={Colors.white}
                ref={passwordRef}
                value={user.password}
                onChangeText={text => {
                  setUser({...user, password: text})
                  setIsPasswordEmpty(false)
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
                        name={
                          isShowPassword ? 'eye-outline' : 'eye-off-outline'
                        }
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
                onSubmitEditing={handleOnSubmitEditingPassword}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {user.username === '' && user.password === ''
                  ? allFieldsRequired
                  : passwordRequired}
              </FormControl.ErrorMessage>
            </FormControl>
            {hasAuthenticationError && (
              <Box bgColor={Colors.danger} p={2} borderRadius="md">
                <Text color={Colors.white}>{errorMessage}</Text>
              </Box>
            )}
          </VStack>
          <Button
            colorScheme="azure"
            isLoadingText="Logging in"
            isLoading={isAuthenticatingUser}
            _spinner={{
              color: Colors.white
            }}
            _text={{
              textTransform: 'uppercase'
            }}
            onPress={handleOnPressLogin}
          >
            {login}
          </Button>
        </VStack>
      </Box>
    </KeyboardAvoidingView>
  )
}

export default Login
