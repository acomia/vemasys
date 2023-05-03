/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import {PermissionsAndroid, Platform} from 'react-native'
import {Box, Button, Image, Text, useToast} from 'native-base'
import {Animated} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import DocumentScanner from 'react-native-document-scanner-plugin'
import {useFinancial, usePlanning} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {convertToPdfAndUpload} from '@bluecentury/utils'
import {useTranslation} from 'react-i18next'
import * as ImagePicker from 'react-native-image-picker'

const Scan = () => {
  const {t} = useTranslation()
  const {uploadImgFile, isPlanningLoading} = usePlanning()
  const {isFinancialLoading} = useFinancial()
  const toast = useToast()

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

  const onSelectDocument = async () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 0,
      presentationStyle: 'fullScreen',
    }

    await ImagePicker.launchImageLibrary(options, async response => {
      if (response.assets) {
        try {
          console.log('IMAGE_PICKER_RESPONSE', response)
          Promise.all(
            response?.assets?.map(async item => {
              return await uploadImgFile({
                uri: item.uri,
                fileName: item.fileName,
                type: item.type ? item.type : null,
              })
            })
          ).then(values => {
            console.log('PROMISE_ALL_VALUES', values)
            showToast('File upload successfully', 'success')
          })
        } catch (e) {
          showToast('File upload failed', 'failure')
          console.log('ERROR', JSON.stringify(e))
        }
      }
    })
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
