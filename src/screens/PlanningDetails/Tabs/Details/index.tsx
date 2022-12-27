import React, {useEffect, useState} from 'react'
import {RefreshControl, TouchableOpacity, FlatList} from 'react-native'
import {
  Avatar,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Image,
  Modal,
  ScrollView,
  Text,
  useToast,
} from 'native-base'
import {ms} from 'react-native-size-matters'
import DatePicker from 'react-native-date-picker'
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from 'moment'
import _ from 'lodash'

import {DatetimePickerList} from '../../components'
import {Colors} from '@bluecentury/styles'
import {Animated, Icons} from '@bluecentury/assets'
import {useEntity, usePlanning} from '@bluecentury/stores'
import {
  formatLocationLabel,
  hasSelectedEntityUserPermission,
  ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT,
  ROLE_PERMISSION_NAVIGATION_LOG_ADD_FILE,
  titleCase,
} from '@bluecentury/constants'
import {PROD_URL} from '@vemasys/env'
import {LoadingAnimated} from '@bluecentury/components'

type Dates = {
  plannedEta: Date | undefined | StringOrNull
  captainDatetimeEta: Date | undefined | StringOrNull
  announcedDatetime: Date | undefined | StringOrNull
  arrivalDatetime: Date | undefined | StringOrNull
  terminalApprovedDeparture: Date | undefined | StringOrNull
  departureDatetime: Date | undefined | StringOrNull
}

