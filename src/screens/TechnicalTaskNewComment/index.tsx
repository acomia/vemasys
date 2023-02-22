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
} from 'native-base'
import {Shadow} from 'react-native-shadow-2'
import {ms} from 'react-native-size-matters'

import {Colors} from '@bluecentury/styles'
import {useEntity, usePlanning, useTechnical} from '@bluecentury/stores'
import {
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {useTranslation} from 'react-i18next'

type Props = NativeStackScreenProps<RootStackParamList>
export default function TechnicalTaskNewComment({navigation, route}: Props) {
  const {t} = useTranslation()
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
              color={Colors.white}
              mb={5}
              px="2"
              py="1"
              rounded="sm"
            >
              New comment added.
            </Text>
          )
        },
        onCloseComplete() {
          navigation.goBack()
        },
      })
    } else {
      toast.show({
        duration: 2000,
        render: () => {
          return (
            <Box bg="red.500" mb={5} px="2" py="1" rounded="sm">
              New comment failed.
            </Box>
          )
        },
      })
    }
  }

  if (isTechnicalLoading) return <LoadingAnimated />

  return (
    <Box flex="1">
      <NoInternetConnectionMessage />
      <ScrollView
        bg={Colors.white}
        contentContainerStyle={{flexGrow: 1}}
        px={ms(12)}
        py={ms(20)}
      >
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          {t('addComment')}
        </Text>

        <FormControl isRequired isInvalid={isCommentEmpty} mt={ms(25)}>
          <FormControl.Label color={Colors.disabled}>
            {t('description')}
          </FormControl.Label>
          <TextArea
            autoCompleteType={undefined}
            h="200"
            numberOfLines={6}
            placeholder=""
            style={{backgroundColor: '#F7F7F7'}}
            value={comment}
            onChangeText={e => setComment(e)}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {t('fillInTheDescription')}
          </FormControl.ErrorMessage>
        </FormControl>
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
              onPress={handleOnCreateNewComment}
            >
              {t('save')}
            </Button>
          </HStack>
        </Shadow>
      </Box>
    </Box>
  )
}
