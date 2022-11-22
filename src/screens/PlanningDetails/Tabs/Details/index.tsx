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
import {NavigationProp, useNavigation, useRoute} from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import _ from 'lodash'

import {DatetimePickerList} from '../../components'
import {Colors} from '@bluecentury/styles'
import {Icons} from '@bluecentury/assets'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {
  formatLocationLabel,
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT,
  ROLE_PERMISSION_NAVIGATION_LOG_ADD_FILE,
} from '@bluecentury/constants'
import {PROD_URL} from '@vemasys/env'
import {LoadingAnimated} from '@bluecentury/components'

type Dates = {
  plannedEta: Date | undefined | StringOrNull
  captainDatetimeEta: Date | undefined | StringOrNull
  announcedDatetime: Date | undefined | StringOrNull
  terminalApprovedDeparture: Date | undefined | StringOrNull
}

const Details = () => {
  const toast = useToast()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute()
  const {
    isPlanningLoading,
    navigationLogDetails,
    navigationLogComments,
    getNavigationLogDetails,
    getNavigationLogActions,
    getNavigationLogCargoHolds,
    getNavigationLogComments,
    getNavigationLogDocuments,
    updateNavlogDates,
    isUpdateNavlogDatesSuccess,
    reset,
  } = usePlanning()
  const {user, selectedEntity, physicalVesselId} = useEntity()
  const {navlog, title}: any = route.params
  const [dates, setDates] = useState<Dates>({
    plannedEta: navlog !== undefined ? navigationLogDetails?.plannedEta : null,
    captainDatetimeEta:
      navlog !== undefined ? navigationLogDetails?.captainDatetimeEta : null,
    announcedDatetime:
      navlog !== undefined ? navigationLogDetails?.announcedDatetime : null,
    terminalApprovedDeparture:
      navlog !== undefined
        ? navigationLogDetails?.terminalApprovedDeparture
        : null,
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
  const isUnknownLocation = title === 'Unknown Location' ? true : false

  useEffect(() => {
    getNavigationLogDetails(navlog?.id)
    getNavigationLogActions(navlog?.id)
    getNavigationLogComments(navlog?.id)
    getNavigationLogDocuments(navlog?.id)
    getNavigationLogCargoHolds(physicalVesselId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isUpdateNavlogDatesSuccess) {
      showToast('Updates saved.', 'success')
    }
  }, [isUpdateNavlogDatesSuccess])

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
        res === 'success' ? onSuccess() : null
      },
    })
  }

  const onSuccess = () => {
    getNavigationLogDetails(navlog?.id)
    reset()
  }

  const handleOnSaveDateUpdates = async () => {
    updateNavlogDates(navlog?.id, dates)
  }

  const onDatesChange = (date: Date) => {
    switch (selectedDate) {
      case 'PLN':
        setDates({...dates, plannedEta: date})
        return
      case 'ETA':
        setDates({...dates, captainDatetimeEta: date})
        return
      case 'NOR':
        setDates({...dates, announcedDatetime: date})
        return
      case 'DOC':
        setDates({...dates, terminalApprovedDeparture: date})
        return
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
          <Image
            alt="navglog-cargo-img"
            source={isUnknownLocation ? Icons.map_marker_question : Icons.cargo}
          />
          <Text fontSize={ms(16)} fontWeight="medium" ml={ms(15)}>
            {formatLocationLabel(navigationLogDetails?.location)}
          </Text>
        </HStack>
        <DatetimePickerList
          title="PLN"
          date={dates.plannedEta}
          locked={isUnknownLocation ? true : navigationLogDetails?.locked}
          onChangeDate={() => {
            setSelectedDate('PLN')
            setOpenDatePicker(true)
          }}
          onClearDate={() => setDates({...dates, plannedEta: null})}
        />
        <DatetimePickerList
          title="ETA"
          date={dates.captainDatetimeEta}
          locked={isUnknownLocation ? true : navigationLogDetails?.locked}
          onChangeDate={() => {
            setSelectedDate('ETA')
            setOpenDatePicker(true)
          }}
          onClearDate={() => setDates({...dates, captainDatetimeEta: null})}
        />

        <DatetimePickerList
          title="NOR"
          date={dates.announcedDatetime}
          locked={isUnknownLocation ? true : navigationLogDetails?.locked}
          onChangeDate={() => {
            setSelectedDate('NOR')
            setOpenDatePicker(true)
          }}
          onClearDate={() => setDates({...dates, announcedDatetime: null})}
        />

        <DatetimePickerList
          title="DOC"
          date={dates.terminalApprovedDeparture}
          locked={isUnknownLocation ? true : navigationLogDetails?.locked}
          onChangeDate={() => {
            setSelectedDate('DOC')
            setOpenDatePicker(true)
          }}
          onClearDate={() =>
            setDates({...dates, terminalApprovedDeparture: null})
          }
        />

        <Button
          bg={
            _.isNull(
              dates.terminalApprovedDeparture ||
                dates.captainDatetimeEta ||
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
                dates.captainDatetimeEta ||
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
        {isUnknownLocation ? null : (
          <>
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
                navigationLogDetails?.contacts.map(
                  (contact: any, index: number) =>
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
          </>
        )}

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
            setOpenDatePicker(false)
            onDatesChange(date)
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
