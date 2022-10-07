import React from 'react'
import {Box, Button, Image, Text, useToast} from 'native-base'
import {Animated} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {ms} from 'react-native-size-matters'
import DocumentScanner from 'react-native-document-scanner-plugin'
import RNImageToPdf from 'react-native-image-to-pdf'
import {useFinancial, usePlanning} from '@bluecentury/stores'
import {LoadingAnimated} from "@bluecentury/components";

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

  const convertToPdfAndUpload = async (files: string[]) => {
    // Remove 'file://' from file link is react-native-image-to-pdf requirement
    const arrayForPdf = files.map(item => {
      return item.replace('file://', '')
    })

    const name = `PDF${Date.now()}.pdf`

    // This part converts jpg to pdf and send pdf to backend.
    // Upload has two steps
    //  first is file uploading,
    //  second is creation of connection between uploaded file and certain navlog
    try {
      const options = {
        imagePaths: arrayForPdf,
        name,
      }

      const pdf = await RNImageToPdf.createPDFbyImages(options)

      const file = {
        uri: `file://${pdf.filePath}`,
        type: 'application/pdf',
        fileName: name,
      }

      const upload = await uploadImgFile(file)

      console.log('IMG_UPLOAD_RES', upload)

      if (typeof upload === 'object') {
        const uploadDocs = await addFilesInGroup(upload.path)
        console.log('UPLOAD_DOCS', uploadDocs)
        if (typeof uploadDocs === 'object' && uploadDocs[1] === 200) {
          showToast('File upload successfully.', 'success')
        } else {
          showToast('File upload failed.', 'failed')
        }
      }
    } catch (e) {
      console.log('PDF_ERROR', e)
    }
  }

  const scanDocument = async () => {
    // start the document scanner
    const {scannedImages} = await DocumentScanner.scanDocument()
    await convertToPdfAndUpload(scannedImages)
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
