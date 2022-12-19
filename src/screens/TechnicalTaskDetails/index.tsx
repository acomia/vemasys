import React, {useEffect} from 'react'
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

import {IconButton, LoadingAnimated} from '@bluecentury/components'
import {Icons} from '@bluecentury/assets'
import {Colors} from '@bluecentury/styles'
import {PROD_URL} from '@vemasys/env'
import {
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_TASK_MANAGE,
  VEMASYS_PRODUCTION_FILE_URL,
} from '@bluecentury/constants'
import {useEntity, useTechnical} from '@bluecentury/stores'

type Props = NativeStackScreenProps<RootStackParamList>
const TechnicalTaskDetails = ({navigation, route}: Props) => {
  const {task, category} = route.params
  const {selectedEntity, vesselId} = useEntity()
  const {isTechnicalLoading, deleteTask, getVesselTasksByCategory} =
    useTechnical()
  const hasTaskPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_TASK_MANAGE
  )
  const toast = useToast()
  const options = [
    {
      value: 'todo',
      label: 'Todo',
    },
    {value: 'in_progress', label: 'In Progress'},
    {value: 'done', label: 'Done'},
    {value: 'cancel', label: 'Cancel'},
  ]

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HStack>
          {hasTaskPermission ? (
            <>
              <IconButton
                source={Icons.edit}
                onPress={() =>
                  navigation.navigate('AddEditTechnicalTask', {
                    method: 'edit',
                    task: task,
                  })
                }
                size={ms(20)}
              />
              <IconButton
                source={Icons.trash}
                onPress={onDeleteTask}
                size={ms(20)}
                styles={{marginLeft: 20}}
              />
            </>
          ) : null}
        </HStack>
      ),
    })
  }, [])

  const renderLabels = (label: string) => {
    let title = ''
    let color = ''
    let textColor = ''
    switch (label?.toLowerCase()) {
      case 'maintenance':
        title = 'Maintenance'
        color = Colors.primary
        textColor = Colors.white
        break
      case 'check':
        title = 'Check'
        color = Colors.secondary
        textColor = Colors.white
        break
      case 'incident':
        title = 'Incident'
        color = Colors.warning
        textColor = Colors.white
        break
    }
    return (
      <Text
        bg={color}
        py={ms(5)}
        px={ms(20)}
        borderRadius={ms(25)}
        fontWeight="medium"
        fontSize={ms(12)}
        color={textColor}
        maxW={ms(150)}
        textAlign="center"
      >
        {title}
      </Text>
    )
  }

  const renderTaskSection = () => (
    <Box
      borderRadius={ms(5)}
      borderWidth={1}
      borderColor={Colors.light}
      mt={ms(10)}
      overflow="hidden"
    >
      {/* Title header */}
      <Box backgroundColor={Colors.border} px={ms(16)} py={ms(10)}>
        <Text color={Colors.azure} bold fontSize={ms(15)}>
          {task?.title}
        </Text>
      </Box>
      {/* End of title header */}
      {/* Content */}
      <Box py={ms(14)}>
        <Box px={ms(14)}>
          <Text fontWeight="medium" color={Colors.disabled}>
            Task type
          </Text>
          <Text fontSize={ms(16)} bold color={Colors.text}>
            Technical Task
          </Text>
        </Box>
        <Divider my={ms(12)} />
        <Box px={ms(14)}>{renderLabels(task?.labels[0]?.title)}</Box>
        <Divider my={ms(12)} />
        <Box px={ms(14)}>
          <Text fontWeight="medium" color={Colors.disabled}>
            Date created
          </Text>
          <Text fontSize={ms(15)}>
            {task?.deadline
              ? moment(task?.deadline).format('D MMM YYYY; hh:mm A')
              : 'Not set'}
          </Text>
        </Box>
        <Divider my={ms(12)} />
        <Box px={ms(14)}>
          <Text fontWeight="medium" color={Colors.disabled}>
            Scheduled date
          </Text>
          <Text fontSize={ms(15)}>
            {task?.deadline
              ? moment(task?.deadline).format('D MMM YYYY; hh:mm A')
              : 'Not set'}
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
          <Text fontWeight="medium" color={Colors.disabled}>
            Assigned to
          </Text>
          <Text fontSize={ms(15)} bold color={Colors.danger}>
            No staff member assigned to this task
          </Text>
        </Box>
      </Box>
    </Box>
  )

  const renderVesselPartSection = () => (
    <Box
      borderRadius={ms(5)}
      borderWidth={1}
      borderColor={Colors.light}
      mt={ms(10)}
      overflow="hidden"
    >
      {/* Vessel Part header */}
      <Box backgroundColor={Colors.border} px={ms(16)} py={ms(10)}>
        <Text color={Colors.azure} bold fontSize={ms(15)}>
          {task?.vesselPart?.name}
        </Text>
      </Box>
      {/* End of Header */}
      <HStack p={ms(14)}>
        <Text flex="1" fontWeight="medium" color={Colors.disabled}>
          Type
        </Text>
        <Text bold color={Colors.text}>
          {task?.vesselPart?.type}
        </Text>
      </HStack>
    </Box>
  )

  const CommentCard = ({comment, commentDescription}) => {
    return (
      <Box
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={5}
        p={ms(16)}
        mt={ms(10)}
        bg={Colors.white}
        shadow={2}
      >
        <HStack alignItems="center">
          <Avatar
            size="48px"
            source={{
              uri: comment?.user?.icon?.path
                ? `${PROD_URL}/upload/documents/${comment?.user?.icon?.path}`
                : '',
            }}
          />
          <Box ml={ms(10)}>
            <Text bold>
              {comment?.user ? comment?.user?.firstname : ''}{' '}
              {comment?.user ? comment?.user?.lastname : ''}
            </Text>
            <Text fontWeight="medium" color={Colors.disabled}>
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

  const renderDocumentsSections = (file: any, index: number) => (
    <TouchableOpacity key={index}>
      <HStack
        bg={Colors.white}
        borderRadius={5}
        justifyContent="space-between"
        alignItems="center"
        height={ms(50)}
        px={ms(16)}
        width="100%"
        mb={ms(15)}
        shadow={3}
      >
        <Text
          flex="1"
          maxW="80%"
          fontWeight="medium"
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {file.path}
        </Text>
        <HStack alignItems="center">
          <IconButton
            source={Icons.file_download}
            onPress={() => {}}
            size={ms(22)}
          />
          <IconButton
            source={Icons.eye}
            onPress={() =>
              navigation.navigate('PDFView', {
                path: `${VEMASYS_PRODUCTION_FILE_URL}/${file.path}`,
              })
            }
            size={ms(22)}
            styles={{marginLeft: 15}}
          />
        </HStack>
      </HStack>
    </TouchableOpacity>
  )
  const onDeleteTask = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this task?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => handleDeleteTask(),
        },
      ],
      {cancelable: true}
    )
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
              px="2"
              py="1"
              rounded="sm"
              mb={5}
              color={Colors.white}
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
            <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
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
      flex="1"
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
    >
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
        <Text mt={ms(30)} fontSize={ms(16)} bold color={Colors.text}>
          Concerned Vessel Part
        </Text>
        {task?.vesselPart ? renderVesselPartSection() : null}
        {/* End of Vessel Part Section */}
        {/* Comment Section */}
        <HStack alignItems="center" mt={ms(30)}>
          <Text fontSize={ms(16)} bold color={Colors.text}>
            Comments
          </Text>
          {task?.comments?.length > 0 ? (
            <Text
              bg={Colors.azure}
              color={Colors.white}
              width={ms(22)}
              height={ms(22)}
              ml={ms(10)}
              borderRadius={ms(20)}
              bold
              textAlign="center"
            >
              {task?.comments?.length}
            </Text>
          ) : null}
        </HStack>
        {task?.comments?.map((comment: any, index: number) => {
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
          mt={ms(20)}
          mb={ms(20)}
          onPress={() =>
            navigation.navigate('TechnicalTaskNewComment', {taskId: task?.id})
          }
        >
          Add Comment
        </Button>
        {/* End of Comment Section */}
        {/* Documents Section */}
        <HStack alignItems="center" mt={ms(30)}>
          <Text fontSize={ms(16)} bold color={Colors.text}>
            Documents
          </Text>
          {task?.fileGroup?.files?.length > 0 ? (
            <Text
              bg={Colors.azure}
              color={Colors.white}
              width={ms(22)}
              height={ms(22)}
              ml={ms(10)}
              borderRadius={ms(20)}
              bold
              textAlign="center"
            >
              {task?.fileGroup?.files?.length}
            </Text>
          ) : null}
        </HStack>
        <HStack mt={ms(10)} justifyContent="space-between">
          <Text fontSize={ms(16)} bold color={Colors.text}>
            File
          </Text>
          <Text fontSize={ms(16)} bold color={Colors.text}>
            Actions
          </Text>
        </HStack>
        <Divider mb={ms(10)} mt={ms(5)} />
        {task?.fileGroup?.files?.length > 0 ? (
          task?.fileGroup?.files?.map((file: any, index: number) =>
            renderDocumentsSections(file, index)
          )
        ) : (
          <Text mb={ms(20)} color={Colors.text} fontWeight="medium">
            No uploaded files.
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
