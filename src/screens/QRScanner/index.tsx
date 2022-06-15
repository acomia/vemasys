import React, {useRef, useState} from 'react'
import {Alert, TouchableOpacity} from 'react-native'
import {Flex, Box, Text, Modal} from 'native-base'
import {BarCodeReadEvent, RNCamera} from 'react-native-camera'
import BarcodeMask, {LayoutChangeEvent} from 'react-native-barcode-mask'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {LoadingIndicator} from '@bluecentury/components'

type Props = NativeStackScreenProps<RootStackParamList>

export default function QRScanner({navigation}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [viewFocused, setViewFocused] = useState(null)
  const [barcodeType, setBarcodeType] = useState([
    RNCamera.Constants.BarCodeType.qr
  ])

  const onBarCodeRead = async (scanResult: BarCodeReadEvent) => {
    // f20e7067-cd68-4808-9a6f-bd12833bcded without ship
    // 108c2f78-32a4-4744-94dd-e9174acf38d5 with ship
    // e69c3bce-ecfa-456b-8ead-292109c89ecd with ship
    if (viewFocused) {
      setIsLoading(true)
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
        // try {
        //   if (this.props.formations_data.length == 0) {
        //     await Promise.all([this.props.verifyToken(this.props.selectedVesselId, staticToken, 'create')])
        //   } else {
        //     await Promise.all([this.props.verifyToken(this.props.formations_data[0]?.id, staticToken, 'add')])
        //   }
        //   setTimeout(() => {
        //     if (!this.props.tokenLegit) {
        //       Alert.alert('Info', 'The QR is not linked to a ship.')
        //     }
        //   }, 1000)
        //   setIsLoading(false)
        //   setBarcodeType([RNCamera.Constants.BarCodeType.qr])
        //   // Actions.Formations()
        // } catch {}
      } else {
        setIsLoading(false)
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
        onBarCodeRead={e => onBarCodeRead(e)}
        barCodeTypes={barcodeType}>
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
        color="#fff">
        Align the QR within the frame to scan
      </Text>
      <TouchableOpacity
        testID="qrcode-back-button"
        onPress={() => navigation.goBack()}
        style={{position: 'absolute', left: 10, top: 20}}>
        <Icon name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <Modal isOpen={isLoading} justifyContent="center">
        <Box
          padding={ms(20)}
          backgroundColor="#fff"
          borderRadius={ms(15)}
          flexDirection="row"
          alignItems="center">
          <Modal.Body>
            <LoadingIndicator />
            <Text fontWeight="medium" ml={ms(5)}>
              Processing...
            </Text>
          </Modal.Body>
        </Box>
      </Modal>
    </Flex>
  )
}
