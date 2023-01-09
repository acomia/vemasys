import React, {useState, useEffect} from 'react'
import {
  Actionsheet,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Modal,
  ScrollView,
  Text,
  useDisclose,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {NavigationProp, useNavigation, useRoute} from '@react-navigation/native'
import {Colors} from '@bluecentury/styles'
import {usePlanning, useSettings} from '@bluecentury/stores'
import {IconButton, LoadingAnimated} from '@bluecentury/components'
import DocumentPicker, {isInProgress, types} from 'react-native-document-picker'
import {Icons} from '@bluecentury/assets'
import {RefreshControl} from 'react-native'
import moment from 'moment'
import DocumentScanner from 'react-native-document-scanner-plugin'
import {convertToPdfAndUpload} from '@bluecentury/utils'
import {useTranslation} from 'react-i18next'

type Document = {
  id: number
  path: string
  description: string
}

const Documents = () => {
  const {t} = useTranslation()
  const route = useRoute()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const toast = useToast()
  const {navlog}: any = route.params
  const {
    isPlanningDocumentsLoading,
    navigationLogDetails,
    navigationLogDocuments,
    getNavigationLogDocuments,
    uploadImgFile,
    uploadVesselNavigationLogFile,
  } = usePlanning()
  const {isOpen, onOpen, onClose} = useDisclose()
  const [result, setResult] = useState<ImageFile>({})
  const [selectedImg, setSelectedImg] = useState<ImageFile>({})
  const [viewImg, setViewImg] = useState(false)
  const [scannedImage, setScannedImage] = useState()

  useEffect(() => {
    getNavigationLogDocuments(navlog?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scanDocument = async () => {
    // start the document scanner
    const {scannedImages} = await DocumentScanner.scanDocument()
    await convertToPdfAndUpload(
      scannedImages,
      showToast,
      true,
      navlog,
      setScannedImage
    )
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

  const onScanDocument = () => {
    scanDocument()
    onClose()
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
        const newFile = {
          path: upload.path,
          description: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        let body = {
          fileGroup: {
            files:
              navigationLogDocuments?.length > 0
                ? [...navigationLogDocuments?.map(f => ({id: f.id})), newFile]
                : [newFile],
          },
        }

        if (navigationLogDetails?.fileGroup?.id) {
          body.fileGroup.id = navigationLogDetails?.fileGroup?.id
        }

        const uploadDocs = await uploadVesselNavigationLogFile(navlog?.id, body)
        if (typeof uploadDocs === 'object' && uploadDocs.id) {
          getNavigationLogDocuments(navlog?.id)
          showToast('File upload successfully.', 'success')
        } else {
          showToast('File upload failed.', 'failed')
        }
      }
    } catch (e) {
      handleError(e)
    }
  }

  const viewDocument = (path: string) => {
    // const path = `${API_URL}upload/documents/${doc.path}`
    const splitFile = path.split('.')
    const fileType = splitFile[splitFile.length - 1]

    // Documents saved as base64 don't have a file extention
    if (splitFile.length === 0) {
      navigation.navigate('PDFView', {
        path: `${path}`,
      })
      return
    }

    switch (fileType) {
      case 'pdf':
        navigation.navigate('PDFView', {
          path: `${path}`,
        })
        break
      case 'jpeg':
        setSelectedImg({
          uri: `${path}`,
          fileName: 'preview',
          type: 'image/jpeg',
        })
        setViewImg(true)
        break
      case 'jpg':
        setSelectedImg({
          uri: `${path}`,
          fileName: 'preview',
          type: 'image/jpg',
        })
        setViewImg(true)
        break
      default:
        setSelectedImg({
          uri: `${path}`,
          fileName: 'preview',
          type: 'image/jpeg',
        })
        setViewImg(true)
        break
    }
  }

  const onPullToReload = () => {
    getNavigationLogDocuments(navlog?.id)
  }
  const handleOnPressUpload = (document: any) => {
    const env = useSettings.getState().env

    switch (env) {
      case 'PROD':
        viewDocument(
          `https://app.vemasys.eu/upload/documents/${document?.path}`
        )
        break
      // case Environments.UAT:
      case 'UAT':
        viewDocument(
          `https://app-uat.vemasys.eu/upload/documents/${document?.path}`
        )
        break
    }
  }

  if (isPlanningDocumentsLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        px={ms(12)}
        py={ms(8)}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isPlanningDocumentsLoading}
          />
        }
      >
        <Text fontSize={ms(20)} bold color={Colors.azure} mb={ms(20)}>
          {t('additionalDocuments')}
        </Text>
        {navigationLogDocuments?.map((document: Document, index: number) => {
          return (
            <HStack
              key={index}
              bg={
                document.description !== scannedImage
                  ? Colors.white
                  : 'rgba(85,189,55,0.73)'
              }
              borderRadius={5}
              justifyContent="space-between"
              alignItems="center"
              py={ms(10)}
              px={ms(16)}
              mb={ms(10)}
              shadow={1}
            >
              <Text flex="1" mr={ms(5)} fontWeight="medium">
                {document.description
                  ? document.description
                  : '...' + document.path.substr(-20)}
              </Text>
              <IconButton
                source={Icons.eye}
                onPress={() => handleOnPressUpload(document)}
                //   onPress={() => {console.log('PRESSED')}}
                size={ms(22)}
              />
            </HStack>
          )
        })}
      </ScrollView>
      <Button
        bg={Colors.primary}
        leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
        mt={ms(20)}
        mb={ms(20)}
        mx={ms(12)}
        onPress={onOpen}
      >
        {t('addFile')}
      </Button>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={onScanDocument}>
            {t('scanDoc')}
          </Actionsheet.Item>
          <Actionsheet.Item onPress={onSelectDocument}>
            {t('selectDoc')}
          </Actionsheet.Item>
          <Actionsheet.Item onPress={onClose}>Cancel</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      {/* Preview Image Modal */}
      <Modal isOpen={viewImg} size="full" onClose={() => setViewImg(false)}>
        <Modal.Content>
          <Image
            alt="file-preview"
            source={{uri: selectedImg.uri}}
            resizeMode="contain"
            w="100%"
            h="100%"
          />
        </Modal.Content>
      </Modal>
      {/* End of Image Preview */}
    </Box>
  )
}

export default Documents
