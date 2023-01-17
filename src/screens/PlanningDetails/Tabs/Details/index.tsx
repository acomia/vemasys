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
  titleCase,
} from '@bluecentury/constants'
import {PROD_URL} from '@vemasys/env'
import {LoadingAnimated} from '@bluecentury/components'
import {Vemasys} from '@bluecentury/helpers'
import {useTranslation} from 'react-i18next'
import {Shadow} from 'react-native-shadow-2'

type Dates = {
  plannedETA: Date | undefined | StringOrNull
  captainDatetimeETA: Date | undefined | StringOrNull
  announcedDatetime: Date | undefined | StringOrNull
  arrivalDatetime: Date | undefined | StringOrNull
  terminalApprovedDeparture: Date | undefined | StringOrNull
  departureDatetime: Date | undefined | StringOrNull
}
const Details = () => {
  const {t} = useTranslation()
  const toast = useToast()
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute()
  const focused = useIsFocused()
  const {
    isPlanningLoading,
    isPlanningDetailsLoading,
    isPlanningActionsLoading,
    isPlanningCommentsLoading,
    navigationLogDetails,
    navigationLogComments,
    navigationLogActions,
    getNavigationLogDetails,
    getNavigationLogActions,
    getNavigationLogComments,
    updateNavlogDates,
    updateNavlogDatesSuccess,
    updateNavlogDatesFailed,
    updateNavlogDatesMessage,
    updateNavigationLogAction,
    isUpdateNavLogActionSuccess,
    isCreateNavLogActionSuccess,
    reset,
  } = usePlanning()
  const {selectedEntity} = useEntity()
  const {navlog, title}: any = route.params
  const [dates, setDates] = useState<Dates>({
    plannedETA: navigationLogDetails?.plannedEta,
    captainDatetimeETA: navigationLogDetails?.captainDatetimeEta,
    announcedDatetime: navigationLogDetails?.announcedDatetime,
    arrivalDatetime: navigationLogDetails?.arrivalDatetime,
    terminalApprovedDeparture: navigationLogDetails?.terminalApprovedDeparture,
    departureDatetime: navigationLogDetails?.departureDatetime,
  })
  const [didDateChange, setDidDateChange] = useState({
    Pln: {didUpdate: false},
    Eta: {didUpdate: false},
    Nor: {didUpdate: false},
    Doc: {didUpdate: false},
  })

  const [viewImg, setViewImg] = useState(false)
  const [selectedImg, setSelectedImg] = useState<ImageFile>({})
  const [selectedType, setSelectedType] = useState('')
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [activeActions, setActiveActions] = useState([])
  const [buttonActionLabel, setButtonActionLabel] = useState(' ')
  const [selectedAction, setSelectedAction] = useState<NavigationLogAction>({})
  const [confirmModal, setConfirmModal] = useState(false)
  const [leaveTabModal, setLeaveTabModal] = useState(false)
  const hasAddCommentPermission = hasSelectedEntityUserPermission(
    selectedEntity,
    ROLE_PERMISSION_NAVIGATION_LOG_ADD_COMMENT
  )
  const isUnknownLocation = title === 'Unknown Location' ? true : false
  const unsavedChanges = Object.values(didDateChange).filter(
    date => date.didUpdate === true
  )

  useEffect(() => {
    if (!focused && unsavedChanges.length > 0) {
      setLeaveTabModal(true)
    }
  }, [focused])

  useEffect(() => {
    getNavigationLogDetails(navlog?.id)
    getNavigationLogActions(navlog?.id)
    getNavigationLogComments(navlog?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const active = navigationLogActions?.filter(action => _.isNull(action?.end))
    setActiveActions(active)
    setDates({
      ...dates,
      plannedETA: navigationLogDetails?.plannedEta,
      captainDatetimeETA: navigationLogDetails?.captainDatetimeEta,
      announcedDatetime: navigationLogDetails?.announcedDatetime,
      arrivalDatetime: navigationLogDetails?.arrivalDatetime,
      terminalApprovedDeparture:
        navigationLogDetails?.terminalApprovedDeparture,
      departureDatetime: navigationLogDetails?.departureDatetime,
    })
    if (
      navigationLogDetails?.bulkCargo?.some(cargo => cargo.isLoading === false)
    ) {
      setButtonActionLabel('Unloading')
    } else {
      setButtonActionLabel('Loading')
    }
  }, [navigationLogActions, navigationLogDetails, isCreateNavLogActionSuccess])

  useEffect(() => {
    if (updateNavlogDatesSuccess === 'SUCCESS' && focused) {
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
            color={Colors.white}
            mb={5}
            px="2"
            py="1"
            rounded="sm"
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
    setDidDateChange({
      ...didDateChange,
      Pln: {didUpdate: false},
      Eta: {didUpdate: false},
      Nor: {didUpdate: false},
      Doc: {didUpdate: false},
    })
    onPullToReload()
    reset()
  }

  const handleOnSaveDateUpdates = () => {
    updateNavlogDates(navlog?.id, dates)
  }

  const onDatesChange = (date: Date) => {
    const formattedDate = Vemasys.formatDate(date)
    switch (selectedType) {
      case 'PLN':
        setDates({...dates, plannedETA: formattedDate})
        setDidDateChange({...didDateChange, Pln: {didUpdate: true}})
        return
      case 'ETA':
        setDates({...dates, captainDatetimeETA: formattedDate})
        setDidDateChange({...didDateChange, Eta: {didUpdate: true}})
        return
      case 'NOR':
        setDates({...dates, announcedDatetime: formattedDate})
        setDidDateChange({...didDateChange, Nor: {didUpdate: true}})
        return
      case 'ARR':
        setDates({...dates, arrivalDatetime: formattedDate})
        return
      case 'DOC':
        setDates({...dates, terminalApprovedDeparture: formattedDate})
        setDidDateChange({...didDateChange, Doc: {didUpdate: true}})
        return
      case 'DEP':
        setDates({...dates, departureDatetime: formattedDate})
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
        date={dates.plannedETA}
        locked={isUnknownLocation ? true : navigationLogDetails?.locked}
        title="Planned"
        onChangeDate={() => {
          setSelectedType('PLN')
          setOpenDatePicker(true)
        }}
        onClearDate={() => {
          setDidDateChange({
            ...didDateChange,
            Pln: {didUpdate: _.isNull(dates.plannedETA) ? false : true},
          })
          setDates({...dates, plannedETA: null})
        }}
      />
      <DatetimePickerList
        date={dates.captainDatetimeETA}
        locked={isUnknownLocation ? true : navigationLogDetails?.locked}
        title="ETA"
        onChangeDate={() => {
          setSelectedType('ETA')
          setOpenDatePicker(true)
        }}
        onClearDate={() => {
          setDidDateChange({
            ...didDateChange,
            Eta: {didUpdate: _.isNull(dates.captainDatetimeETA) ? false : true},
          })
          setDates({
            ...dates,
            captainDatetimeETA: null,
          })
        }}
      />
    </Box>
  )

  const renderAnnouncingAndArrivalDates = () => (
    <Box>
      <DatetimePickerList
        date={dates.announcedDatetime}
        locked={isUnknownLocation ? true : navigationLogDetails?.locked}
        title="Notice of Readiness"
        onChangeDate={() => {
          setSelectedType('NOR')
          setOpenDatePicker(true)
        }}
        onClearDate={() => {
          setDidDateChange({
            ...didDateChange,
            Nor: {didUpdate: _.isNull(dates.announcedDatetime) ? false : true},
          })
          setDates({
            ...dates,
            announcedDatetime: null,
          })
        }}
      />

      <DatetimePickerList
        date={dates.arrivalDatetime}
        readOnly={true}
        title="Arrival"
      />
    </Box>
  )

  const renderDepartureDates = () => (
    <Box>
      <DatetimePickerList
        date={dates.terminalApprovedDeparture}
        locked={isUnknownLocation ? true : navigationLogDetails?.locked}
        title="Docs on Board"
        onChangeDate={() => {
          setSelectedType('DOC')
          setOpenDatePicker(true)
        }}
        onClearDate={() => {
          setDidDateChange({
            ...didDateChange,
            Doc: {
              didUpdate: _.isNull(dates.terminalApprovedDeparture)
                ? false
                : true,
            },
          })
          setDates({
            ...dates,
            terminalApprovedDeparture: null,
          })
        }}
      />

      <DatetimePickerList
        date={dates.departureDatetime}
        readOnly={true}
        title="Departure"
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
            alignItems="center"
            bg={Colors.white}
            borderColor={Colors.light}
            borderRadius={5}
            borderWidth={1}
            mt={ms(10)}
            px={ms(12)}
            py={ms(8)}
            shadow={1}
          >
            <Image
              alt="navlog-action-animated"
              height={ms(40)}
              mr={ms(10)}
              resizeMode="contain"
              source={renderAnimatedIcon(action?.type, action?.end)}
              width={ms(40)}
            />
            <Box flex="1">
              <HStack alignItems="center">
                <Text bold color={Colors.text} fontSize={ms(15)}>
                  {titleCase(action?.type)}
                </Text>
              </HStack>
              <Text color={Colors.secondary} fontWeight="medium">
                Start - {moment(action?.start).format('D MMM YYYY | HH:mm')}
              </Text>
              {_.isNull(action?.end) ? null : (
                <Text color={Colors.danger} fontWeight="medium">
                  End - {moment(action?.end).format('D MMM YYYY | HH:mm')}
                </Text>
              )}
            </Box>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={_.isNull(action?.end) ? false : true}
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
          bg={Colors.primary}
          flex="1"
          leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
          maxH={ms(40)}
          onPress={() =>
            navigation.navigate('AddEditNavlogAction', {
              method: 'add',
              actionType: buttonActionLabel,
            })
          }
        >
          <Text color={Colors.white} fontWeight="medium">
            New {buttonActionLabel}
          </Text>
        </Button>
        <Box w={ms(10)} />
        <Button
          bg={Colors.primary}
          flex="1"
          leftIcon={<Icon as={Ionicons} name="add" size="sm" />}
          maxH={ms(40)}
          onPress={() =>
            navigation.navigate('AddEditNavlogAction', {
              method: 'add',
              actionType: 'Cleaning',
            })
          }
        >
          <Text color={Colors.white} fontWeight="medium">
            Cleaning
          </Text>
        </Button>
      </HStack>
    </Box>
  )

  const CommentCard = ({comment, commentDescription}) => {
    let imgLinks: string[] = []
    const getAttrFromString = (str: string) => {
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
          {imgLinks.length > 0 ? (
            <FlatList
              horizontal
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
                      h={ms(114)}
                      mr={ms(10)}
                      source={{uri: image.item}}
                      w={ms(136)}
                    />
                  </TouchableOpacity>
                )
              }}
              // maxH={ms(120)}
              data={imgLinks}
              keyExtractor={item => item}
              removeClippedSubviews={true}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
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
        alignItems="center"
        bg={Colors.white}
        borderColor={Colors.light}
        borderRadius={ms(5)}
        borderWidth={1}
        justifyContent="space-between"
        mb={ms(10)}
        p={ms(10)}
        shadow={3}
      >
        <Text bold>{contact.name}</Text>
        <Image
          alt="charter-contact"
          resizeMode="contain"
          source={Icons.charter_contact}
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
      end: Vemasys.defaultDatetime(),
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

  const onCancelUnsavedChanges = () => {
    setDates({
      ...dates,
      plannedETA: navigationLogDetails?.plannedEta,
      captainDatetimeETA: navigationLogDetails?.captainDatetimeEta,
      announcedDatetime: navigationLogDetails?.announcedDatetime,
      terminalApprovedDeparture:
        navigationLogDetails?.terminalApprovedDeparture,
    })
    setDidDateChange({
      ...didDateChange,
      Pln: {didUpdate: false},
      Eta: {didUpdate: false},
      Nor: {didUpdate: false},
      Doc: {didUpdate: false},
    })
  }

  const onProceedToNextTab = () => {
    setLeaveTabModal(false)
    setDates({
      ...dates,
      plannedETA: navigationLogDetails?.plannedEta,
      captainDatetimeETA: navigationLogDetails?.captainDatetimeEta,
      announcedDatetime: navigationLogDetails?.announcedDatetime,
      terminalApprovedDeparture:
        navigationLogDetails?.terminalApprovedDeparture,
    })
    setDidDateChange({
      ...didDateChange,
      Pln: {didUpdate: false},
      Eta: {didUpdate: false},
      Nor: {didUpdate: false},
      Doc: {didUpdate: false},
    })
  }

  const onPullToReload = () => {
    getNavigationLogDetails(navlog.id)
    getNavigationLogActions(navlog?.id)
    getNavigationLogComments(navlog.id)
  }

  if (
    isPlanningLoading ||
    isPlanningDetailsLoading ||
    isPlanningActionsLoading ||
    isPlanningCommentsLoading
  ) {
    return <LoadingAnimated />
  }
  return (
    <Box flex="1">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={
              isPlanningLoading ||
              isPlanningDetailsLoading ||
              isPlanningActionsLoading ||
              isPlanningCommentsLoading
            }
            onRefresh={onPullToReload}
          />
        }
        bg={Colors.white}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 30}}
        px={ms(12)}
        py={ms(20)}
        scrollEventThrottle={16}
      >
        {/* Location Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)}>
          Location
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderLocation()}
        {/* End of Location Section */}
        {/* Planning dates Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(20)}>
          Planning
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderPlanningDates()}
        {/* End of Planning dates Section */}
        {/* Announcing&Arrival dates Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(10)}>
          Announcing and Arrival
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderAnnouncingAndArrivalDates()}
        {/* End of Announcing&Arrival dates Section */}
        {/* Actions Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(10)}>
          Actions
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderNavlogActions()}
        {/* End of Actions Section */}
        {/* Announcing&Arrival dates Section */}
        <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(20)}>
          Departure
        </Text>
        <Divider bg={Colors.light} h={ms(2)} my={ms(8)} />
        {renderDepartureDates()}
        {/* End of Announcing&Arrival dates Section */}
        {/* Contact Information Section */}
        {isUnknownLocation ? null : (
          <>
            <Text bold color={Colors.azure} fontSize={ms(20)} mt={ms(20)}>
              {t('contactInformation')}
            </Text>
            <Box my={ms(15)}>
              {navigationLogDetails?.contacts?.length > 0 ? (
                navigationLogDetails?.contacts.map(
                  (contact: any, index: number) =>
                    renderContactInformation(contact.contact, index)
                )
              ) : (
                <Box
                  bg={Colors.white}
                  borderColor={Colors.light}
                  borderRadius={5}
                  borderWidth={1}
                  mt={ms(10)}
                  p={ms(16)}
                  shadow={2}
                >
                  <Text>{t('noContactInformation')}</Text>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Comments Section */}
        <HStack alignItems="center" mt={ms(20)}>
          <Text bold color={Colors.azure} fontSize={ms(20)}>
            {t('comments')}
          </Text>
          {navigationLogComments?.length > 0 ? (
            <Box
              bg={Colors.azure}
              borderRadius={ms(20)}
              height={ms(22)}
              ml={ms(10)}
              width={ms(22)}
            >
              <Text bold color={Colors.white} textAlign="center">
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
            mb={ms(20)}
            mt={ms(20)}
            onPress={() =>
              navigation.navigate('AddEditComment', {
                method: 'add',
                routeFrom: 'Planning',
              })
            }
          >
            {t('addComment')}
          </Button>
        )}

        <DatePicker
          modal
          date={new Date()}
          mode="datetime"
          open={openDatePicker}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
          onConfirm={date => {
            setOpenDatePicker(false)
            onDatesChange(date)
          }}
        />
        <Modal
          animationPreset="slide"
          isOpen={confirmModal}
          px={ms(12)}
          size="full"
        >
          <Modal.Content>
            <Modal.Header>Confirmation</Modal.Header>
            <Text fontWeight="medium" mx={ms(12)} my={ms(20)}>
              Are you sure you want to stop this action?
            </Text>
            <HStack>
              <Button
                bg={Colors.grey}
                flex="1"
                m={ms(12)}
                onPress={() => setConfirmModal(false)}
              >
                <Text color={Colors.disabled} fontWeight="medium">
                  Cancel
                </Text>
              </Button>
              <Button
                bg={Colors.danger}
                flex="1"
                m={ms(12)}
                onPress={onStopAction}
              >
                <Text color={Colors.white} fontWeight="medium">
                  Stop
                </Text>
              </Button>
            </HStack>
          </Modal.Content>
        </Modal>
        <Modal
          animationPreset="slide"
          isOpen={leaveTabModal}
          px={ms(12)}
          size="full"
        >
          <Modal.Content>
            <Modal.Header>Confirmation</Modal.Header>
            <Text fontWeight="medium" mx={ms(12)} my={ms(20)}>
              There are unsaved changes in this page. Are you sure you want to
              proceed?
            </Text>
            <HStack>
              <Button
                bg={Colors.grey}
                flex="1"
                m={ms(12)}
                onPress={() => {
                  setLeaveTabModal(false), navigation.goBack()
                }}
              >
                <Text color={Colors.disabled} fontWeight="medium">
                  No
                </Text>
              </Button>
              <Button
                bg={Colors.danger}
                flex="1"
                m={ms(12)}
                onPress={onProceedToNextTab}
              >
                <Text color={Colors.white} fontWeight="medium">
                  Yes
                </Text>
              </Button>
            </HStack>
          </Modal.Content>
        </Modal>
      </ScrollView>
      {unsavedChanges.length > 0 ? (
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
                onPress={onCancelUnsavedChanges}
              >
                Cancel
              </Button>
              <Button
                bg={Colors.primary}
                flex="1"
                m={ms(16)}
                onPress={handleOnSaveDateUpdates}
              >
                Save
              </Button>
            </HStack>
          </Shadow>
        </Box>
      ) : null}

      <Modal isOpen={viewImg} size="full" onClose={() => setViewImg(false)}>
        <Modal.Content>
          <Image
            alt="file-preview"
            h="100%"
            resizeMode="contain"
            source={{uri: selectedImg.uri}}
            w="100%"
          />
        </Modal.Content>
      </Modal>
    </Box>
  )
}

export default Details
