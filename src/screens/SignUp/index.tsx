/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react'
import {Box, Button, ScrollView} from 'native-base'
import {useTranslation} from 'react-i18next'
import {ms} from 'react-native-size-matters'
import {Shadow} from 'react-native-shadow-2'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {Colors} from '@bluecentury/styles'
import {_t} from '@bluecentury/constants'
import {useEntity} from '@bluecentury/stores'
import {NoInternetConnectionMessage} from '@bluecentury/components'
import SignUpForm1 from './components/SignupForm1'
import SignUpForm2 from './components/SignupForm2'

type Props = NativeStackScreenProps<RootStackParamList>
export default function SignUp({navigation}: Props) {
  const {t} = useTranslation()
  const {createSignUpRequest, isLoadingSignUpRequest} = useEntity()

  const [page, setPage] = useState(1)

  const onNextFormSubmit = () => {
    if (page === 1) setPage(2)
  }

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />

      {page === 1 ? (
        <SignUpForm1 next={onNextFormSubmit} />
      ) : (
        <SignUpForm2 next={onNextFormSubmit} />
      )}
    </Box>
  )
}
