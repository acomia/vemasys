/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react'
import {Alert, TouchableOpacity} from 'react-native'
import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  ScrollView,
  Select,
  Text,
  useToast,
} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import moment from 'moment'
import {ms} from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons'
import _ from 'lodash'

import {
  IconButton,
  LoadingAnimated,
  NoInternetConnectionMessage,
} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {PROD_URL} from '@vemasys/env'
import {
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_TASK_MANAGE,
  VEMASYS_PRODUCTION_FILE_URL,
} from '@bluecentury/constants'
import {useEntity, useTechnical} from '@bluecentury/stores'
import {useTranslation} from 'react-i18next'
import {API} from '@bluecentury/api/apiService'

interface ICommentCard {
  comment: Comment
  commentDescription: string
}

type Props = NativeStackScreenProps<RootStackParamList>
const TechnicalTaskDetails = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {task, category} = route.params
  const {selectedEntity, vesselId} = useEntity()
  const {
    isTechnicalLoading,
    deleteTask,
    getVesselTasksByCategory,
    updateVesselTask,
    getVesselTasksCategory,
    isPartTypeLoading,
    vesselPartType,
    getVesselPartType,
  } = useTechnical()
  const hasTaskPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_TASK_MANAGE
  )
  const toast = useToast()
  // const options = [
  //   {
  //     value: 'todo',
  //     label: 'Todo',
  //   },
  //   {value: 'in_progress', label: 'In Progress'},
  //   {value: 'done', label: 'Done'},
  //   {value: 'cancel', label: 'Cancel'},
  // ]
  const [flaggedUpdated, setFlaggedUpdated] = useState(task?.flagged)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HStack>
          {hasTaskPermission ? (
            <>
              <IconButton
                size={ms(20)}
                source={Icons.edit}
                onPress={() =>
                  navigation.navigate('AddEditTechnicalTask', {
                    method: 'edit',
                    task: task,
                  })
                }
              />
              <IconButton
                size={ms(20)}
                source={Icons.trash}
                styles={{marginLeft: 15}}
                onPress={onDeleteTask}
              />
              <IconButton
                key={`flagged-${
                  flaggedUpdated ? Icons.flag_fill : Icons.flag_outline
                }`}
                disabled={isTechnicalLoading}
                size={ms(20)}
                source={flaggedUpdated ? Icons.flag_fill : Icons.flag_outline}
                styles={{marginLeft: 15}}
                onPress={onFlagTask}
              />
            </>
          ) : null}
        </HStack>
      ),
    })
  }, [navigation, flaggedUpdated, isTechnicalLoading])

  useEffect(() => {
    if (task?.vesselPart?.type) {
      getVesselPartType(task?.vesselPart?.type)
    }
  }, [task])

  const renderLabels = (label: string) => {
    let title = ''
    let color = ''
    let textColor = ''
    switch (label?.toLowerCase()) {
      case 'maintenance':
        title = t('maintenance')
        color = Colors.primary
        textColor = Colors.white
        break
      case 'check':
        title = t('check')
        color = Colors.secondary
        textColor = Colors.white
        break
      case 'incident':
        title = t('incident')
        color = Colors.warning
        textColor = Colors.white
        break
    }
    return (
      <Text
        bg={color}
        borderRadius={ms(25)}
        color={textColor}
        fontSize={ms(12)}
        fontWeight="medium"
        maxW={ms(150)}
        px={ms(20)}
        py={ms(5)}
        textAlign="center"
      >
        {title}
      </Text>
    )
  }

  const renderTaskSection = () => (
    <Box
      borderColor={Colors.light}
      borderRadius={ms(5)}
      borderWidth={1}
      mt={ms(10)}
      overflow="hidden"
    >
      {/* Title header */}
      <Box backgroundColor={Colors.border} px={ms(16)} py={ms(10)}>
        <Text bold color={Colors.azure} fontSize={ms(15)}>
          {task?.title}
        </Text>
      </Box>
      {/* End of title header */}
      {/* Content */}
      <Box py={ms(14)}>
        <Box px={ms(14)}>
          <Text color={Colors.disabled} fontWeight="medium">
            {t('taskType')}
          </Text>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('technicalTask')}
          </Text>
        </Box>
        <Divider my={ms(12)} />
        <Box px={ms(14)}>{renderLabels(task?.labels[0]?.title)}</Box>
        <Divider my={ms(12)} />
        <Box px={ms(14)}>
          <Text color={Colors.disabled} fontWeight="medium">
            {t('dateCreated')}
          </Text>
          <Text fontSize={ms(15)}>
            {task?.deadline
              ? moment(task?.deadline).format('D MMM YYYY; HH:mm')
              : t('notSet')}
          </Text>
        </Box>
        <Divider my={ms(12)} />
        <Box px={ms(14)}>
          <Text color={Colors.disabled} fontWeight="medium">
            {t('scheduledDate')}
          </Text>
          <Text fontSize={ms(15)}>
            {task?.deadline
              ? moment(task?.deadline).format('D MMM YYYY; HH:mm')
              : t('notSet')}
          </Text>
        </Box>
        <Divider my={ms(12)} />
        {/* <Box px={ms(14)}>
          <Text fontWeight="medium" color={Colors.disabled}>
            Priority
          </Text>
          <Text fontSize={ms(15)}>Medium</Text>
        </Box>
        <Divider my={ms(12)} /> */}
        <Box px={ms(14)}>
          <Text color={Colors.disabled} fontWeight="medium">
            {t('assignedTo')}
          </Text>
          <Text bold color={Colors.danger} fontSize={ms(15)}>
            {t('noStaffMemberAssignedToThisTask')}
          </Text>
        </Box>
      </Box>
    </Box>
  )

  const renderVesselPartSection = () => (
    <Box
      borderColor={Colors.light}
      borderRadius={ms(5)}
      borderWidth={1}
      mt={ms(10)}
      overflow="hidden"
    >
      {/* Vessel Part header */}
      <Box backgroundColor={Colors.border} px={ms(16)} py={ms(10)}>
        <Text bold color={Colors.azure} fontSize={ms(15)}>
          {task?.vesselPart?.name}
        </Text>
      </Box>
      {/* End of Header */}
      <HStack p={ms(14)}>
        <Text color={Colors.disabled} flex="1" fontWeight="medium">
          {t('type')}
        </Text>
        <Text bold color={Colors.text}>
          {/* {task?.vesselPart?.type} */}
          {vesselPartType?.title}
        </Text>
      </HStack>
    </Box>
  )

  const CommentCard = ({comment, commentDescription}: ICommentCard) => {
    return (
      <Box
        bg={Colors.white}
        borderColor={Colors.light}
        borderRadius={5}
        borderWidth={1}
        mt={ms(10)}
        p={ms(16)}
        shadow={2}
      >
        <HStack alignItems="center">
          <Avatar
            source={{
              uri: comment?.user?.icon?.path
                ? `${PROD_URL}/upload/documents/${comment?.user?.icon?.path}`
                : '',
            }}
            size="48px"
          />
          <Box ml={ms(10)}>
            <Text bold>
              {comment?.user ? comment?.user?.firstname : ''}{' '}
              {comment?.user ? comment?.user?.lastname : ''}
            </Text>
            <Text color={Colors.disabled} fontWeight="medium">
              {moment(comment?.creationDate).format('DD MMM YYYY')}
            </Text>
          </Box>
        </HStack>
        <Text fontSize={ms(13)} mt={ms(5)}>
          {commentDescription}
        </Text>
      </Box>
    )
  }

  const renderDocumentsSections = (file: File, index: number) => (
    <TouchableOpacity key={index}>
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
          <IconButton
            size={ms(22)}
            source={Icons.eye}
            styles={{marginLeft: 15}}
            onPress={() =>
              navigation.navigate('PDFView', {
                path: `${VEMASYS_PRODUCTION_FILE_URL}/${file.path}`,
              })
            }
          />
        </HStack>
      </HStack>
    </TouchableOpacity>
  )
  const onDeleteTask = () => {
    Alert.alert(
      t('confirm'),
      t('deleteTaskConfirmationText'),
      [
        {text: t('no'), style: 'cancel'},
        {
          text: t('yes'),
          style: 'destructive',
          onPress: () => handleDeleteTask(),
        },
      ],
      {cancelable: true}
    )
  }

  const onFlagTask = async () => {
    setFlaggedUpdated(!flaggedUpdated)
    const res = await updateVesselTask(task.id, {flagged: !flaggedUpdated})
    if (typeof res === 'object' && res?.id) {
      getVesselTasksCategory(vesselId)
      getVesselTasksByCategory(vesselId, category)
    } else {
      setFlaggedUpdated(!flaggedUpdated)
    }
  }

  const handleDeleteTask = async () => {
    const res = await deleteTask(task?.id)
    if (res === 204) {
      getVesselTasksByCategory(vesselId, category)
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
              Task has been deleted.
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
              Delete failed.
            </Box>
          )
        },
      })
    }
  }

  if (isTechnicalLoading) return <LoadingAnimated />

  return (
    <Box
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
      flex="1"
    >
      <NoInternetConnectionMessage />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
      >
        {/* <Select
          minWidth="300"
          accessibilityLabel=""
          placeholder=""
          bg="#E0E0E0"
        >
          {options?.map((option, index) => (
            <Select.Item
              key={index}
              label={option.label}
              value={option.value}
            />
          ))}
        </Select> */}
        {renderTaskSection()}
        {/* Vessel Part Section */}
        <Text bold color={Colors.text} fontSize={ms(16)} mt={ms(30)}>
          {t('concernedVesselPart')}
        </Text>
        {task?.vesselPart ? renderVesselPartSection() : null}
        {/* End of Vessel Part Section */}
        {/* Comment Section */}
        <HStack alignItems="center" mt={ms(30)}>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('comments')}
          </Text>
          {task?.comments?.length > 0 ? (
            <Text
              bold
              bg={Colors.azure}
              borderRadius={ms(20)}
              color={Colors.white}
              height={ms(22)}
              ml={ms(10)}
              textAlign="center"
              width={ms(22)}
            >
              {task?.comments?.length}
            </Text>
          ) : null}
        </HStack>
        {task?.comments?.map((comment: Comment, index: number) => {
          const filteredDescription = comment.description.replace(/(\\)/g, '')
          const descriptionText = filteredDescription.match(/([^<br>]+)/)[0]
          return (
            <CommentCard
              key={index}
              comment={comment}
              commentDescription={descriptionText}
            />
          )
        })}
        <Button
          bg={Colors.primary}
          leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
          mb={ms(20)}
          mt={ms(20)}
          onPress={() =>
            navigation.navigate('TechnicalTaskNewComment', {taskId: task?.id})
          }
        >
          {t('addComment')}
        </Button>
        {/* End of Comment Section */}
        {/* Documents Section */}
        <HStack alignItems="center" mt={ms(30)}>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('documents')}
          </Text>
          {task?.fileGroup?.files?.length > 0 ? (
            <Text
              bold
              bg={Colors.azure}
              borderRadius={ms(20)}
              color={Colors.white}
              height={ms(22)}
              ml={ms(10)}
              textAlign="center"
              width={ms(22)}
            >
              {task?.fileGroup?.files?.length}
            </Text>
          ) : null}
        </HStack>
        <HStack justifyContent="space-between" mt={ms(10)}>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('file')}
          </Text>
          <Text bold color={Colors.text} fontSize={ms(16)}>
            {t('actions')}
          </Text>
        </HStack>
        <Divider mb={ms(10)} mt={ms(5)} />
        {task?.fileGroup?.files?.length > 0 ? (
          task?.fileGroup?.files?.map((file: File, index: number) =>
            renderDocumentsSections(file, index)
          )
        ) : (
          <Text color={Colors.text} fontWeight="medium" mb={ms(20)}>
            {t('noUploadedFiles')}
          </Text>
        )}
        {/* <Button
          bg={Colors.primary}
          leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
          mt={ms(20)}
          mb={ms(20)}
          onPress={() => {}}
        >
          Add Document
        </Button> */}
        {/* End of Documents Section */}
      </ScrollView>
    </Box>
  )
}

export default TechnicalTaskDetails
