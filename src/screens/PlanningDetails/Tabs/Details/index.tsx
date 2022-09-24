import React, {useEffect, useState} from 'react'
import {RefreshControl, TouchableOpacity} from 'react-native'
import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import DatePicker from 'react-native-date-picker'
import {useNavigation, useRoute} from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import _ from 'lodash'

import {DatetimePickerList} from '../../components'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {
  formatLocationLabel,
  formatNumber,
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT,
  ROLE_PERMISSION_NAVIGATION_LOG_ADD_FILE,
  titleCase,
} from '@bluecentury/constants'
import {PROD_URL} from '@vemasys/env'
import {LoadingAnimated} from '@bluecentury/components'

const Details = () => {
  const toast = useToast()
  const navigation = useNavigation()
  const route = useRoute()
  const {
    isPlanningLoading,
    navigationLogDetails,
    navigationLogActions,
    navigationLogComments,
    getNavigationLogDetails,
    getNavigationLogActions,
    getNavigationLogCargoHolds,
    getNavigationLogComments,
    getNavigationLogDocuments,
    updateNavlogDates,
  } = usePlanning()
  const {user, selectedEntity, physicalVesselId} = useEntity()
  const {navlog}: any = route.params
  const [dates, setDates] = useState({
    captainDatetimeETA: null,
    announcedDatetime: null,
    terminalApprovedDeparture: null,
  })
  const [selectedDate, setSelectedDate] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const hasAddCommentPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT
  )
  const hasAddDocumentPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_NAVIGATION_LOG_ADD_FILE
  )

  useEffect(() => {
    getNavigationLogDetails(navlog?.id)
    getNavigationLogActions(navlog?.id)
    getNavigationLogComments(navlog?.id)
    getNavigationLogDocuments(navlog?.id)
    getNavigationLogCargoHolds(physicalVesselId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnSaveDateUpdates = async () => {
    let updates = Object.entries([dates]).map(keyValue => {
      return keyValue[1]
    })
    const body = {}
    Object.entries(updates[0]).forEach(update => {
      const [field, datetime] = update
      body[field] = datetime
        ? moment(datetime).format()
        : Object.entries(navigationLogDetails).find(keyValue => {
            if (keyValue[0] === field) {
              return keyValue[1]
            }
          })[1]
      if (field === 'departureDatetime') {
        body['modifiedByUser'] = {
          id: user?.id,
        }
        body['modificationDate'] = new Date()
      }
    })

    const isSuccess = await updateNavlogDates(navlog?.id, body)
    if (typeof isSuccess === 'object') {
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
              Updates saved.
            </Text>
          )
        },
      })
    } else {
      toast.show({
        duration: 2000,
        render: () => {
          return (
            <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
              Updates failed.
            </Box>
          )
        },
      })
    }
  }

  const onDatesChange = (date: Date) => {
    if (selectedDate === 'ETA') {
      setDates({...dates, captainDatetimeETA: date})
    } else if (selectedDate === 'NOR') {
      setDates({...dates, announcedDatetime: date})
    } else {
      setDates({...dates, terminalApprovedDeparture: date})
    }
  }

  const renderDetails = () => {
    return (
      <Box
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={5}
        p={ms(20)}
        mt={ms(10)}
        bg={Colors.white}
        shadow={2}
      >
        <HStack alignItems="center">
          <Image alt="navglog-cargo-img" source={Icons.cargo} />
          <Text fontSize={ms(16)} fontWeight="medium" ml={ms(15)}>
            {formatLocationLabel(navigationLogDetails?.location)}
          </Text>
        </HStack>
        {!navigationLogDetails?.captainDatetimeEta &&
        !navigationLogDetails?.plannedEta ? null : (
          <DatetimePickerList
            title="ETA"
            date={
              _.isNull(dates.captainDatetimeETA)
                ? navigationLogDetails?.captainDatetimeEta
                : dates.captainDatetimeETA
            }
            locked={navigationLogDetails?.locked}
            onChangeDate={() => {
              setSelectedDate('ETA'), setOpenDatePicker(true)
            }}
            onClearDate={() => setDates({...dates, captainDatetimeETA: null})}
          />
        )}

        {!navigationLogDetails?.announcedDatetime &&
        !navigationLogDetails?.plannedEta ? null : (
          <DatetimePickerList
            title="NOR"
            date={
              _.isNull(dates.announcedDatetime)
                ? navigationLogDetails?.announcedDatetime
                : dates.announcedDatetime
            }
            locked={navigationLogDetails?.locked}
            onChangeDate={() => {
              setSelectedDate('NOR'), setOpenDatePicker(true)
            }}
            onClearDate={() => setDates({...dates, announcedDatetime: null})}
          />
        )}

        {!navigationLogDetails?.terminalApprovedDeparture &&
        !navigationLogDetails?.plannedEta ? null : (
          <DatetimePickerList
            title="DOC"
            date={
              _.isNull(dates.terminalApprovedDeparture)
                ? navigationLogDetails?.terminalApprovedDeparture
                : dates.terminalApprovedDeparture
            }
            locked={navigationLogDetails?.locked}
            onChangeDate={() => {
              setSelectedDate('DOC'), setOpenDatePicker(true)
            }}
            onClearDate={() =>
              setDates({...dates, terminalApprovedDeparture: null})
            }
          />
        )}

        <Button
          bg={
            _.isNull(
              dates.terminalApprovedDeparture ||
                dates.captainDatetimeETA ||
                dates.announcedDatetime
            )
              ? Colors.disabled
              : Colors.primary
          }
          leftIcon={<Icon as={Ionicons} name="save-outline" size="sm" />}
          mt={ms(20)}
          disabled={
            _.isNull(
              dates.terminalApprovedDeparture ||
                dates.captainDatetimeETA ||
                dates.announcedDatetime
            )
              ? true
              : false
          }
          onPress={handleOnSaveDateUpdates}
        >
          Save Changes
        </Button>
      </Box>
    )
  }

  const CommentCard = ({comment, commentDescription}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate('AddEditComment', {
            comment: comment,
            method: 'edit',
            routeFrom: 'Planning',
          })
        }
      >
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
      </TouchableOpacity>
    )
  }

  const renderContactInformation = (contact: any, index: number) => {
    return (
      <HStack
        key={index}
        p={ms(10)}
        borderWidth={1}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        alignItems="center"
        justifyContent="space-between"
        mb={ms(10)}
        bg={Colors.white}
        shadow={3}
      >
        <Text fontWeight="bold">{contact.name}</Text>
        <Image
          alt="charter-contact"
          source={Icons.charter_contact}
          resizeMode="contain"
        />
      </HStack>
    )
  }

  const onPullToReload = () => {
    getNavigationLogDetails(navlog.id)
    getNavigationLogActions(navlog.id)
    getNavigationLogComments(navlog.id)
    getNavigationLogDocuments(navlog.id)
    getNavigationLogCargoHolds(physicalVesselId)
  }

  if (isPlanningLoading) return <LoadingAnimated />
  return (
    <Box flex="1">
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            onRefresh={onPullToReload}
            refreshing={isPlanningLoading}
          />
        }
        bg={Colors.white}
        px={ms(12)}
        py={ms(20)}
      >
        {/* Details Section */}
        <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
          Details
        </Text>
        {renderDetails()}
        {/* Contact Information Section */}
        <Text
          fontSize={ms(20)}
          fontWeight="bold"
          color={Colors.azure}
          mt={ms(20)}
        >
          Contact Information
        </Text>
        <Box my={ms(15)}>
          {navigationLogDetails?.contacts?.length > 0 ? (
            navigationLogDetails?.contacts.map((contact: any, index: number) =>
              renderContactInformation(contact.contact, index)
            )
          ) : (
            <Box
              borderWidth={1}
              borderColor={Colors.light}
              borderRadius={5}
              p={ms(16)}
              mt={ms(10)}
              bg={Colors.white}
              shadow={2}
            >
              <Text>No contact information found.</Text>
            </Box>
          )}
        </Box>

        {/* Actions Section */}
        <Text
          fontSize={ms(20)}
          fontWeight="bold"
          color={Colors.azure}
          mt={ms(20)}
        >
          Actions
        </Text>
        {navigationLogActions?.length > 0
          ? navigationLogActions?.map((action, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() =>
                  navigation.navigate('AddEditNavlogAction', {
                    method: 'edit',
                    navlogAction: action,
                  })
                }
              >
                <HStack
                  borderWidth={1}
                  borderColor={Colors.light}
                  borderRadius={5}
                  p={ms(10)}
                  mt={ms(10)}
                  bg={Colors.white}
                  shadow={1}
                  alignItems="center"
                >
                  <Box flex="1">
                    <HStack>
                      <Text fontWeight="medium" color={Colors.text}>
                        {titleCase(action.type)}
                      </Text>
                      {action.type.toLowerCase() !== 'cleaning' &&
                      action.navigationBulk ? (
                        <Text
                          fontWeight="medium"
                          color={Colors.text}
                          ml={ms(5)}
                        >
                          {action.navigationBulk.type.nameEN}
                        </Text>
                      ) : null}

                      <Text fontWeight="medium" color={Colors.text} ml={ms(5)}>
                        {action.value && formatNumber(action.value, 0)}
                      </Text>
                    </HStack>
                    <Text color={Colors.disabled}>{`${moment(
                      action.start
                    ).format('DD/MM | HH:mm')} - ${moment(
                      _.isNull(action.end) ? null : action.end
                    ).format('DD/MM | HH:mm')}`}</Text>
                  </Box>
                  <Image
                    alt="navlog-action-icon"
                    source={action.end ? Icons.play : Icons.stop}
                  />
                </HStack>
              </TouchableOpacity>
            ))
          : null}
        <Box>
          <Button
            bg={Colors.primary}
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            mt={ms(20)}
            onPress={() =>
              navigation.navigate('AddEditNavlogAction', {
                method: 'add',
              })
            }
          >
            Start new action
          </Button>
        </Box>
        {/* Comments Section */}
        <HStack alignItems="center" mt={ms(20)}>
          <Text fontSize={ms(20)} fontWeight="bold" color={Colors.azure}>
            Comments
          </Text>
          {navigationLogComments?.length > 0 ? (
            <Box
              bg={Colors.azure}
              borderRadius={ms(20)}
              width={ms(22)}
              height={ms(22)}
              ml={ms(10)}
            >
              <Text color={Colors.white} fontWeight="bold" textAlign="center">
                {navigationLogComments?.length}
              </Text>
            </Box>
          ) : null}
        </HStack>

        {navigationLogComments?.map((comment, index) => {
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
        {hasAddCommentPermission && (
          <Button
            bg={Colors.primary}
            leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
            mt={ms(20)}
            mb={ms(20)}
            onPress={() =>
              navigation.navigate('AddEditComment', {
                method: 'add',
                routeFrom: 'Planning',
              })
            }
          >
            Add comment
          </Button>
        )}

        <DatePicker
          modal
          open={openDatePicker}
          date={new Date()}
          mode="datetime"
          onConfirm={date => {
            setOpenDatePicker(false), onDatesChange(date)
          }}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
        />
      </ScrollView>
    </Box>
  )
}

export default Details
