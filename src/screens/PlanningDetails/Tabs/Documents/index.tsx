import React, {useEffect, useState} from 'react'
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
  useToast
} from 'native-base'
import {ms} from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useNavigation, useRoute} from '@react-navigation/native'

import {Colors} from '@bluecentury/styles'
import {useAuth, usePlanning} from '@bluecentury/stores'
import {IconButton, LoadingIndicator} from '@bluecentury/components'
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types
} from 'react-native-document-picker'
import {Icons} from '@bluecentury/assets'
import {VEMASYS_PRODUCTION_FILE_URL} from '@bluecentury/constants'
import {RefreshControl} from 'react-native'
import moment from 'moment'
import {UAT_URL} from '@vemasys/env'

type Document = {
  id: number
  path: string
  description: string
}

const Documents = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const toast = useToast()
  const {navlog}: any = route.params
  const {
    isPlanningLoading,
    navigationLogDetails,
    navigationLogDocuments,
    getNavigationLogDocuments,
    uploadImgFile,
    uploadVesselNavigationLogFile
  } = usePlanning()
  const {isOpen, onOpen, onClose} = useDisclose()
  const [result, setResult] = useState<ImageFile>({})
  const [selectedImg, setSelectedImg] = useState<ImageFile>({})
  const [viewImg, setViewImg] = useState(false)

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
      onCloseComplete() {
        res === 'success' ? navigation.goBack() : null
      }
    })
  }

  const onScanDocument = () => {
    onClose()
  }

  const onSelectDocument = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.images]
      })
      onClose()
      setResult({
        uri: pickerResult.uri,
        fileName: pickerResult.name,
        type: pickerResult.type
      })
      const upload = await uploadImgFile({
        uri: pickerResult.uri,
        fileName: pickerResult.name,
        type: pickerResult.type
      })
      if (typeof upload === 'object') {
        const newFile = {
          path: upload.path,
          description: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        let body = {
          fileGroup: {
            files:
              navigationLogDocuments?.length > 0
                ? [...navigationLogDocuments?.map(f => ({id: f.id})), newFile]
                : [newFile]
          }
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
        path: `${path}`
      })
      return
    }

    switch (fileType) {
      case 'pdf':
        navigation.navigate('PDFView', {
          path: `${path}`
        })
        break
      case 'jpeg':
        setSelectedImg({
          uri: `${path}`,
          fileName: 'preview',
          type: 'image/jpeg'
        })
        setViewImg(true)
        break
      case 'jpg':
        setSelectedImg({
          uri: `${path}`,
          fileName: 'preview',
          type: 'image/jpg'
        })
        setViewImg(true)
        break
      default:
        setSelectedImg({
          uri: `${path}`,
          fileName: 'preview',
          type: 'image/jpeg'
        })
        setViewImg(true)
        break
    }
  }

  const onPullToReload = () => {
    getNavigationLogDocuments(navlog?.id)
  }

  if (isPlanningLoading) return <LoadingIndicator />

  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        px={ms(12)}
        py={ms(20)}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isPlanningLoading}
          />
        }
      >
        <Text
          fontSize={ms(20)}
          fontWeight="bold"
          color={Colors.azure}
          mb={ms(20)}
        >
          Additional Documents
        </Text>
        {navigationLogDocuments?.map((document: Document, index: number) => {
          return (
            <HStack
              key={index}
              bg={Colors.white}
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
                onPress={() =>
                  viewDocument(`${UAT_URL}/upload/documents/${document.path}`)
                }
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
        Add file
      </Button>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={onScanDocument}>
            Scan document
          </Actionsheet.Item>
          <Actionsheet.Item onPress={onSelectDocument}>
            Select document from files
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
