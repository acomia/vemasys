import React from 'react'
import {Box, Button, Image, Text, useToast} from 'native-base'
import {Animated} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import DocumentScanner from 'react-native-document-scanner-plugin'
import {useFinancial, usePlanning} from '@bluecentury/stores'
import {LoadingAnimated} from '@bluecentury/components'
import {convertToPdfAndUpload} from '@bluecentury/utils'

const Scan = () => {
  const {uploadImgFile} = usePlanning()
  const {addFilesInGroup, isFinancialLoading} = useFinancial()
  const toast = useToast()

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
    const {scannedImages} = await DocumentScanner.scanDocument()
    await convertToPdfAndUpload(scannedImages, showToast)
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
      <Button bg={Colors.primary} size="md">
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
