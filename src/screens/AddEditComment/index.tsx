import React, {useState} from 'react'
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
import {useEntity, usePlanning, useTechnical} from '@bluecentury/stores'
import {LoadingIndicator} from '@bluecentury/components'
import {TouchableOpacity} from 'react-native'

type Props = NativeStackScreenProps<RootStackParamList>
const AddEditComment = ({navigation, route}: Props) => {
  const {comment, method, routeFrom} = route.params
  const toast = useToast()
  const {
    isPlanningLoading,
    createNavlogComment,
    updateComment,
    getNavigationLogComments,
    navigationLogDetails
  } = usePlanning()
  const {uploadFileBySubject} = useTechnical()
  const {user} = useEntity()
  console.log('new', comment)
  const [description, setDescription] = useState(
    comment !== undefined ? comment?.description?.replace(/(\\)/g, '') : ''
  )
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)
  const [imgFile, setImgFile] = useState<ImageFile>({
    id: '',
    uri: '',
    fileName: '',
    type: ''
  })
  const [imgModal, setImgModal] = useState(false)
  const [viewImg, setViewImg] = useState(false)

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
        res = await updateComment(comment?.id, description)
        if (typeof res === 'object') {
          getNavigationLogComments(navigationLogDetails?.id)
          if (imgFile.fileName !== '') {
            const upload = await uploadFileBySubject(
              'NavigationLog',
              imgFile,
              'shared_within_company',
              res?.id
            )
            if (typeof upload === 'object') {
              showToast('comment updated.', 'success')
            }
          } else {
            showToast('comment updated.', 'success')
          }
        } else {
          showToast('comment update failed.', 'failed')
        }
      } else if (routeFrom === 'Technical') {
      }
    } else {
      if (routeFrom === 'Planning') {
        res = await createNavlogComment(
          navigationLogDetails?.id,
          description,
          user?.id
        )
        if (typeof res === 'object') {
          getNavigationLogComments(navigationLogDetails?.id)
          const upload = await uploadFileBySubject(
            'NavigationLog',
            imgFile,
            'shared_within_company',
            res?.id
          )
          console.log('new', res?.id)
          if (typeof upload === 'object') {
            showToast('New comment added.', 'success')
          }
        } else {
          showToast('New comment failed.', 'failed')
        }
      } else if (routeFrom === 'Technical') {
      }
    }
  }

  const launchImageLibrary = () => {
    let options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo'
    }

    ImagePicker.launchImageLibrary(options, response => {
      setImgFile({
        ...imgFile,
        id: response.assets[0].id,
        uri: response.assets[0].uri,
        fileName: response.assets[0].fileName,
        type: response.assets[0].type
      })
    })
    setImgModal(false)
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
            onChangeText={e => setDescription(e)}
            autoCompleteType={undefined}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please fill in the description
          </FormControl.ErrorMessage>
        </FormControl>
        {imgFile.uri !== '' || imgFile.fileName !== '' ? (
          <HStack>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setImgModal(true)}
            >
              <Image
                alt="file-upload"
                source={{uri: imgFile.uri}}
                w={ms(136)}
                h={ms(114)}
              />
            </TouchableOpacity>
          </HStack>
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
                  onPress={() => setViewImg(true)}
                >
                  View image
                </Text>
              </TouchableOpacity>
              <Divider my={ms(14)} />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={launchImageLibrary}
              >
                <Text textAlign="center" fontSize={ms(16)} fontWeight="bold">
                  Upload new version
                </Text>
              </TouchableOpacity>
              <Divider my={ms(14)} />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setImgFile({...imgFile, uri: '', fileName: ''}),
                    setImgModal(false)
                }}
              >
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
            source={{uri: imgFile.uri}}
            w="100%"
            h="100%"
          />
        </Modal.Content>
      </Modal>
    </Box>
  )
}
export default AddEditComment
