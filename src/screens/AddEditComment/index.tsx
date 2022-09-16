import React, {useEffect, useState} from 'react'
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
  Divider
} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import * as ImagePicker from 'react-native-image-picker'

import {Colors} from '@bluecentury/styles'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {IconButton, LoadingIndicator} from '@bluecentury/components'
import {Alert, TouchableOpacity} from 'react-native'
import {Icons} from '@bluecentury/assets'

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditComment = ({navigation, route}: Props) => {
  const {comment, method, routeFrom}: any = route.params
  const toast = useToast()
  const {
    isPlanningLoading,
    createNavlogComment,
    updateComment,
    getNavigationLogComments,
    navigationLogDetails,
    deleteComment,
    uploadImgFile
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        method === 'edit' ? (
          <IconButton
            source={Icons.trash}
            onPress={deleteCommentConfirmation}
            size={ms(20)}
            styles={{marginLeft: 20}}
          />
        ) : null
    })
  }, [])

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

  const handleOnSaveComment = async () => {
    if (description === '') {
      setIsCommentEmpty(true)
      return
    }
    let res
    if (method === 'edit') {
      if (routeFrom === 'Planning') {
        if (imgFile.length > 0) {
          imgFile.map(async (file: any, index: number) => {
            const upload = await uploadImgFile(file)
            if (typeof upload === 'object') {
              let tempComment
              setDescription((description: string) => {
                tempComment =
                  description + '-' + '\n' + `<img src='${upload.path}' >`
                return description + '-' + '\n' + `<img src='${upload.path}' >`
              })
              if (index === imgFile.length - 1) {
                res = await updateComment(comment?.id, description)
                if (typeof res === 'object') {
                  showToast('Comment updated.', 'success')
                  getNavigationLogComments(navigationLogDetails?.id)
                } else {
                  showToast('Comment update failed.', 'failed')
                }
              }
            }
          })
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
          imgFile.map(async (file: any, index: number) => {
            const upload = await uploadImgFile(file)
            if (typeof upload === 'object') {
              let tempComment
              setDescription((description: string) => {
                tempComment =
                  description + '-' + '\n' + `<img src='${upload.path}' >`
                return description + '-' + '\n' + `<img src='${upload.path}' >`
              })

              if (index === imgFile.length - 1) {
                res = await createNavlogComment(
                  navigationLogDetails?.id,
                  tempComment,
                  user?.id
                )
                if (typeof res === 'object') {
                  showToast('New comment added.', 'success')
                  getNavigationLogComments(navigationLogDetails?.id)
                } else {
                  showToast('New comment failed.', 'failed')
                }
              }
            }
          })
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
    Alert.alert(
      'Confirmation required',
      'Are you sure you want to delete this item? This action cannot be reversed.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes, delete it',
          onPress: async () => onDeleteComment(),
          style: 'destructive'
        }
      ]
    )
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
    let options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 0
    }

    ImagePicker.launchImageLibrary(options, response => {
      response.assets?.map((asset: any) => {
        setImgFile((prev: any) => [
          ...prev,
          {
            id: asset.id,
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type
          }
        ])
      })
    })
    setImgModal(false)
  }

  const onSelectImage = (image: ImageFile) => {
    setImgModal(true)
    setSelectedImg({
      uri: image.uri,
      fileName: image.fileName,
      type: image.type
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

  if (isPlanningLoading) return <LoadingIndicator />

  return (
    <Box flex={1}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          {method === 'edit' ? 'Edit' : 'Add'} a comment
        </Text>

        <FormControl isRequired isInvalid={isCommentEmpty} my={ms(25)}>
          <FormControl.Label color={Colors.disabled}>
            Description
          </FormControl.Label>
          <TextArea
            numberOfLines={6}
            h="200"
            placeholder=""
            style={{backgroundColor: '#F7F7F7'}}
            value={description}
            onChangeText={e => {
              setDescription(e)
              setIsCommentEmpty(false)
            }}
            autoCompleteType={undefined}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please fill in the description
          </FormControl.ErrorMessage>
        </FormControl>
        {imgFile.length > 0 ? (
          <ScrollView
            scrollEventThrottle={16}
            maxH={ms(120)}
            horizontal
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
                    source={{uri: file.uri}}
                    w={ms(136)}
                    h={ms(114)}
                    mr={ms(10)}
                  />
                </TouchableOpacity>
              </HStack>
            ))}
          </ScrollView>
        ) : null}

        <Button
          size="md"
          mt={ms(10)}
          bg={Colors.primary}
          onPress={launchImageLibrary}
        >
          Upload image
        </Button>
      </ScrollView>
      <Box bg={Colors.white} position="relative">
        <Shadow
          distance={25}
          viewStyle={{
            width: '100%'
          }}
        >
          <HStack>
            <Button
              flex="1"
              m={ms(16)}
              variant="ghost"
              colorScheme="muted"
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
            <Button
              flex="1"
              m={ms(16)}
              bg={Colors.primary}
              onPress={handleOnSaveComment}
            >
              Save
            </Button>
          </HStack>
        </Shadow>
      </Box>
      {/* Image Actions Modal */}
      <Modal isOpen={imgModal} size="full" animationPreset="slide">
        <Modal.Content width="95%" marginBottom={0} mt="auto" bg="transparent">
          <Box py={ms(14)}>
            <Box bg={Colors.white} py={ms(10)} borderRadius={ms(5)}>
              <Text textAlign="center" fontSize={ms(12)} fontWeight="bold">
                Actions
              </Text>
              <Divider my={ms(14)} />
              <TouchableOpacity activeOpacity={0.6}>
                <Text
                  textAlign="center"
                  fontSize={ms(16)}
                  fontWeight="bold"
                  onPress={() => {
                    setViewImg(true)
                    setImgModal(false)
                  }}
                >
                  View image
                </Text>
              </TouchableOpacity>
              <Divider my={ms(14)} />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={onUploadNewVersion}
              >
                <Text textAlign="center" fontSize={ms(16)} fontWeight="bold">
                  Upload new version
                </Text>
              </TouchableOpacity>
              <Divider my={ms(14)} />
              <TouchableOpacity activeOpacity={0.6} onPress={onDeleteImage}>
                <Text
                  textAlign="center"
                  color={Colors.danger}
                  fontSize={ms(16)}
                  fontWeight="bold"
                  mb={ms(5)}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </Box>
            <Button
              size="lg"
              mt={ms(10)}
              bg={Colors.white}
              onPress={() => setImgModal(false)}
            >
              <Text
                textAlign="center"
                color={Colors.disabled}
                fontSize={ms(16)}
                fontWeight="bold"
              >
                Cancel
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
            source={{uri: selectedImg.uri}}
            resizeMode="contain"
            w="100%"
            h="100%"
          />
        </Modal.Content>
      </Modal>
    </Box>
  )
}
export default AddEditComment
