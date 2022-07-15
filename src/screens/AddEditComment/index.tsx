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
  useToast
} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {useEntity, usePlanning, useTechnical} from '@bluecentury/stores'
import {LoadingIndicator} from '@bluecentury/components'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

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
  const {user} = useEntity()
  console.log(comment)

  const [description, setDescription] = useState(
    comment !== undefined ? comment?.description?.replace(/(\\)/g, '') : ''
  )
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)

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
          showToast('comment updated.', 'success')
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
          showToast('New comment added.', 'success')
        } else {
          showToast('New comment failed.', 'failed')
        }
      } else if (routeFrom === 'Technical') {
      }
    }
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

        <FormControl isRequired isInvalid={isCommentEmpty} mt={ms(25)}>
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
    </Box>
  )
}
export default AddEditComment
