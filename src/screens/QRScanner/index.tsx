import React, {useEffect, useRef, useState} from 'react'
import {Alert, TouchableOpacity} from 'react-native'
import {Flex, Box, Text, Modal} from 'native-base'
import {BarCodeReadEvent, RNCamera} from 'react-native-camera'
import BarcodeMask, {LayoutChangeEvent} from 'react-native-barcode-mask'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {useIsFocused} from '@react-navigation/native'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {LoadingIndicator} from '@bluecentury/components'
import {useEntity, useMap} from '@bluecentury/stores'

type Props = NativeStackScreenProps<RootStackParamList>

export default function QRScanner({navigation}: Props) {
  const {vesselId} = useEntity()
  const {
    isLoadingMap,
    verifyTrackingDeviceToken,
    activeFormations,
    tokenHasConnectedToShip
  } = useMap()
  const [barcodeType, setBarcodeType] = useState([
    RNCamera.Constants.BarCodeType.qr
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
        Alert.alert('Info', 'The QR code was not recognized.')
        setTimeout(() => {
          setBarcodeType([RNCamera.Constants.BarCodeType.qr])
        }, 1000)
      }
    }
  }
  const onLayoutMeasuredHandler = (e: LayoutChangeEvent) => {}

  return (
    <Flex flex={1} backgroundColor={Colors.black}>
      <RNCamera
        style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        autoFocus={'on'}
        onBarCodeRead={onBarCodeRead}
        barCodeTypes={barcodeType}
      >
        <BarcodeMask
          backgroundColor="rgba(0, 0, 0, 0.3)"
          edgeBorderWidth={5}
          showAnimatedLine={false}
          edgeRadius={10}
          edgeColor="#fff"
          edgeWidth={40}
          edgeHeight={40}
          outerMaskOpacity={0.1}
          onLayoutMeasured={onLayoutMeasuredHandler}
        />
      </RNCamera>

      <Text
        position="absolute"
        top="15%"
        left={ms(0)}
        right={ms(0)}
        textAlign="center"
        fontSize={ms(25)}
        color="#fff"
      >
        Align the QR within the frame to scan
      </Text>
      <TouchableOpacity
        testID="qrcode-back-button"
        onPress={() => navigation.goBack()}
        style={{position: 'absolute', left: 10, top: 20}}
      >
        <Icon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <Modal isOpen={isLoadingMap} justifyContent="center" px={ms(15)}>
        <Modal.Content width="100%">
          <Box
            backgroundColor="#fff"
            borderRadius={ms(15)}
            flexDirection="row"
            alignItems="center"
          >
            <LoadingIndicator />
            <Text fontWeight="medium">Processing...</Text>
          </Box>
        </Modal.Content>
      </Modal>
    </Flex>
  )
}