const Details = () => {
  const toast = useToast()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute()
  const focused = useIsFocused()
  const {
    isPlanningLoading,
    navigationLogDetails,
    navigationLogComments,
    navigationLogActions,
    getNavigationLogDetails,
    getNavigationLogActions,
    getNavigationLogCargoHolds,
    getNavigationLogComments,
    getNavigationLogDocuments,
    updateNavlogDates,
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    updateNavigationLogAction,
    isUpdateNavLogActionSuccess,
    isCreateNavLogActionSuccess,
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
    arrivalDatetime:
      navlog !== undefined ? navigationLogDetails?.arrivalDatetime : null,
    terminalApprovedDeparture:
      navlog !== undefined
        ? navigationLogDetails?.terminalApprovedDeparture
        : null,
    departureDatetime:
      navlog !== undefined ? navigationLogDetails?.departureDatetime : null,
  })

  const [viewImg, setViewImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState<ImageFile>({})
  const [selectedDate, setSelectedDate] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [activeActions, setActiveActions] = useState([])
  const [buttonActionLabel, setButtonActionLabel] = useState('Loading')
  const [selectedAction, setSelectedAction] = useState<NavigationLogAction>({})
  const [confirmModal, setConfirmModal] = useState(false)
  const hasAddCommentPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT
  )
  const isUnknownLocation = title === 'Unknown Location' ? true : false

  useEffect(() => {
    getNavigationLogDetails(navlog?.id)
    getNavigationLogActions(navlog?.id)
    getNavigationLogComments(navlog?.id)
    // getNavigationLogCargoHolds(physicalVesselId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const active = navigationLogActions?.filter(action => _.isNull(action?.end))
    setActiveActions(active)
  }, [navigationLogActions, isCreateNavLogActionSuccess])

  useEffect(() => {
    if (
      navigationLogDetails?.bulkCargo?.some(cargo => cargo.isLoading === false)
    ) {
      setButtonActionLabel('Unloading')
    } else {
      setButtonActionLabel('Loading')
    }
    if (updateNavlogDatesSuccess === 'SUCCESS') {
      showToast('Updates saved.', 'success')
    }
    if (updateNavlogDatesFailed === 'FAILED') {
      showToast(updateNavlogDatesMessage, 'failed')
    }
    if (isUpdateNavLogActionSuccess && focused) {
      showToast('Action ended.', 'success')
    }
  }, [
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    isUpdateNavLogActionSuccess,
  ])

  const onSelectImage = (image: ImageFile) => {
    setViewImg(true)
    setSelectedImg(image)
  }

  const showToast = (text: string, res: string) => {
    toast.show({
      duration: 2000,
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
        res === 'success' ? onSuccess() : reset()
      },
    })
  }

  const onSuccess = () => {
    onPullToReload()
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
      case 'ARR':
        setDates({...dates, arrivalDatetime: date})
        return
      case 'DOC':
        setDates({...dates, terminalApprovedDeparture: date})
        return
      case 'DEP':
        setDates({...dates, departureDatetime: date})
        return
    }
  }

  const renderLocation = () => (
    <HStack alignItems="center">
      <Image
        alt="navglog-cargo-img"
        source={isUnknownLocation ? Icons.map_marker_question : Icons.cargo}
      />
      <Text fontSize={ms(16)} fontWeight="medium" ml={ms(20)}>
        {formatLocationLabel(navigationLogDetails?.location)}
      </Text>
    </HStack>
  )

  const renderPlanningDates = () => (
    <Box>
      <DatetimePickerList
        title="Planned"
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
    </Box>
  )

  const renderAnnouncingAndArrivalDates = () => (
    <Box>
      <DatetimePickerList
        title="Notice of Readiness"
        date={dates.announcedDatetime}
        locked={isUnknownLocation ? true : navigationLogDetails?.locked}
        onChangeDate={() => {
          setSelectedDate('NOR')
          setOpenDatePicker(true)
        }}
        onClearDate={() => setDates({...dates, announcedDatetime: null})}
      />

      <DatetimePickerList
        title="Arrival"
        date={dates.arrivalDatetime}
        readOnly={true}
      />
    </Box>
  )

  const renderDepartureDates = () => (
    <Box>
      <DatetimePickerList
        title="Docs on Board"
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

      <DatetimePickerList
        title="Departure"
        date={dates.departureDatetime}
        readOnly={true}
      />
    </Box>
  )

  const renderNavlogActions = () => (
    <Box>
      {activeActions?.map((action: any, index) => (
        <TouchableOpacity
          key={`action-${index}`}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('AddEditNavlogAction', {
              method: 'edit',
              navlogAction: action,
              actionType: action?.type,
            })
          }
        >
          <HStack
            borderWidth={1}
            borderColor={Colors.light}
            borderRadius={5}
            px={ms(12)}
            py={ms(8)}
            mt={ms(10)}
            bg={Colors.white}
            shadow={1}
            alignItems="center"
          >
            <Image
              alt="navlog-action-animated"
              source={renderAnimatedIcon(action?.type, action?.end)}
              width={ms(40)}
              height={ms(40)}
              resizeMode="contain"
              mr={ms(10)}
            />
            <Box flex="1">
              <HStack alignItems="center">
                <Text bold fontSize={ms(15)} color={Colors.text}>
                  {titleCase(action?.type)}
                </Text>
              </HStack>
              <Text color={Colors.secondary} fontWeight="medium">
                Start - {moment(action?.start).format('D MMM YYYY | hh:mm')}
              </Text>
              {_.isNull(action?.end) ? null : (
                <Text color={Colors.danger} fontWeight="medium">
                  End - {moment(action?.end).format('D MMM YYYY | hh:mm')}
                </Text>
              )}
            </Box>
            <TouchableOpacity
              disabled={_.isNull(action?.end) ? false : true}
              activeOpacity={0.7}
              onPress={() => confirmStopAction(action)}
            >
              <Image
                alt="navlog-action-icon"
                source={_.isNull(action?.end) ? Icons.stop : null}
              />
            </TouchableOpacity>
          </HStack>
        </TouchableOpacity>
      ))}
      <HStack mt={ms(15)}>
        <Button
          flex="1"
          maxH={ms(40)}
          bg={Colors.primary}
          leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
          onPress={() =>
            navigation.navigate('AddEditNavlogAction', {
              method: 'add',
              actionType: buttonActionLabel,
            })
          }
        >
          <Text fontWeight="medium" color={Colors.white}>
            New {buttonActionLabel}
          </Text>
        </Button>
        <Box w={ms(10)} />
        <Button
          flex="1"
          maxH={ms(40)}
          bg={Colors.primary}
          leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
          onPress={() =>
            navigation.navigate('AddEditNavlogAction', {
              method: 'add',
              actionType: 'Cleaning',
            })
          }
        >
          <Text fontWeight="medium" color={Colors.white}>
            Cleaning
          </Text>
        </Button>
      </HStack>
    </Box>
  )

  const CommentCard = ({comment, commentDescription}) => {
    let imgLinks: string[] = []
    let getAttrFromString = (str: string) => {
      let regex = /<img.*?src='(.*?)'/gi,
        result,
        res = []
      while ((result = regex.exec(str))) {
        res.push(result[1])
      }
      imgLinks = res
    }
    getAttrFromString(comment.description)
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
          {imgLinks.length > 0 ? (
            <FlatList
              keyExtractor={item => item}
              scrollEventThrottle={16}
              // maxH={ms(120)}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={imgLinks}
              removeClippedSubviews={true}
              renderItem={image => {
                const file = {
                  uri: image.item,
                  fileName: image.item,
                  type: 'image/jpeg',
                }
                return (
                  <TouchableOpacity onPress={() => onSelectImage(file)}>
                    <Image
                      alt="file-upload"
                      source={{uri: image.item}}
                      w={ms(136)}
                      h={ms(114)}
                      mr={ms(10)}
                    />
                  </TouchableOpacity>
                )
              }}
            />
          ) : null}
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
        <Text bold>{contact.name}</Text>
        <Image
          alt="charter-contact"
          source={Icons.charter_contact}
          resizeMode="contain"
        />
      </HStack>
    )
  }

  const renderAnimatedIcon = (type: string, end: Date) => {
    switch (type?.toLowerCase()) {
      case 'unloading':
        return _.isNull(end) ? Animated.nav_unloading : Icons.unloading
      case 'loading':
        return _.isNull(end) ? Animated.nav_loading : Icons.loading
      case 'cleaning':
        return _.isNull(end) ? Animated.cleaning : Icons.broom
      default:
        break
    }
  }

  const confirmStopAction = (action: any) => {
    setConfirmModal(true)
    setSelectedAction({
      ...selectedAction,
      id: action.id,
      type: titleCase(action.type),
      start: action.start,
      estimatedEnd: action.estimatedEnd,
      end: new Date(),
      cargoHoldActions: [
        {
          navigationBulk: action?.navigationBulk?.id,
          amount: action?.navigationBulk?.amount.toString(),
        },
      ],
    })
  }

  const onStopAction = () => {
    setConfirmModal(false)
    updateNavigationLogAction(
      selectedAction?.id,
      navigationLogDetails?.id,
      selectedAction
    )
  }

  const onPullToReload = () => {
    getNavigationLogDetails(navlog.id)
    getNavigationLogActions(navlog?.id)
    getNavigationLogComments(navlog.id)
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
        {/* Location Section */}
        <Text fontSize={ms(20)} bold color={Colors.azure}>
          Location
        </Text>
        <Divider bg={Colors.light} my={ms(8)} h={ms(2)} />
        {renderLocation()}
        {/* End of Location Section */}
        {/* Planning dates Section */}
        <Text fontSize={ms(20)} bold color={Colors.azure} mt={ms(20)}>
          Planning
        </Text>
        <Divider bg={Colors.light} my={ms(8)} h={ms(2)} />
        {renderPlanningDates()}
        {/* End of Planning dates Section */}
        {/* Announcing&Arrival dates Section */}
        <Text fontSize={ms(20)} bold color={Colors.azure} mt={ms(10)}>
          Announcing and Arrival
        </Text>
        <Divider bg={Colors.light} my={ms(8)} h={ms(2)} />
        {renderAnnouncingAndArrivalDates()}
        {/* End of Announcing&Arrival dates Section */}
        {/* Actions Section */}
        <Text fontSize={ms(20)} bold color={Colors.azure} mt={ms(10)}>
          Actions
        </Text>
        <Divider bg={Colors.light} my={ms(8)} h={ms(2)} />
        {renderNavlogActions()}
        {/* End of Actions Section */}
        {/* Announcing&Arrival dates Section */}
        <Text fontSize={ms(20)} bold color={Colors.azure} mt={ms(20)}>
          Departure
        </Text>
        <Divider bg={Colors.light} my={ms(8)} h={ms(2)} />
        {renderDepartureDates()}
        {/* End of Announcing&Arrival dates Section */}
        <Button
          bg={
            _.isNull(
              dates.terminalApprovedDeparture ||
                dates.captainDatetimeEta ||
                dates.announcedDatetime ||
                dates.plannedEta
            )
              ? Colors.disabled
              : Colors.primary
          }
          leftIcon={<Icon as={Ionicons} name="save-outline" size="sm" />}
          mt={ms(15)}
          disabled={
            _.isNull(
              dates.terminalApprovedDeparture ||
                dates.captainDatetimeEta ||
                dates.announcedDatetime ||
                dates.plannedEta
            )
              ? true
              : false
          }
          onPress={handleOnSaveDateUpdates}
        >
          Save Changes
        </Button>
        {/* Contact Information Section */}
        {isUnknownLocation ? null : (
          <>
            <Text fontSize={ms(20)} bold color={Colors.azure} mt={ms(20)}>
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
          <Text fontSize={ms(20)} bold color={Colors.azure}>
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
              <Text color={Colors.white} bold textAlign="center">
                {navigationLogComments?.length}
              </Text>
            </Box>
          ) : null}
        </HStack>

        {navigationLogComments?.map((comment, index) => {
          const descriptionText = comment.description.match(/^[^-<]*/)
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
        <Modal
          isOpen={confirmModal}
          size="full"
          px={ms(12)}
          animationPreset="slide"
        >
          <Modal.Content>
            <Modal.Header>Confirmation</Modal.Header>
            <Text my={ms(20)} mx={ms(12)} fontWeight="medium">
              Are you sure you want to stop this action?
            </Text>
            <HStack>
              <Button
                flex="1"
                m={ms(12)}
                bg={Colors.grey}
                onPress={() => setConfirmModal(false)}
              >
                <Text fontWeight="medium" color={Colors.disabled}>
                  Cancel
                </Text>
              </Button>
              <Button
                flex="1"
                m={ms(12)}
                bg={Colors.danger}
                onPress={onStopAction}
              >
                <Text fontWeight="medium" color={Colors.white}>
                  Stop
                </Text>
              </Button>
            </HStack>
          </Modal.Content>
        </Modal>
      </ScrollView>
      <Modal isOpen={viewImg} size="full" onClose={() => setViewImg(false)}>
        <Modal.Content>
          <Image
            alt="file-preview"
            source={{uri: selectedImg.uri}}
            resizeMode="contain"
            w="100%"
            h="100%"
          />
        </Modal.Content>
      </Modal>
    </Box>
  )
}

export default Details
