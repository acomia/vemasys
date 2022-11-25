import React, {useState} from 'react'
import {PermissionsAndroid, Platform} from 'react-native'
import {Box, Button, Image, Text, useDisclose, useToast} from 'native-base'
import {Animated} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import DocumentScanner from 'react-native-document-scanner-plugin'
import {useFinancial, usePlanning} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {convertToPdfAndUpload} from '@bluecentury/utils'
import DocumentPicker, {isInProgress, types} from 'react-native-document-picker'

const Scan = () => {
  const {uploadImgFile} = usePlanning()
  const {addFilesInGroup, isFinancialLoading} = useFinancial()
  const {isOpen, onOpen, onClose} = useDisclose()
  const toast = useToast()
  const [result, setResult] = useState<ImageFile>({})

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera")
      } else {
        console.log("Camera permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 1000,
      render: () => {
        return (
          <Text
            bg={res === 'success' ? 'emerald.500' : 'red.500'}
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            color={Colors.white}
          >
            {text}
          </Text>
        )
      },
    })
  }

  const scanDocument = async () => {
    // start the document scanner
    if (Platform.OS === 'android') {
      await requestCameraPermission()
    }
    const {scannedImages} = await DocumentScanner.scanDocument()
    await convertToPdfAndUpload(scannedImages, showToast)
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

  const onSelectDocument = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.images],
      })
      onClose()
      setResult({
        uri: pickerResult.uri,
        fileName: pickerResult.name,
        type: pickerResult.type,
      })
      const upload = await uploadImgFile({
        uri: pickerResult.uri,
        fileName: pickerResult.name,
        type: pickerResult.type,
      })
      console.log('IMG_UPLOAD', upload)
    } catch (e) {
      handleError(e)
    }
  }

  if (isFinancialLoading) return <LoadingAnimated />

  return (
    <Box flex="1" bg={Colors.white} px={ms(12)} py={ms(20)}>
      <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
        Scan Invoice
      </Text>
      <Image
        alt="Financial-invoice-logo"
        source={Animated.invoice}
        style={{
          width: 224,
          height: 229,
          alignSelf: 'center'
        }}
        my={ms(20)}
        resizeMode="contain"
      />
      <Button bg={Colors.primary} size="md" onPress={() => onSelectDocument()}>
        Upload image
      </Button>
      <Text
        style={{
          fontSize: 16,
          color: '#ADADAD',
          fontWeight: '700',
          marginVertical: 30,
          textAlign: 'center'
        }}
      >
        or
      </Text>
      <Button
        bg={Colors.primary}
        size="md"
        onPress={() => scanDocument()}
      >
        Open camera
      </Button>
    </Box>
  )
}

export default Scan
