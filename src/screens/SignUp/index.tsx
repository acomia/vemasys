/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react'
import {Box} from 'native-base'

import {NoInternetConnectionMessage} from '@bluecentury/components'
import {SignupForm1, SignupForm2} from './components'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/Ionicons'
import {useAuth, useUser} from '@bluecentury/stores'
import {Colors} from '@bluecentury/styles'
import {Credentials} from '@bluecentury/models'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {showToast} from '@bluecentury/hooks'

type Props = NativeStackScreenProps<RootStackParamList>
export default function SignUp({navigation}: Props) {
  const {
    registrationStatus,
    user,
    resetStatus,
    getLevelOfNavigationCertificate,
    resetData,
  } = useUser()
  const {authenticate, token} = useAuth()
  const [userCreds, setUserCreds] = useState<Credentials>({
    username: '',
    password: '',
  })
  const [mmsi, setMmsi] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon
          color={Colors.black}
          name="arrow-back"
          size={28}
          style={{marginRight: 10}}
          onPress={onBackHeaderPress}
        />
      ),
    })
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])
  useEffect(() => {
    resetData()
  }, [])
  useEffect(() => {
    if (registrationStatus === 'SUCCESS') {
      authenticate(userCreds)
      setPage(2)
      resetStatus()
    }
    if (registrationStatus === 'FAILED') {
      showToast('Unable to create new user', 'failed')
      resetStatus()
    }
    if (token) {
      getLevelOfNavigationCertificate()
    }
  }, [registrationStatus, token])

  const onBackHeaderPress = () => {
    if (page === 1) navigation.goBack()
    if (page === 2) setPage(1)
  }

  const loginUser = (creds: Credentials, _mmsi: number) => {
    setUserCreds({
      ...userCreds,
      username: creds.username,
      password: creds.password,
    })
    setMmsi(_mmsi)
  }

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      {page === 1 ? (
        <SignupForm1 loginCreds={loginUser} />
      ) : (
        <SignupForm2 mmsi={mmsi} userCreds={userCreds} userInfo={user} />
      )}
    </Box>
  )
}
