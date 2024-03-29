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
import {useAuth, useSettings, useEntity} from '@bluecentury/stores'
import {VersionBuildLabel} from '@bluecentury/components/version-build-label'
import {useTranslation} from 'react-i18next'
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native'
import {NoInternetConnectionMessage} from '@bluecentury/components'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

export default function Login() {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const isFocused = useIsFocused()
  const {entityId} = useEntity()
  const {isAuthenticatingUser, authenticate, hasAuthenticationError, token} =
    useAuth()
  const {rememberMe, setRememberMe} = useSettings()
  const [user, setUser] = useState<Credentials>({username: '', password: ''})
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false)
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)
  const passwordRef = useRef<any>()
  const userNameRef = useRef<any>()
  const usernameRequired = t('usernameRequired')
  const passwordRequired = t('passwordRequired')
  const allFieldsRequired = t('allFieldsRequired')

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

  useEffect(() => {
    if (isFocused) {
      if (!token) {
        navigation.navigate('Login')
        return
      }
      // no entity selected
      if (!entityId) {
        navigation.navigate('SelectEntity')
        return
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, entityId, isFocused])

  return (
    <Box safeArea flex="1">
      <NoInternetConnectionMessage />
      <KeyboardAvoidingView
        h={{
          base: '100%',
          lg: 'auto',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VStack flex="1" justifyContent="center" p="5" space="10">
          <Center>
            <Image
              alt="Company Logo"
              resizeMode="contain"
              source={Images.logo}
            />
          </Center>
          <VStack space="5">
            <Text bold color={Colors.azure} fontSize="2xl">
              {t('loginHeader')}
            </Text>
            <FormControl isInvalid={isUsernameEmpty || hasAuthenticationError}>
              <Input
                ref={userNameRef}
                InputLeftElement={
                  <Icon
                    as={<Ionicons name="person-outline" />}
                    color={Colors.azure}
                    marginLeft={ms(10)}
                    size={ms(20)}
                  />
                }
                _disabled={{bgColor: '#ADADAD'}}
                autoCapitalize="none"
                autoCorrect={false}
                bg={Colors.white}
                fontSize={ms(15)}
                keyboardType="email-address"
                placeholder="Username"
                returnKeyType="next"
                size="lg"
                value={user.username}
                onChangeText={text => {
                  setUser({...user, username: text})
                  setIsUsernameEmpty(false)
                }}
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
                ref={passwordRef}
                InputLeftElement={
                  <Icon
                    as={<Ionicons name="lock-open-outline" />}
                    color="#23475C"
                    marginLeft={ms(10)}
                    size={ms(20)}
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
                    color={Colors.azure}
                    marginRight={ms(10)}
                    size={ms(20)}
                    onPress={() => setIsShowPassword(!isShowPassword)}
                  />
                }
                bg={Colors.white}
                color={Colors.disabled}
                fontSize={ms(15)}
                placeholder="Password"
                size="lg"
                type={isShowPassword ? 'text' : 'password'}
                value={user.password}
                onChangeText={text => {
                  setUser({...user, password: text})
                  setIsPasswordEmpty(false)
                }}
                onSubmitEditing={handleOnSubmitEditingPassword}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {hasAuthenticationError
                  ? t('wrongCredentials')
                  : user.username === '' && user.password === ''
                  ? allFieldsRequired
                  : passwordRequired}
              </FormControl.ErrorMessage>
            </FormControl>
            <HStack justifyContent="flex-end">
              <Checkbox
                isChecked={rememberMe}
                value="remain-logged-in"
                onChange={v => setRememberMe(v)}
              >
                {t('rememberMe')}
              </Checkbox>
            </HStack>
          </VStack>
          <Button
            _spinner={{
              color: Colors.white,
            }}
            _text={{
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: 16,
            }}
            colorScheme="azure"
            isLoading={isAuthenticatingUser}
            isLoadingText="Logging in"
            onPress={handleOnPressLogin}
          >
            {t('login')}
          </Button>
          <HStack alignItems="center" justifyContent="center" mt={ms(15)}>
            <Text bold color={Colors.text} fontSize={15}>
              {t('dontHaveAnAcct')}?
            </Text>
            <Button
              _text={{
                fontWeight: 'bold',
                fontSize: 15,
                textDecorationLine: 'underline',
              }}
              size="lg"
              variant="link"
              onPress={() => navigation.navigate('SignUp')}
            >
              {t('signUp')}
            </Button>
          </HStack>
        </VStack>
      </KeyboardAvoidingView>
      <Box safeAreaBottom bottom={0} left={0} position="absolute" right={0}>
        <Center pb={insets.bottom > 0 ? 0 : 5}>
          <VersionBuildLabel hideVersionName={true} />
        </Center>
      </Box>
    </Box>
  )
}
