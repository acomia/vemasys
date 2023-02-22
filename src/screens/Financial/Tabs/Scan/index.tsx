/* eslint-disable react-native/no-inline-styles */
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
import {useTranslation} from 'react-i18next'

const Scan = () => {
  const {t} = useTranslation()
  const {uploadImgFile, isPlanningLoading} = usePlanning()
  const {isFinancialLoading} = useFinancial()
  const {onClose} = useDisclose()
  const toast = useToast()
  const [result, setResult] = useState<ImageFile | null>(null)

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

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 1000,
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

  const scanDocument = async () => {
    // start the document scanner
    if (Platform.OS === 'android') {
      await requestCameraPermission()
    }
    const {scannedImages} = await DocumentScanner.scanDocument()
    if (scannedImages) {
      await convertToPdfAndUpload(scannedImages, showToast)
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
      if (typeof upload === 'object') {
        showToast('File upload successfully', 'success')
      }
    } catch (e) {
      handleError(e)
    }
  }

  if (isFinancialLoading || isPlanningLoading) return <LoadingAnimated />

  return (
    <Box bg={Colors.white} flex="1" px={ms(12)} py={ms(20)}>
      <Text bold color={Colors.azure} fontSize={ms(20)}>
        {t('scanInvoice')}
      </Text>
      <Image
        style={{
          width: 224,
          height: 229,
          alignSelf: 'center',
        }}
        alt="Financial-invoice-logo"
        my={ms(20)}
        resizeMode="contain"
        source={Animated.invoice}
      />
      <Button bg={Colors.primary} size="md" onPress={() => onSelectDocument()}>
        {t('uploadImage')}
      </Button>
      <Text
        style={{
          fontSize: 16,
          color: '#ADADAD',
          fontWeight: '700',
          marginVertical: 30,
          textAlign: 'center',
        }}
      >
        {t('or')}
      </Text>
      <Button bg={Colors.primary} size="md" onPress={() => scanDocument()}>
        {t('openCamera')}
      </Button>
    </Box>
  )
}

export default Scan
