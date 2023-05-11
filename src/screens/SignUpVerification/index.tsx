/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import {PermissionsAndroid, Platform} from 'react-native'
import {Text, useDisclose, useToast} from 'native-base'
import DocumentPicker, {isInProgress, types} from 'react-native-document-picker'
import DocumentScanner from 'react-native-document-scanner-plugin'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/Ionicons'

import {useUser} from '@bluecentury/stores'
import {Selfie, UploadDocs, UploadID} from './components'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {Colors} from '@bluecentury/styles'

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpVerification'>
export default function SignUpVerification({navigation, route}: Props) {
  const toast = useToast()
  const {signUpInfo}: any = route.params
  const {
    createSignupRequestForCurrentUser,
    signupRequestStatus,
    updateUserData,
    resetStatus,
  } = useUser()
  const [page, setPage] = useState(1)
  const [documentFile, setDocumentFile] = useState<ImageFile | string>('')
  const [signUpDocs, setSignUpDocs] = useState([])
  const {onClose} = useDisclose()

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
  }, [])

  useEffect(() => {
    if (page === 1 && documentFile !== '') {
      setSignUpDocs((prevS: any) => {
        return [
          ...prevS,
          {
            icon: {
              path: documentFile.uri,
              description: `Selfie of ${signUpInfo.firstname} ${signUpInfo.lastname}`,
            },
          },
        ]
      })
    }
    if (page === 2 && documentFile !== '') {
      setSignUpDocs((prevS: any) => {
        return [
          ...prevS,
          {
            identificationDocument: {
              path: documentFile.uri,
              description: `ID of ${signUpInfo.firstname} ${signUpInfo.lastname}`,
            },
          },
        ]
      })
    }
    if (page === 3 && documentFile !== '') {
      setSignUpDocs((prevS: any) => {
        return [
          ...prevS,
          {
            tonnageCertificate: {
              path: documentFile.uri,
              description: `Tonnage certificate of ${signUpInfo.mmsi}`,
            },
          },
        ]
      })
    }
  }, [documentFile])

  useEffect(() => {
    if (signupRequestStatus === 'SUCCESS') {
      resetStatus()
      navigation.navigate('SignUpFinish', {email: signUpInfo.email})
    }
    if (signupRequestStatus === 'FAILED') {
      showToast('Unable to create sign up request.', 'failed')
      resetStatus()
    }
  }, [signupRequestStatus])

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
    switch (page) {
      case 1:
        return navigation.goBack()
      case 2:
        return setPage(1)
      case 3:
        return setPage(2)
      default:
        break
    }
  }

  const onSelfieProceed = () => {
    setPage(2)
    setDocumentFile('')
  }
  const onUploadIDProceed = () => {
    setPage(3)
    setDocumentFile('')
    updateUserData(signUpInfo, signUpDocs)
  }

  const onFinishVerification = () => {
    createSignupRequestForCurrentUser(signUpInfo, signUpDocs)
  }

  const renderScreen = () => {
    switch (page) {
      case 1:
        return (
          <Selfie onProceed={onSelfieProceed} onTakeSelfie={onTakeSelfie} />
        )
      case 2:
        return (
          <UploadID
            file={documentFile}
            onOpenCam={scanDocument}
            onProceed={onUploadIDProceed}
            onUploadNew={onSelectDocument}
          />
        )
      case 3:
        return (
          <UploadDocs
            file={documentFile}
            onFinish={onFinishVerification}
            onOpenCam={scanDocument}
            onUploadNew={onSelectDocument}
          />
        )
      default:
        break
    }
  }

  const onTakeSelfie = async (file: ImageFile) => {
    setDocumentFile({
      uri: file.uri,
      fileName: file.fileName,
      type: file.type,
    })
  }

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera')
      } else {
        console.log('Camera permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const scanDocument = async () => {
    // start the document scanner
    if (Platform.OS === 'android') {
      await requestCameraPermission()
    }
    const {scannedImages} = await DocumentScanner.scanDocument()
    const arrFromPath = scannedImages[0]?.split('/')
    const fileName = arrFromPath[arrFromPath.length - 1]
    setDocumentFile({
      uri: scannedImages[0],
      fileName: fileName,
      type: 'image/jpeg',
    })
  }

  const onSelectDocument = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.images],
      })
      onClose()
      setDocumentFile({
        uri: pickerResult.uri,
        fileName: pickerResult.name,
        type: pickerResult.type,
      })
    } catch (e) {
      handleError(e)
    }
  }

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered'
      )
    } else {
      throw err
    }
  }

  return renderScreen()
}
