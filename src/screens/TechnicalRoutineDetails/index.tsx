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
  useToast
} from 'native-base'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import moment from 'moment'
import {ms} from 'react-native-size-matters'
import _ from 'lodash'

import {IconButton, LoadingIndicator} from '@bluecentury/components'
import {Colors} from '@bluecentury/styles'
import {PROD_URL} from '@bluecentury/env'
import {
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_TASK_MANAGE,
  VEMASYS_PRODUCTION_FILE_URL
} from '@bluecentury/constants'
import {useEntity, useTechnical} from '@bluecentury/stores'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

type Props = NativeStackScreenProps<RootStackParamList>
const TechnicalRoutineDetails = ({navigation, route}: Props) => {
  const {id} = route.params
  const {selectedEntity} = useEntity()
  const {isTechnicalLoading, routineDetails, getVesselRoutineDetails} =
    useTechnical()
  const hasTaskPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_TASK_MANAGE
  )

  useEffect(() => {
    getVesselRoutineDetails(id)
  }, [])

  const {routineType, vesselPart, scheduleLabel, openTasks}: any =
    routineDetails

  const renderTitleDescriptionSection = () => (
    <Box
      borderRadius={ms(5)}
      borderWidth={1}
      borderColor={Colors.light}
      overflow="hidden"
    >
      {/* Title header */}
      <Box backgroundColor={Colors.border} px={ms(16)} py={ms(10)}>
        <Text color={Colors.azure} fontWeight="bold" fontSize={ms(15)}>
          {routineDetails?.title}
        </Text>
      </Box>
      {/* End of title header */}
      <Box p={ms(12)}>
        <Text fontWeight="medium" color={Colors.disabled}>
          Description
        </Text>
        <Divider my={ms(8)} />
        <Text fontSize={ms(13)} color={Colors.text}>
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
        name={iconName}
        size={18}
        color={Colors.azure}
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
        backgroundColor={Colors.white}
        borderRadius={5}
        justifyContent="space-between"
        alignItems="center"
        height={ms(50)}
        px={ms(20)}
        width="100%"
        mb={ms(10)}
        shadow={2}
      >
        <Text flex={1} fontWeight="medium">
          {label}
        </Text>
        <HStack
          flex={1}
          borderLeftWidth={ms(1)}
          borderColor="#F0F0F0"
          height="100%"
          alignItems="center"
        >
          {withIcon ? renderType(value) : null}
          <Text
            fontWeight="medium"
            ml={ms(withIcon ? 5 : 15)}
            color={label === 'Labels' ? Colors.white : Colors.azure}
            // Label styles
            py={ms(label === 'Labels' ? 5 : 0)}
            px={ms(label === 'Labels' ? 10 : 0)}
            bg={bgColor}
            borderRadius={ms(label === 'Labels' ? 25 : 0)}
          >
            {value}
          </Text>
        </HStack>
      </HStack>
    )
  }

  const CommentCard = ({comment, commentDescription}) => {
    return (
      <Box
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={5}
        p={ms(16)}
        mt={ms(10)}
        bg={Colors.white}
        shadow={1}
      >
        <HStack alignItems="center">
          <Avatar
            size="48px"
            source={{
              uri: comment?.user?.icon?.path
                ? `${PROD_URL}/upload/documents/${comment?.user?.icon?.path}`
                : ''
            }}
          />
          <Box ml={ms(10)}>
            <Text fontWeight="bold">
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

  if (isTechnicalLoading) return <LoadingIndicator />

  return (
    <Box
      flex="1"
      bg={Colors.white}
      borderTopLeftRadius={ms(15)}
      borderTopRightRadius={ms(15)}
    >
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        scrollEventThrottle={16}
        px={ms(12)}
        py={ms(20)}
        showsVerticalScrollIndicator={false}
      >
        {renderTitleDescriptionSection()}
        <Box mt={ms(10)}>
          {renderDetailsCard(
            'Labels',
            routineDetails?.labels.length > 0
              ? routineDetails?.labels[0]?.title
              : ''
          )}
          {renderDetailsCard('Routine Type', routineType?.title)}
          {vesselPart && vesselPart?.vesselZone
            ? renderDetailsCard('Vessel Zone', vesselPart?.vesselZone?.title)
            : null}
          {renderDetailsCard('Part', vesselPart?.name)}
          {renderDetailsCard('Planning', scheduleLabel, true)}
          {openTasks && openTasks?.length > 0
            ? renderDetailsCard(
                'Next Occurence',
                `${openTasks[openTasks?.length - 1]?.dueHours} hours`
              )
            : null}
          {openTasks && openTasks?.length > 0
            ? renderDetailsCard(
                'Due Date',
                moment(openTasks[openTasks.length - 1]?.deadline).format(
                  'D MMM YYYY'
                )
              )
            : null}
          {/* {renderDetailsCard(
            'Due in',
            `${openTasks[openTasks.length - 1].dueHours} hours`
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
    </Box>
  )
}

export default TechnicalRoutineDetails
