import React, {useRef, useState} from 'react'
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
  Center
} from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {ms} from 'react-native-size-matters'
import {Colors} from '@bluecentury/styles'
import {TCredentials} from '@bluecentury/api/models'
import {Images} from '@bluecentury/assets'
import {_t} from '@bluecentury/constants'
import {useAuth} from '@bluecentury/stores'

const usernameRequired = _t('usernameRequired')
const passwordRequired = _t('passwordRequired')
const usernamePasswordRequired = _t('usernamePasswordRequired')
const login = _t('login')

function Login() {
  const {isAuthenticatingUser, authenticate} = useAuth()
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
  return (
    <Box flex="1" safeArea>
      <VStack space="10" flex="1" p="5" justifyContent="center">
        <Center>
          <Image alt="Company Logo" source={Images.logo} resizeMode="contain" />
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
              onSubmitEditing={handleOnSubmitEditingPassword}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {user.username === '' && user.password === ''
                ? usernamePasswordRequired
                : passwordRequired}
            </FormControl.ErrorMessage>
          </FormControl>
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
  )
}

export default Login
