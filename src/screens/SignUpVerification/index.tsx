/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import {PermissionsAndroid, Platform} from 'react-native'
import {useDisclose} from 'native-base'
import DocumentPicker, {isInProgress, types} from 'react-native-document-picker'
import DocumentScanner from 'react-native-document-scanner-plugin'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

import {useEntity} from '@bluecentury/stores'
import {Selfie, SignUpFinish, UploadDocs, UploadID} from './components'

type Props = NativeStackScreenProps<RootStackParamList>
export default function SignUpVerification({navigation, route}: Props) {
  const {signUpInfo, requestAsOwner}: any = route.params
  const {createSignUpRequest, signUpRequestStatus, reset} = useEntity()
  const [page, setPage] = useState(1)
  const [documentFile, setDocumentFile] = useState<ImageFile | string>('')
  const [signUpDocs, setSignUpDocs] = useState([])
  const {onClose} = useDisclose()

  useEffect(() => {
    if (requestAsOwner) setPage(3)
  }, [requestAsOwner])

  useEffect(() => {
    if (page === 1 && documentFile !== '') {
      setSignUpDocs((prevS: any) => {
        return [
          ...prevS,
          {
            userIdentificationDocument: {
              path: documentFile.uri,
              description: `ID of ${signUpInfo.firstName} ${signUpInfo.lastName}`,
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
    if (signUpRequestStatus === 'SUCCESS') {
      setPage(3)
    }
  }, [signUpRequestStatus])

  const onUploadIDProceed = () => {
    setPage(2)
    setDocumentFile('')
  }

  const onFinishVerification = () => {
    createSignUpRequest(signUpInfo, signUpDocs)
  }

  const onBackToLogin = () => {
    setPage(1)
    reset()
    navigation.navigate('Login')
  }

  const renderScreen = () => {
    switch (page) {
      // case 1:
      //   return <Selfie onProceed={() => setPage(2)} />
      case 1:
        return (
          <UploadID
            file={documentFile}
            onOpenCam={scanDocument}
            onProceed={onUploadIDProceed}
            onUploadNew={onSelectDocument}
          />
        )
      case 2:
        return (
          <UploadDocs
            file={documentFile}
            onFinish={onFinishVerification}
            onOpenCam={scanDocument}
            onUploadNew={onSelectDocument}
          />
        )
      case 3:
        return (
          <SignUpFinish email={signUpInfo.email} onProceed={onBackToLogin} />
        )
      default:
        break
    }
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
      console.log({
        uri: pickerResult.uri,
        fileName: pickerResult.name,
        type: pickerResult.type,
      })

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
