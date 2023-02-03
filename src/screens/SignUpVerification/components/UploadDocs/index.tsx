/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react'
import {PermissionsAndroid, Platform} from 'react-native'
import {
  Box,
  Button,
  Divider,
  Image,
  ScrollView,
  Text,
  useDisclose,
} from 'native-base'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import {Shadow} from 'react-native-shadow-2'
import DocumentPicker, {isInProgress, types} from 'react-native-document-picker'
import DocumentScanner from 'react-native-document-scanner-plugin'
import {Images} from '@bluecentury/assets'
interface IUploadID {
  onProceed: () => void
}
export default function UploadDocs({onProceed}: IUploadID) {
  const [documentFile, setDocumentFile] = useState<ImageFile>({})
  const {isOpen, onOpen, onClose} = useDisclose()

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
    console.log(scannedImages)

    // await convertToPdfAndUpload(scannedImages, showToast)
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
      // const upload = await uploadImgFile({
      //   uri: pickerResult.uri,
      //   fileName: pickerResult.name,
      //   type: pickerResult.type,
      // })
      console.log('DOC_UPLOAD', {
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

  return (
    <Box bg={Colors.white} flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: ms(16)}}
        showsVerticalScrollIndicator={false}
      >
        <Text
          bold
          color={Colors.primary}
          fontSize={ms(18)}
          my={ms(40)}
          textAlign="center"
        >
          Upload a document for proof of vessel ownership
        </Text>
        <Shadow
          corners={['bottomLeft', 'bottomRight']}
          distance={5}
          sides={['bottom', 'right']}
          viewStyle={{width: '100%', borderRadius: 5}}
        >
          <Box
            borderColor={Colors.light}
            borderRadius={5}
            borderWidth={1}
            px={ms(14)}
            py={ms(10)}
          >
            <Text bold color={Colors.text} fontSize={16}>
              Identification Document
            </Text>
            <Divider bg={Colors.light} my={ms(10)} />
            <Image
              alt="selfie"
              h={250}
              mb={ms(10)}
              resizeMode="cover"
              source={Images.signup_sample_docs}
              w="100%"
            />
          </Box>
        </Shadow>
        <Button
          _text={{
            fontWeight: 'bold',
            fontSize: 16,
            color: Colors.primary,
          }}
          bg={Colors.light}
          mt={ms(30)}
          size="md"
          onPress={onSelectDocument}
        >
          Upload new
        </Button>
        <Button
          _text={{
            fontWeight: 'bold',
            fontSize: 16,
            color: Colors.primary,
          }}
          bg={Colors.light}
          mt={ms(15)}
          size="md"
          onPress={scanDocument}
        >
          Open camera
        </Button>
      </ScrollView>
      <Box bg={Colors.white}>
        <Shadow distance={8} viewStyle={{width: '100%'}}>
          <Button
            _text={{
              fontWeight: 'bold',
              fontSize: 16,
            }}
            bg={Colors.primary}
            m={ms(16)}
            size="md"
            onPress={onProceed}
          >
            Finish
          </Button>
        </Shadow>
      </Box>
    </Box>
  )
}
