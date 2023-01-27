import React, {useState} from 'react'
import {Alert} from 'react-native'
import {Flex, Box, Text, Modal, Button} from 'native-base'
import {BarCodeReadEvent, RNCamera} from 'react-native-camera'
import BarcodeMask, {LayoutChangeEvent} from 'react-native-barcode-mask'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {useIsFocused} from '@react-navigation/native'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {LoadingAnimated} from '@bluecentury/components'
import {useEntity, useMap} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList>

export default function QRScanner({navigation}: Props) {
  const {t} = useTranslation()
  const {vesselId} = useEntity()
  const {
    isLoadingMap,
    verifyTrackingDeviceToken,
    activeFormations,
    tokenHasConnectedToShip,
  } = useMap()
  const [barcodeType, setBarcodeType] = useState([
    RNCamera.Constants.BarCodeType.qr,
  ])
  const focused = useIsFocused()

  const onBarCodeRead = async (scanResult: BarCodeReadEvent) => {
    // f20e7067-cd68-4808-9a6f-bd12833bcded without ship
    // 108c2f78-32a4-4744-94dd-e9174acf38d5 with ship
    // e69c3bce-ecfa-456b-8ead-292109c89ecd with ship
    // navigation.navigate('Formations')

    if (focused) {
      setBarcodeType([])
      if (
        scanResult.data.includes(
          'https://app.vemasys.eu/deeplink/tracking_device'
        )
      ) {
        const myString =
          'https://app.vemasys.eu/deeplink/tracking_device?static_authenticator_token='
        const staticToken = scanResult.data.substring(
          myString.length,
          scanResult.data.length
        )
        try {
          if (activeFormations.length === 0) {
            verifyTrackingDeviceToken(vesselId, staticToken, 'create')
          } else {
            verifyTrackingDeviceToken(vesselId, staticToken, 'add')
          }
          setTimeout(() => {
            if (!tokenHasConnectedToShip) {
              Alert.alert('Info', 'The QR is not linked to a ship.')
            }
          }, 1000)
          setBarcodeType([RNCamera.Constants.BarCodeType.qr])
          navigation.navigate('Formations')
        } catch {}
      } else {
        Alert.alert('Info', 'The QR code was not recognized.', [
          {
            text: 'OK',
            onPress: () => setBarcodeType([RNCamera.Constants.BarCodeType.qr]),
          },
        ])
      }
    }
  }
  const onLayoutMeasuredHandler = (e: LayoutChangeEvent) => {}

  return (
    <Flex backgroundColor={Colors.black} flex="1">
      <RNCamera
        autoFocus={'on'}
        barCodeTypes={barcodeType}
        captureAudio={false}
        flashMode={RNCamera.Constants.FlashMode.auto}
        style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={onBarCodeRead}
      >
        <BarcodeMask
          backgroundColor="rgba(0, 0, 0, 0.3)"
          edgeBorderWidth={5}
          edgeColor="#fff"
          edgeHeight={40}
          edgeRadius={10}
          edgeWidth={40}
          outerMaskOpacity={0.1}
          showAnimatedLine={false}
          onLayoutMeasured={onLayoutMeasuredHandler}
        />
      </RNCamera>

      <Text
        color="#fff"
        fontSize={ms(25)}
        left={ms(0)}
        position="absolute"
        right={ms(0)}
        textAlign="center"
        top="15%"
      >
        {t('alignFrameToScan')}
      </Text>
      <Box alignItems="center" bottom="20" position="absolute" w="100%">
        <Button
          bg={Colors.primary}
          mb={ms(20)}
          mt={ms(20)}
          w={ms(180)}
          onPress={() => navigation.goBack()}
        >
          {t('cancel')}
        </Button>
      </Box>
      <Modal isOpen={isLoadingMap} justifyContent="center" px={ms(15)}>
        <Modal.Content width="100%">
          <Box
            alignItems="center"
            backgroundColor="#fff"
            borderRadius={ms(15)}
            flexDirection="row"
          >
            <LoadingAnimated />
            <Text fontWeight="medium">{t('processing')}</Text>
          </Box>
        </Modal.Content>
      </Modal>
    </Flex>
  )
}
