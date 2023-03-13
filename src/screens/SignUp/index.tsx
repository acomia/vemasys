import React, {useEffect, useState} from 'react'
import {Box, Text, useToast} from 'native-base'

import {NoInternetConnectionMessage} from '@bluecentury/components'
import {SignupForm1, SignupForm2} from './components'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/Ionicons'
import {useAuth, useUser} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {Credentials} from '@bluecentury/models'

type Props = NativeStackScreenProps<RootStackParamList>
export default function SignUp({navigation}: Props) {
  const toast = useToast()
  const {
    registrationStatus,
    user,
    reset,
    getLevelOfNavigationCertificate,
    entityData,
  } = useUser()
  const {authenticate, token} = useAuth()
  const [userCreds, setUserCreds] = useState<Credentials>({
    username: '',
    password: '',
  })
  const [page, setPage] = useState(1)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon name="arrow-back" size={28} onPress={onBackHeaderPress} />
      ),
    })
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])
  useEffect(() => {
    if (registrationStatus === 'SUCCESS') {
      authenticate(userCreds)
      setPage(2)
      reset()
    }
    if (registrationStatus === 'FAILED') {
      showToast('Unable to create new user', 'failed')
      reset()
    }
    if (token) {
      getLevelOfNavigationCertificate()
    }
  }, [registrationStatus, token])

  console.log('entity', entityData)

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 2000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            color={Colors.white}
            mb={5}
            px="2"
            py="1"
            rounded="sm"
          >
            {text}
          </Text>
        )
      },
    })
  }

  const onBackHeaderPress = () => {
    if (page === 1) navigation.goBack()
    if (page === 2) setPage(1)
  }

  const loginUser = (creds: Credentials) => {
    setUserCreds({
      ...userCreds,
      username: creds.username,
      password: creds.password,
    })
  }

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      {page === 1 ? (
        <SignupForm1 loginCreds={loginUser} />
      ) : (
        <SignupForm2 userCreds={userCreds} userInfo={user} />
      )}
    </Box>
  )
}
