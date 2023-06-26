import React, {useState, useEffect} from 'react'
import {RefreshControl, Platform, PermissionsAndroid} from 'react-native'
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Icon,
  Image,
  Modal,
  ScrollView,
  Select,
  Text,
  WarningOutlineIcon,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {NavigationProp, useNavigation, useRoute} from '@react-navigation/native'
import DocumentPicker, {isInProgress, types} from 'react-native-document-picker'
import {useTranslation} from 'react-i18next'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DocumentScanner from 'react-native-document-scanner-plugin'

import {convertToPdfAndUpload} from '@bluecentury/utils'
import {accessLevel} from '@bluecentury/constants'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {usePlanning, useSettings} from '@bluecentury/stores'
import {IconButton, LoadingAnimated} from '@bluecentury/components'
import {RootStackParamList} from '@bluecentury/types/nav.types'

type Document = {
  id: number
  path: string
  description: string
}

const Documents = () => {
  const {t} = useTranslation()
  const route = useRoute()
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, 'PlanningDetails'>>()
  const toast = useToast()
  const {navlog}: any = route.params
  const {
    isPlanningDocumentsLoading,
    navigationLogDocuments,
    getNavigationLogDocuments,
    uploadNavigationLogFileWithAccessLevel,
  } = usePlanning()
  const [result, setResult] = useState<ImageFile>({})
  const [selectedImg, setSelectedImg] = useState('')
  const [addDocs, setAddDocs] = useState(false)
  const [viewImg, setViewImg] = useState(false)
  const [scannedImage, setScannedImage] = useState()
  const [levelOfAccess, setLevelOfAccess] = useState(accessLevel[0].value)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isAccessLevelEmpty, setIsAccessLevelEmpty] = useState(false)

  useEffect(() => {
    // Preload the image
    const preloadImage = async () => {
      if (selectedImg !== '') {
        setLoading(true)
        await Image.prefetch(selectedImg)
        setImageLoaded(true)
        setLoading(false)
      }
    }

    preloadImage()
  }, [selectedImg])

  const handleImageLoad = () => {
    setLoading(false)
    setImageLoaded(false)
  }

  useEffect(() => {
    getNavigationLogDocuments(navlog?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scanDocument = async () => {
    if (levelOfAccess === '') {
      setIsAccessLevelEmpty(true)
      return
    }
    if (Platform.OS === 'android') {
      await requestCameraPermission()
    }
    // start the document scanner
    const {scannedImages} = await DocumentScanner.scanDocument()
    if (scannedImages) {
      await convertToPdfAndUpload(
        scannedImages,
        showToast,
        true,
        navlog,
        setScannedImage,
        false,
        false,
        levelOfAccess
      )
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

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      console.warn(err)
    }
  }

  const onSelectDocument = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.images],
      })
      setAddDocs(false)
      setResult({
        uri: pickerResult.uri,
        fileName: pickerResult.name,
        type: pickerResult.type,
      })
      const file = {
        uri: pickerResult.uri,
        fileName: pickerResult.name,
        type: pickerResult.type,
      }
      // const upload = await uploadImgFile({
      //   uri: pickerResult.uri,
      //   fileName: pickerResult.name,
      //   type: pickerResult.type,
      // })
      // if (typeof upload === 'object') {
      //   const newFile = {
      //     path: upload.path,
      //     description: moment().format('YYYY-MM-DD HH:mm:ss'),
      //   }
      //   const body = {
      //     fileGroup: {
      //       files:
      //         navigationLogDocuments?.length > 0
      //           ? [...navigationLogDocuments?.map(f => ({id: f.id})), newFile]
      //           : [newFile],
      //     },
      //   }

      //   if (navigationLogDetails?.fileGroup?.id) {
      //     body.fileGroup.id = navigationLogDetails?.fileGroup?.id
      //   }

      //   const uploadDocs = await uploadVesselNavigationLogFile(navlog?.id, body)
      const uploadDocs = await uploadNavigationLogFileWithAccessLevel(
        Number(navlog?.id),
        file,
        levelOfAccess
      )
      if (Array.isArray(uploadDocs) && uploadDocs[0]?.id) {
        getNavigationLogDocuments(navlog?.id)
        showToast('File upload successfully.', 'success')
      } else {
        showToast('File upload failed.', 'failed')
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
        setSelectedImg(path)
        setViewImg(true)
        break
      case 'jpg':
        setSelectedImg(path)
        setViewImg(true)
        break
      default:
        setSelectedImg(path)
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
        refreshControl={
          <RefreshControl
            refreshing={isPlanningDocumentsLoading}
            onRefresh={onPullToReload}
          />
        }
        contentContainerStyle={{flexGrow: 1}}
        px={ms(12)}
        py={ms(8)}
        scrollEventThrottle={16}
      >
        <Text bold color={Colors.azure} fontSize={ms(20)} mb={ms(20)}>
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
              alignItems="center"
              borderRadius={5}
              justifyContent="space-between"
              mb={ms(10)}
              px={ms(16)}
              py={ms(10)}
              shadow={1}
            >
              <Text flex="1" fontWeight="medium" mr={ms(5)}>
                {document.description
                  ? document.description
                  : '...' + document.path.substr(-20)}
              </Text>
              <IconButton
                size={ms(22)}
                source={Icons.eye}
                //   onPress={() => {console.log('PRESSED')}}
                onPress={() => handleOnPressUpload(document)}
              />
            </HStack>
          )
        })}
      </ScrollView>
      <Button
        bg={Colors.primary}
        leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
        mb={ms(20)}
        mt={ms(20)}
        mx={ms(12)}
        onPress={() => setAddDocs(true)}
      >
        {t('addFile')}
      </Button>
      <Modal isOpen={addDocs} size="full" onClose={() => setAddDocs(false)}>
        <Modal.Content>
          <Box bg={Colors.white} p={ms(10)}>
            <Text bold color={Colors.azure} fontSize={ms(18)}>
              File upload
            </Text>
            <Divider mb={ms(20)} mt={ms(5)} />
            <Button
              leftIcon={
                <Icon as={MaterialIcons} name="upload-file" size="sm" />
              }
              bg={Colors.primary}
              onPress={scanDocument}
            >
              {t('openCamera')}
            </Button>
            <Text
              color={Colors.disabled}
              fontSize={ms(16)}
              fontWeight="medium"
              my={ms(10)}
              textAlign="center"
            >
              {t('or')}
            </Text>
            <Button bg={Colors.primary} size="md" onPress={onSelectDocument}>
              {t('uploadImage')}
            </Button>
            <FormControl isRequired isInvalid={isAccessLevelEmpty} my={ms(15)}>
              <FormControl.Label color={Colors.disabled}>
                {t('accessLevel')}
              </FormControl.Label>
              <Select
                bg={Colors.light_grey}
                defaultValue={levelOfAccess}
                selectedValue={levelOfAccess}
                onValueChange={value => setLevelOfAccess(value)}
              >
                {accessLevel.map((access, idx) => (
                  <Select.Item
                    key={`AccessLevel-${idx}`}
                    label={access.label}
                    value={access.value}
                  />
                ))}
              </Select>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {t('selectAccessLevel')}
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
        </Modal.Content>
      </Modal>
      {/* Preview Image Modal */}
      <Modal isOpen={viewImg} size="full" onClose={() => setViewImg(false)}>
        <Modal.Content>
          {loading && !imageLoaded ? (
            <LoadingAnimated />
          ) : (
            <Image
              alt="file-preview"
              h="100%"
              resizeMode="contain"
              source={{uri: selectedImg}}
              w="100%"
              onLoad={handleImageLoad}
            />
          )}
        </Modal.Content>
      </Modal>
      {/* End of Image Preview */}
    </Box>
  )
}

export default Documents
