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
  useToast
} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {useEntity, usePlanning, useTechnical} from '@bluecentury/stores'
import {LoadingIndicator} from '@bluecentury/components'
import {NativeStackScreenProps} from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<RootStackParamList>
export default function TechnicalTaskNewComment({navigation, route}: Props) {
  const {taskId} = route.params
  const toast = useToast()
  const {isTechnicalLoading, createTaskComment} = useTechnical()

  const [comment, setComment] = useState('')
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)

  const handleOnCreateNewComment = async () => {
    if (comment === '') {
      setIsCommentEmpty(true)
      return
    }

    const res = await createTaskComment(taskId, comment)
    if (typeof res === 'object') {
      toast.show({
        duration: 2000,
        render: () => {
          return (
            <Text
              bg="emerald.500"
              px="2"
              py="1"
              rounded="sm"
              mb={5}
              color={Colors.white}
            >
              New comment added.
            </Text>
          )
        },
        onCloseComplete() {
          navigation.goBack()
        }
      })
    } else {
      toast.show({
        duration: 2000,
        render: () => {
          return (
            <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
              New comment failed.
            </Box>
          )
        }
      })
    }
  }

  if (isTechnicalLoading) return <LoadingIndicator />

  return (
    <Box flex={1}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        px={ms(12)}
        py={ms(20)}
        bg={Colors.white}
      >
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          Add a comment
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
            value={comment}
            onChangeText={e => setComment(e)}
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
              onPress={handleOnCreateNewComment}
            >
              Save
            </Button>
          </HStack>
        </Shadow>
      </Box>
    </Box>
  )
}