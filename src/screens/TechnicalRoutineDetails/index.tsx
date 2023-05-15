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
  Pressable,
  ScrollView,
  Select,
  Text,
  useToast,
} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import moment from 'moment'
import {ms} from 'react-native-size-matters'
import _ from 'lodash'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
  IconButton,
  LoadingAnimated,
  NoInternetConnectionMessage,
  TechnicalStatusesModal,
} from '@bluecentury/components'
import {Colors} from '@bluecentury/styles'
import {PROD_URL} from '@vemasys/env'
import {
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_TASK_MANAGE,
  titleCase,
  VEMASYS_PRODUCTION_FILE_URL,
} from '@bluecentury/constants'
import {useEntity, useTechnical} from '@bluecentury/stores'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {useTranslation} from 'react-i18next'
import {showToast} from '@bluecentury/hooks'
import {RootStackParamList} from '@bluecentury/types/nav.types'

type Props = NativeStackScreenProps<RootStackParamList>
const TechnicalRoutineDetails = ({navigation, route}: Props) => {
  const {t} = useTranslation()
  const {id} = route.params
  const {selectedEntity} = useEntity()
  const {
    isTechnicalLoading,
    routineDetails,
    getVesselRoutineDetails,
    updateTaskStatus,
    taskUpdateStatus,
    resetStatuses,
  } = useTechnical()
  const [openStatuses, setOpenStatuses] = useState(false)
  const options = [
    {
      value: 'todo',
      label: 'Todo',
    },
    {value: 'in_progress', label: 'In Progress'},
    {value: 'done', label: 'Done'},
  ]

  useEffect(() => {
    getVesselRoutineDetails(id)
    if (taskUpdateStatus === 'SUCCESS') {
      resetStatuses()
      showToast('Task update successfully.', 'success')
    }
  }, [taskUpdateStatus])

  const renderTitleDescriptionSection = () => (
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
          {routineDetails?.title}
        </Text>
      </Box>
      {/* End of title header */}
      <Box p={ms(12)}>
        <Text color={Colors.disabled} fontWeight="medium">
          {t('description')}
        </Text>
        <Divider my={ms(8)} />
        <Text color={Colors.text} fontSize={ms(13)}>
          {routineDetails?.description}
        </Text>
      </Box>
    </Box>
  )

  const renderType = (type: string) => {
    let iconName
    if (type?.includes('hour')) {
      iconName = 'tachometer-alt'
    } else {
      iconName = 'calendar-alt'
    }
    return (
      <FontAwesome5
        color={Colors.azure}
        name={iconName}
        size={18}
        style={{marginRight: 10, marginLeft: 15}}
      />
    )
  }

  const renderDetailsCard = (
    label: string,
    value: string,
    withIcon?: boolean
  ) => {
    let bgColor
    switch (value) {
      case 'Daily maintenance':
        bgColor = Colors.azure
        break
      case 'Checks':
        bgColor = Colors.azure
        break
      case 'Yearly check':
        bgColor = 'yellow.400'
        break
      default:
        break
    }
    return (
      <HStack
        alignItems="center"
        backgroundColor={Colors.white}
        borderRadius={5}
        height={ms(50)}
        justifyContent="space-between"
        mb={ms(10)}
        px={ms(20)}
        shadow={2}
        width="100%"
      >
        <Text flex="1" fontWeight="medium">
          {label}
        </Text>
        <HStack
          alignItems="center"
          borderColor="#F0F0F0"
          borderLeftWidth={ms(1)}
          flex="1"
          height="100%"
        >
          {withIcon ? renderType(value) : null}
          <Box
            bg={bgColor}
            borderRadius={ms(label === 'Labels' ? 25 : 0)}
            ml={ms(withIcon ? 5 : 15)}
            px={ms(label === 'Labels' ? 10 : 0)}
            py={ms(label === 'Labels' ? 5 : 0)}
          >
            <Text
              color={label === 'Labels' ? Colors.white : Colors.azure}
              fontWeight="medium"
              textAlign="center"
            >
              {t(value)}
            </Text>
          </Box>
        </HStack>
      </HStack>
    )
  }

  const CommentCard = ({comment, commentDescription}) => {
    return (
      <Box
        bg={Colors.white}
        borderColor={Colors.light}
        borderRadius={5}
        borderWidth={1}
        mt={ms(10)}
        p={ms(16)}
        shadow={1}
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

  const onUpdateTaskStatus = (status: string) => {
    updateTaskStatus(routineDetails?.id.toString(), status)
    setOpenStatuses(false)
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
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => setOpenStatuses(true)}>
          <HStack alignItems="center" bg={Colors.grey} borderRadius={5} p={2}>
            <Text bold color={Colors.text} flex="1">
              {titleCase(routineDetails?.openTasks[0]?.status?.code)}
            </Text>
            <Ionicons
              color={Colors.text}
              name="chevron-down-outline"
              size={ms(20)}
            />
          </HStack>
        </Pressable>
        {renderTitleDescriptionSection()}
        <Box mt={ms(10)}>
          {renderDetailsCard(
            'Labels',
            !isTechnicalLoading && routineDetails?.labels?.length > 0
              ? routineDetails?.labels[0]?.title
              : ''
          )}
          {renderDetailsCard(
            t('routineType'),
            routineDetails?.routineType?.title
          )}
          {routineDetails?.vesselPart && routineDetails?.vesselPart?.vesselZone
            ? renderDetailsCard(
                t('vesselZone'),
                routineDetails?.vesselPart?.vesselZone?.title
              )
            : null}
          {renderDetailsCard(t('part'), routineDetails?.vesselPart?.name)}
          {renderDetailsCard(
            t('planning'),
            routineDetails?.scheduleLabel,
            true
          )}
          {routineDetails?.openTasks && routineDetails?.openTasks?.length > 0
            ? renderDetailsCard(
                t('nextOccurence'),
                `${
                  routineDetails?.openTasks[
                    routineDetails?.openTasks?.length - 1
                  ]?.dueHours
                } hours`
              )
            : null}
          {routineDetails?.openTasks && routineDetails?.openTasks?.length > 0
            ? renderDetailsCard(
                t('dueDate'),
                moment(
                  routineDetails?.openTasks[
                    routineDetails?.openTasks?.length - 1
                  ]?.deadline
                ).format('D MMM YYYY')
              )
            : null}
          {/* {renderDetailsCard(
            'Due in',
            `${
              routineDetails?.openTasks[routineDetails?.openTasks.length - 1]
                .dueHours
            } hours`
          )} */}
          {/* {renderDetailsCard('Consumables', routineDetails?.labels[0]?.title)} */}
        </Box>
        {/* {routine?.comments?.map((comment: any, index: number) => {
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
        </Button> */}
        {/* End of Comment Section */}
      </ScrollView>
      <TechnicalStatusesModal
        isOpen={openStatuses}
        options={options}
        setOpen={() => setOpenStatuses(false)}
        onPressStatus={e => onUpdateTaskStatus(e)}
      />
    </Box>
  )
}

export default TechnicalRoutineDetails
