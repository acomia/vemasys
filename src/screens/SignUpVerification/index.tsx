import React, {useRef, useState} from 'react'
import {Box, Button, Icon} from 'native-base'
import {Selfie, SignUpFinish, UploadDocs, UploadID} from './components'
import {Colors} from '@bluecentury/styles'
import Fontisto from 'react-native-vector-icons/Fontisto'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<RootStackParamList>
export default function SignUpVerification({navigation, route}: Props) {
  const [page, setPage] = useState(1)

  const renderScreen = () => {
    switch (page) {
      case 1:
        return <Selfie onProceed={() => setPage(2)} />
      case 2:
        return <UploadID onProceed={() => setPage(3)} />
      case 3:
        return <UploadDocs onProceed={() => setPage(4)} />
      case 4:
        return <SignUpFinish navigation={navigation} route={route} />
      default:
        break
    }
  }

  return renderScreen()
}
