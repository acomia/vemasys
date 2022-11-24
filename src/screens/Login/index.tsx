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
  KeyboardAvoidingView,
  HStack,
  Checkbox,
} from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {ms} from 'react-native-size-matters'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import * as Keychain from 'react-native-keychain'
import {Colors} from '@bluecentury/styles'
import {Credentials} from '@bluecentury/models'
import {Images} from '@bluecentury/assets'
import {_t} from '@bluecentury/constants'
import {useAuth, useSettings} from '@bluecentury/stores'
import {VersionBuildLabel} from '@bluecentury/components/version-build-label'

const usernameRequired = _t('usernameRequired')
const passwordRequired = _t('passwordRequired')
const allFieldsRequired = _t('allFieldsRequired')
const login = _t('login')

export default function Login() {
  const insets = useSafeAreaInsets()
  const {isAuthenticatingUser, authenticate, hasAuthenticationError} = useAuth()
  const {isRemainLoggedIn, setIsRemainLoggedIn} = useSettings()
  const [user, setUser] = useState<Credentials>({username: '', password: ''})
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false)
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)
  const passwordRef = useRef<any>()
  const userNameRef = useRef<any>()

  const handleOnPressLogin = () => {
    userNameRef.current.blur()
    passwordRef.current.blur()
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
    Keychain.getGenericPassword()
      .then(credentials => {
        if (credentials) {
          const {username, password} = credentials
          setUser({username: username, password: password})
        }
      })
      .catch(error => {
        console.log('Error: ', error)
      })
  }, [])

  return (
    <Box flex="1" safeArea>
      <KeyboardAvoidingView
        h={{
          base: '100%',
          lg: 'auto',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
            <FormControl isInvalid={isUsernameEmpty || hasAuthenticationError}>
              <Input
                ref={userNameRef}
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
                {hasAuthenticationError ? '' : usernameRequired}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={isPasswordEmpty || hasAuthenticationError}>
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
                {hasAuthenticationError
                  ? 'Either your username or your password is incorrect'
                  : user.username === '' && user.password === ''
                  ? allFieldsRequired
                  : passwordRequired}
              </FormControl.ErrorMessage>
            </FormControl>
            <HStack justifyContent="flex-end">
              <Checkbox
                isChecked={isRemainLoggedIn}
                onChange={v => setIsRemainLoggedIn(v)}
                value="remain-logged-in"
              >
                Remain logged in?
              </Checkbox>
            </HStack>
          </VStack>
          <Button
            colorScheme="azure"
            isLoadingText="Logging in"
            isLoading={isAuthenticatingUser}
            _spinner={{
              color: Colors.white,
            }}
            _text={{
              textTransform: 'uppercase',
            }}
            onPress={handleOnPressLogin}
          >
            {login}
          </Button>
        </VStack>
      </KeyboardAvoidingView>
      <Box position="absolute" bottom={0} left={0} right={0} safeAreaBottom>
        <Center pb={insets.bottom > 0 ? 0 : 5}>
          <VersionBuildLabel />
        </Center>
      </Box>
    </Box>
  )
}
