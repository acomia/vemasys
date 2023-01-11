import React, {useEffect, useRef, useState} from 'react'
import {
  Box,
  ScrollView,
  Text,
  FormControl,
  Button,
  WarningOutlineIcon,
  TextArea,
  HStack,
  useToast,
  Image,
  Modal,
  Divider,
  Icon,
} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import * as ImagePicker from 'react-native-image-picker'
import {RNCamera} from 'react-native-camera'
import {StyleSheet} from 'react-native'

import {Colors} from '@bluecentury/styles'
import {useEntity, usePlanning, useSettings} from '@bluecentury/stores'
import {IconButton, LoadingAnimated} from '@bluecentury/components'
import {Alert, TouchableOpacity} from 'react-native'
import {Icons} from '@bluecentury/assets'
import {PROD_URL, UAT_URL} from '@vemasys/env'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {useTranslation} from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditComment = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {comment, method, routeFrom}: any = route.params
  const currentEnv = useSettings.getState().env
  const uploadEndpoint = () => {
    if (currentEnv === 'PROD') {
      return PROD_URL
    }
    if (currentEnv === 'UAT') {
      return UAT_URL
    }
  }
  const toast = useToast()
  const {
    isPlanningLoading,
    createNavlogComment,
    updateComment,
    getNavigationLogComments,
    navigationLogDetails,
    deleteComment,
    uploadImgFile,
  }: any = usePlanning()
  const {user}: any = useEntity()
  const descriptionText = comment?.description
    ?.replace(/(\\)/g, '')
    .match(/([^<br>]+)/)[0]
  const [description, setDescription] = useState<string>(
    comment !== undefined ? descriptionText : ''
  )
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)
  const [imgFile, setImgFile] = useState<any>([])
  const [selectedImg, setSelectedImg] = useState<ImageFile>({})
  const [imgModal, setImgModal] = useState(false)
  const [viewImg, setViewImg] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const cameraRef = useRef<any>()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        method === 'edit' ? (
          <IconButton
            size={ms(20)}
            source={Icons.trash}
            styles={{marginLeft: 20}}
            onPress={deleteCommentConfirmation}
          />
        ) : null,
    })
  }, [])

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
      onCloseComplete() {
        res === 'success' ? navigation.goBack() : null
      },
    })
  }

  const handleOnSaveComment = async () => {
    if (description === '') {
      setIsCommentEmpty(true)
      return
    }
    let res
    let tempComment = ''
    if (method === 'edit') {
      if (routeFrom === 'Planning') {
        if (imgFile.length > 0) {
          await Promise.all(
            imgFile.map(async (file: any) => {
              const upload = await uploadImgFile(file)
              if (typeof upload === 'object') {
                tempComment =
                  tempComment +
                  '-' +
                  '\n' +
                  `<img src="${uploadEndpoint()}upload/documents/${
                    upload.path
                  }" />`
              }
            })
          )
          const response = await createNavlogComment(
            navigationLogDetails?.id,
            description + tempComment,
            user?.id
          )
          if (typeof response === 'object') {
            showToast('New comment added.', 'success')
            getNavigationLogComments(navigationLogDetails?.id)
          } else {
            showToast('New comment failed.', 'failed')
          }
        } else {
          res = await updateComment(comment?.id, description)
          if (typeof res === 'object') {
            showToast('Comment updated.', 'success')
            getNavigationLogComments(navigationLogDetails?.id)
          } else {
            showToast('Comment update failed.', 'failed')
          }
        }
      } else if (routeFrom === 'Technical') {
      }
    } else {
      if (routeFrom === 'Planning') {
        if (imgFile.length > 0) {
          await Promise.all(
            imgFile.map(async (file: any) => {
              const upload = await uploadImgFile(file)
              if (typeof upload === 'object') {
                tempComment =
                  tempComment +
                  '-' +
                  '\n' +
                  `<img src='${uploadEndpoint()}upload/documents/${
                    upload.path
                  }' />`
              }
            })
          )
          const response = await createNavlogComment(
            navigationLogDetails?.id,
            description + tempComment,
            user?.id
          )
          if (typeof response === 'object') {
            showToast('New comment added.', 'success')
            getNavigationLogComments(navigationLogDetails?.id)
          } else {
            showToast('New comment failed.', 'failed')
          }
        } else {
          res = await createNavlogComment(
            navigationLogDetails?.id,
            description,
            user?.id
          )
          if (typeof res === 'object') {
            showToast('New comment added.', 'success')
            getNavigationLogComments(navigationLogDetails?.id)
          } else {
            showToast('New comment failed.', 'failed')
          }
        }
      } else if (routeFrom === 'Technical') {
      }
    }
  }

  const deleteCommentConfirmation = () => {
    Alert.alert(t('confirmationRequired'), t('confirmMessage'), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t('confirmDelete'),
        onPress: async () => onDeleteComment(),
        style: 'destructive',
      },
    ])
  }

  const onDeleteComment = async () => {
    try {
      const res = await deleteComment(comment?.id.toString())
      if (res === 204) {
        showToast('Comment deleted.', 'success')
        getNavigationLogComments(navigationLogDetails?.id)
      } else {
        showToast('Could not delete comment.', 'failed')
      }
    } catch (error) {
      throw new Error(`Could not delete comment. ${error}`)
    }
  }

  const launchImageLibrary = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 0,
    }

    ImagePicker.launchImageLibrary(options, response => {
      response.assets?.map((asset: any) => {
        setImgFile((prev: any) => [
          ...prev,
          {
            id: asset.id,
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type,
          },
        ])
      })
    })
    setImgModal(false)
    setIsCameraOpen(false)
  }

  const onSelectImage = (image: ImageFile) => {
    setImgModal(true)
    setSelectedImg({
      uri: image.uri,
      fileName: image.fileName,
      type: image.type,
    })
  }

  const onUploadNewVersion = () => {
    setImgModal(false)
    const filtered = imgFile?.filter((img: any) => img.uri !== selectedImg.uri)
    setImgFile(filtered)
    launchImageLibrary()
  }

  const onDeleteImage = () => {
    setImgModal(false)
    const filtered = imgFile?.filter((img: any) => img.uri !== selectedImg.uri)
    setImgFile(filtered)
  }

  const takePicture = async () => {
    if (cameraRef) {
      const options = {quality: 0.5, base64: true, width: 1024}
      const data = await cameraRef.current.takePictureAsync(options)
      setIsCameraOpen(false)
      const arrFromPath = data.uri.split('/')
      const fileName = arrFromPath[arrFromPath.length - 1]
      const fileNameWithoutExtension = fileName.split('.')[0]
      setImgFile((prev: any) => [
        ...prev,
        {
          id: fileNameWithoutExtension,
          uri: data.uri,
          fileName: fileName,
          type: 'image/jpeg',
        },
      ])
    }
  }

  if (isPlanningLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <ScrollView
        bg={Colors.white}
        contentContainerStyle={{flexGrow: 1}}
        px={ms(12)}
        py={ms(20)}
      >
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          {method === 'edit' ? t('editAComment') : t('addAComment')}
        </Text>

        <FormControl isRequired isInvalid={isCommentEmpty} my={ms(25)}>
          <FormControl.Label color={Colors.disabled}>
            {t('description')}
          </FormControl.Label>
          <TextArea
            autoCompleteType={undefined}
            h="200"
            numberOfLines={6}
            placeholder=""
            style={{backgroundColor: '#F7F7F7'}}
            value={description}
            onChangeText={e => {
              setDescription(e)
              setIsCommentEmpty(false)
            }}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('fillTheDescription')}
          </FormControl.ErrorMessage>
        </FormControl>
        {imgFile.length > 0 ? (
          <ScrollView
            horizontal
            maxH={ms(120)}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
          >
            {imgFile.map((file: ImageFile, index: number) => (
              <HStack key={`File-${index}`}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => onSelectImage(file)}
                >
                  <Image
                    alt="file-upload"
                    h={ms(114)}
                    mr={ms(10)}
                    source={{uri: file.uri}}
                    w={ms(136)}
                  />
                </TouchableOpacity>
              </HStack>
            ))}
          </ScrollView>
        ) : null}

        <Button
          bg={Colors.primary}
          mt={ms(10)}
          size="md"
          onPress={() => setIsCameraOpen(true)}
        >
          {t('uploadImage')}
        </Button>
      </ScrollView>
      <Box bg={Colors.white} position="relative">
        <Shadow
          viewStyle={{
            width: '100%',
          }}
          distance={25}
        >
          <HStack>
            <Button
              colorScheme="muted"
              flex="1"
              m={ms(16)}
              variant="ghost"
              onPress={() => navigation.goBack()}
            >
              {t('cancel')}
            </Button>
            <Button
              bg={Colors.primary}
              flex="1"
              m={ms(16)}
              onPress={handleOnSaveComment}
            >
              {t('save')}
            </Button>
          </HStack>
        </Shadow>
      </Box>
      {/* Image Actions Modal */}
      <Modal animationPreset="slide" isOpen={imgModal} size="full">
        <Modal.Content bg="transparent" marginBottom={0} mt="auto" width="95%">
          <Box py={ms(14)}>
            <Box bg={Colors.white} borderRadius={ms(5)} py={ms(10)}>
              <Text bold fontSize={ms(12)} textAlign="center">
                {t('actions')}
              </Text>
              <Divider my={ms(14)} />
              <TouchableOpacity activeOpacity={0.6}>
                <Text
                  bold
                  fontSize={ms(16)}
                  textAlign="center"
                  onPress={() => {
                    setViewImg(true)
                    setImgModal(false)
                  }}
                >
                  {t('viewImage')}
                </Text>
              </TouchableOpacity>
              <Divider my={ms(14)} />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={onUploadNewVersion}
              >
                <Text bold fontSize={ms(16)} textAlign="center">
                  {t('uploadNewVersion')}
                </Text>
              </TouchableOpacity>
              <Divider my={ms(14)} />
              <TouchableOpacity activeOpacity={0.6} onPress={onDeleteImage}>
                <Text
                  bold
                  color={Colors.danger}
                  fontSize={ms(16)}
                  mb={ms(5)}
                  textAlign="center"
                >
                  {t('delete')}
                </Text>
              </TouchableOpacity>
            </Box>
            <Button
              bg={Colors.white}
              mt={ms(10)}
              size="lg"
              onPress={() => setImgModal(false)}
            >
              <Text
                bold
                color={Colors.disabled}
                fontSize={ms(16)}
                textAlign="center"
              >
                {t('cancel')}
              </Text>
            </Button>
          </Box>
        </Modal.Content>
      </Modal>
      {/* Preview Image Modal */}
      <Modal isOpen={viewImg} size="full" onClose={() => setViewImg(false)}>
        <Modal.Content>
          <Image
            alt="file-preview"
            h="100%"
            resizeMode="contain"
            source={{uri: selectedImg.uri}}
            w="100%"
          />
        </Modal.Content>
      </Modal>
      {isCameraOpen ? (
        <RNCamera
          ref={cameraRef}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          captureAudio={false}
          flashMode={RNCamera.Constants.FlashMode.on}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
        >
          <Box
            flex="0"
            flexDirection="row"
            justifyContent="space-between"
            w="100%"
          >
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={launchImageLibrary}
            >
              <Icon
                as={<FontAwesome5 name="image" />}
                color={Colors.white}
                ml={ms(0)}
                size={ms(32)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => takePicture()}
            >
              <Icon
                as={<FontAwesome5 name="camera" />}
                color={Colors.white}
                ml={ms(0)}
                size={ms(32)}
              />
            </TouchableOpacity>
            <Box h={ms(60)} m={ms(20)} w={ms(60)} />
          </Box>
        </RNCamera>
      ) : null}
    </Box>
  )
}

export default AddEditComment

const styles = StyleSheet.create({
  cameraButton: {
    width: ms(60),
    height: ms(60),
    flex: 0,
    margin: ms(20),
    borderRadius: 50,
    borderColor: '#ffffff',
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
})
