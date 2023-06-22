import React, {useState, useEffect} from 'react'
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Text,
  useToast,
  ScrollView,
  Modal,
  Image,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DocumentScanner from 'react-native-document-scanner-plugin'
import {Colors} from '@bluecentury/styles'
import moment from 'moment'
import {formatNumber} from '@bluecentury/constants'
import {
  IconButton,
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {PermissionsAndroid, Platform, TouchableOpacity} from 'react-native'
import {useTranslation} from 'react-i18next'
import {RootStackParamList} from '@bluecentury/types/nav.types'
import {convertToPdfAndUpload} from '@bluecentury/utils'
import {
  usePlanning,
  useTechnical,
  useSettings,
  useEntity,
} from '@bluecentury/stores'
import * as ImagePicker from 'react-native-image-picker'
import {PROD_URL, UAT_URL} from '@vemasys/env'

type Props = NativeStackScreenProps<RootStackParamList>
export default function BunkeringDetails({route, navigation}: Props) {
  const {t} = useTranslation()
  const {bunk}: any = route.params
  const toast = useToast()
  const {
    setCurrentBunkeringId,
    addBunkeringScan,
    getVesselBunkering,
    bunkering,
    isBunkeringLoading,
  } = useTechnical()
  const {uploadImgFile} = usePlanning()
  const {vesselId} = useEntity()
  const {env} = useSettings()
  const [viewImg, setViewImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState('')
  const [shouldUpdateImagesList, setShouldUpdateImagesList] = useState(false)

  useEffect(() => {
    if (selectedImg) {
      setViewImg(true)
    }
  }, [selectedImg])

  useEffect(() => {
    setCurrentBunkeringId(bunk.id)
  }, [bunk])

  useEffect(() => {
    if (
      bunkering &&
      bunkering.find(item => item.id === bunk.id)?.fileGroup?.files?.length > 0
    ) {
      setShouldUpdateImagesList(true)
    }
  }, [bunkering])

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
      await convertToPdfAndUpload(
        scannedImages,
        showToast,
        false,
        null,
        undefined,
        true
      )
      getVesselBunkering(vesselId)
    }
  }

  const renderCardDetails = (title: string, value: string, suffix?: string) => {
    return (
      <HStack
        alignItems="center"
        bg={Colors.white}
        borderRadius={5}
        height={ms(50)}
        justifyContent="space-between"
        mb={ms(10)}
        px={ms(15)}
        shadow={3}
        width="100%"
      >
        <Text flex="1" fontWeight="medium">
          {title}
        </Text>
        <Box
          borderColor={Colors.light}
          borderLeftWidth={ms(1)}
          flex="1"
          height="100%"
          justifyContent="center"
        >
          <Text color={Colors.azure} fontWeight="medium" ml={ms(13)}>
            {value} {suffix}
          </Text>
        </Box>
      </HStack>
    )
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
          Promise.all(
            response?.assets?.map(async item => {
              return await uploadImgFile({
                uri: item.uri,
                fileName: item.fileName,
                type: item.type ? item.type : null,
              })
            })
          ).then(values => {
            Promise.all(
              values.map(async item => {
                return await addBunkeringScan(item.path)
              })
            ).then(async val => {
              await getVesselBunkering(vesselId)
              showToast('File upload successfully', 'success')
            })
          })
        } catch (e) {
          showToast('File upload failed', 'failure')
          console.log('ERROR', JSON.stringify(e))
        }
      }
    })
  }

  return (
    <Box bg={Colors.white} flex="1">
      <NoInternetConnectionMessage />
      <Box flex={1} px={ms(12)} py={ms(20)}>
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          {t('details')}
        </Text>
        <Divider my={ms(15)} />
        {renderCardDetails('Name', bunk.entity.name)}
        {renderCardDetails('Date', moment(bunk.date).format('DD MMM YYYY'))}
        {renderCardDetails(
          'Bunkered quantity',
          formatNumber(bunk.value, 2, ' '),
          'L'
        )}
        <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(15)}>
          {t('documents')}
        </Text>
        <HStack justifyContent="space-between" mt={ms(10)}>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('file')}
          </Text>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('actions')}
          </Text>
        </HStack>
        <Divider my={ms(15)} />
        {shouldUpdateImagesList &&
        bunkering &&
        bunkering?.find(item => item.id === bunk.id) ? (
          <ScrollView>
            {/*{bunk?.fileGroup?.files?.map((file: any, index: number) => (*/}
            {bunkering
              ?.find(item => item.id === bunk.id)
              .fileGroup?.files?.map((file: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (file.path.split('.')[1] === 'pdf') {
                      navigation.navigate('PDFView', {
                        // path: `${VEMASYS_PRODUCTION_FILE_URL}/${file.path}`,
                        path: `${UAT_URL}upload/documents/${file.path}`,
                      })
                    } else {
                      setSelectedImg(file.path)
                    }
                  }}
                >
                  <HStack
                    alignItems="center"
                    bg={Colors.white}
                    borderRadius={5}
                    height={ms(50)}
                    justifyContent="space-between"
                    mb={ms(15)}
                    px={ms(16)}
                    shadow={3}
                    width="100%"
                  >
                    <Text
                      ellipsizeMode="middle"
                      flex="1"
                      fontWeight="medium"
                      maxW="80%"
                      numberOfLines={1}
                    >
                      {file.path}
                    </Text>
                    <HStack alignItems="center">
                      <IconButton
                        size={ms(22)}
                        source={Icons.file_download}
                        onPress={() => {}}
                      />
                      <Box w={ms(10)} />
                      <IconButton
                        size={ms(22)}
                        source={Icons.eye}
                        onPress={() => {
                          if (file.path.split('.')[1] === 'pdf') {
                            navigation.navigate('PDFView', {
                              // path: `${VEMASYS_PRODUCTION_FILE_URL}/${file.path}`,
                              path: `${UAT_URL}upload/documents/${file.path}`,
                            })
                          } else {
                            setSelectedImg(file.path)
                          }
                        }}
                      />
                    </HStack>
                  </HStack>
                </TouchableOpacity>
              ))}
          </ScrollView>
        ) : !isBunkeringLoading ? (
          <Text color={Colors.text} flex={1} fontWeight="medium" mb={ms(20)}>
            {t('noUploadedFiles')}
          </Text>
        ) : (
          <LoadingAnimated />
        )}
        <Button
          bg={Colors.primary}
          leftIcon={<Icon as={MaterialIcons} name="upload-file" size="sm" />}
          onPress={() => scanDocument()}
        >
          {t('openCamera')}
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
        <Button
          bg={Colors.primary}
          size="md"
          onPress={() => onSelectDocument()}
        >
          {t('uploadImage')}
        </Button>
      </Box>
      <Modal
        isOpen={viewImg}
        size="full"
        onClose={() => {
          setViewImg(false)
          setSelectedImg('')
        }}
      >
        <Modal.Content>
          <Modal.CloseButton />
          {selectedImg ? (
            <Image
              source={{
                uri: `${
                  env === 'UAT' ? UAT_URL : PROD_URL
                }upload/documents/${selectedImg}`,
              }}
              alt="file-preview"
              h="100%"
              resizeMode="contain"
              w="100%"
            />
          ) : null}
        </Modal.Content>
      </Modal>
    </Box>
  )
}
